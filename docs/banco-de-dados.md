# Banco de dados

## Tabelas (`db/db.sql`)

```
tb_perfil (per_id, per_descricao)
    ▲
    │ per_id
tb_usuario (usu_id, usu_nome, usu_email, usu_senha, usu_ativo, per_id)
    ▲
    │ usu_id
tb_contrato (ctr_id, imv_id, usu_id) ───imv_id──▶ tb_imovel (imv_id, imv_descricao, imv_cep,
    ▲                                                        imv_endereco, imv_bairro, imv_cidade,
    │ ctr_id                                                 imv_valor, imv_disponivel)
tb_aluguel (alu_id, alu_mes, alu_vencimento, alu_valor, alu_pago, ctr_id)
```

- Perfis criados pelo script: **1 = Administrador**, **2 = Locatário**.
- `imv_disponivel` e `alu_pago` usam `'S'`/`'N'`.
- `imv_valor` e `alu_valor` são `decimal(6,2)`: **máximo 9999,99**. Para
  aluguéis maiores, aumente para `decimal(10,2)` e ajuste a validação nas models.

## Conexão em Singleton (`db/db.rb`)

**Singleton** é um padrão em que uma classe tem **uma única instância** no
programa inteiro. Para a conexão com o banco, isso significa:

- uma conexão só, reaproveitada por todas as requisições, em vez de abrir uma
  nova a cada `Database.new`;
- um ponto único de acesso: `Database.instance`.

O Ruby já traz isso pronto no módulo `Singleton`:

```ruby
require "singleton"

class Database
  include Singleton   # torna o .new privado e cria o .instance
  ...
end
```

```ruby
db = Database.instance
Database.instance.equal?(db)   # => true, sempre o mesmo objeto
Database.new                   # => NoMethodError (private method 'new')
```

A conexão só é aberta no **primeiro** `Database.instance` (na primeira
requisição), e os dados vêm do `.env` (`DB_HOST`, `DB_USER`, `DB_SENHA`,
`DB_NOME`, `DB_PORTA`).

### Quem usa

Controllers e middleware recebem o banco no construtor, com o singleton como
padrão:

```ruby
def initialize(db = Database.instance)
```

Em testes, dá para passar um banco falso: `ImovelController.new(banco_falso)`.

### Cuidado com threads: o `Monitor`

O Puma atende várias requisições **ao mesmo tempo**, em threads diferentes,
mas um `Mysql2::Client` **não pode** ser usado por duas threads ao mesmo
tempo (os resultados se misturam ou dá erro de "commands out of sync").

Por isso todo acesso ao banco passa por um `Monitor`, que é um cadeado:

```ruby
def executa_select(sql, *values)
  @lock.synchronize do        # só uma thread por vez aqui dentro
    @client.prepare(sql).execute(*values).to_a
  end
end
```

Usamos `Monitor` e não `Mutex` porque o Monitor é **reentrante**: a mesma
thread pode entrar de novo. Isso é necessário na transação, que segura o
cadeado e, dentro dela, os DAOs chamam `executa_select`/`executa_comando`,
que pedem o mesmo cadeado. Com `Mutex` isso travaria (deadlock).

**Consequência:** as consultas ao banco são feitas uma por vez. Para uma API
de disciplina isso é ótimo. Para muito tráfego, o próximo passo seria um
**pool de conexões** (gem `connection_pool`), em que o singleton guarda o
pool em vez de uma conexão.

## Métodos do `Database`

| Método | Usa em | Retorna |
|---|---|---|
| `executa_comando(sql, *valores)` | INSERT, UPDATE, DELETE | `true` se alguma linha foi afetada |
| `executa_select(sql, *valores)` | SELECT | array de hashes (`row['coluna']`) |
| `executa_id(sql, *valores)` | INSERT | id gerado (`AUTO_INCREMENT`) |
| `transacao { ... }` | vários comandos que devem dar certo juntos | o valor do bloco |

Os `?` no SQL são preenchidos pelo **prepared statement**, nunca por
concatenação de strings. Isso impede SQL injection:

```ruby
db.executa_select("select * from tb_usuario where usu_email = ?", email)
```

## Transações

Uma locação grava em três tabelas: contrato, 12 aluguéis e imóvel. Se
falhar no 7º aluguel, não pode ficar um contrato pela metade. A transação
garante **tudo ou nada**:

```ruby
@db.transacao do
  ...                          # qualquer raise aqui desfaz tudo (ROLLBACK)
  [200, { msg: "..." }]        # terminou normalmente: COMMIT
end
```

O `transacao` usa `ensure`, então faz `ROLLBACK` em qualquer saída que não
seja o fim normal do bloco, inclusive exceções.

A verificação "o imóvel está disponível?" também fica **dentro** da
transação. Como o cadeado fica preso até o fim, duas pessoas tentando alugar
o mesmo imóvel no mesmo instante são atendidas uma depois da outra, e a
segunda recebe "não está disponível".

> Dentro do bloco, use `next valor` para sair mais cedo (não `return`).

## DAOs (`dao/`)

Uma por tabela, todas com a mesma interface:

| Método | SQL |
|---|---|
| `create(entity, db)` | `insert` → id ou `false` |
| `read(db)` | `select` de todos (usuário: só os ativos) |
| `find_by_id(id, db)` | `select ... where id = ?` → model ou `nil` |
| `update(entity, db)` | `update ... where id = ?` |
| `delete(id, db)` | `delete` (usuário: exclusão lógica, `usu_ativo = false`) |

Extra: `UsuarioDao#find_by_email`, usado no login e no cadastro.

Apagar um registro que outra tabela referencia (ex.: imóvel com contrato)
gera erro de chave estrangeira no MySQL (código 1451). O `ImovelController`
trata esse erro e responde **409**.
