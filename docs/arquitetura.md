# Arquitetura

## Camadas

```
Requisição HTTP
     │
     ▼
AutenticacaoMiddleware   confere o token JWT (exceto rotas públicas)
     │
     ▼
Router (router/)         HTTP: lê URL/JSON, chama a controller, devolve a resposta
     │
     ▼
Controller (controller/) regra de negócio: decide o que pode e o que não pode
     │
     ▼
DAO (dao/)               SQL de cada tabela
     │
     ▼
Database (db/db.rb)      conexão única com o MySQL (Singleton)
```

A **Model** (`model/`) atravessa todas as camadas: representa uma linha de
tabela, sabe se montar a partir do banco (`Model.map(row)`) e se validar
(`model.validation`).

| Camada | Sabe de HTTP? | Sabe de SQL? | Exemplo |
|---|---|---|---|
| Router | sim | não | `post '/locacao'` lê o JSON e chama `LocacaoController#locar` |
| Controller | não | não | "imóvel alugado não pode ser locado de novo" |
| DAO | não | sim | `insert into tb_contrato ...` |
| Model | não | não | "CEP precisa ter 8 dígitos" |

Cada camada só conversa com a de baixo. Isso permite trocar uma sem mexer nas
outras: mudar de MySQL para PostgreSQL afeta só DAO e Database; trocar
Sinatra por Rails afeta só os routers.

## O caminho de uma requisição

Exemplo: `POST /locacao` com `{"imv_id": 1}`.

1. **Middleware** lê o cookie `token-pfs2`, valida o JWT, busca o usuário e
   guarda em `env['usuario']`.
2. **`router/locacao_router.rb`** lê o corpo com o helper `corpo` e chama
   `LocacaoController.new.locar(corpo['imv_id'], usuario_logado)`.
3. **`LocacaoController#locar`** abre uma transação, confere se o imóvel está
   disponível, cria o contrato, os 12 aluguéis e marca o imóvel como `N`.
   Devolve `[200, { msg: ..., ctr_id: ... }]`.
4. O router repassa com o helper `responder`, que define o status e
   converte o Hash em JSON.

## Contrato entre router e controller

Todo método de controller devolve um array `[status, corpo]`:

```ruby
[201, { imv_id: 5, imv_descricao: "Casa", ... }]
[400, { msg: "CEP incorreto" }]
```

O router não decide nada: só repassa. Por isso cada rota tem uma linha:

```ruby
app.post '/imovel' do
  responder ImovelController.new.cadastrar(corpo)
end
```

## Por que `< BaseController` e não `< Sinatra::Base`?

O controller **não é uma aplicação web**; é só a regra de negócio.

1. **`Sinatra::Base` é uma aplicação Rack inteira**, com rotas, filtros,
   sessões e middleware. Se cada controller herdasse dela, cada um viraria
   um app web separado, e a regra de negócio ficaria presa ao HTTP.
2. **Ruby só tem herança simples.** Herdando de `Sinatra::Base`, o controller
   não poderia herdar de mais nada. O `BaseController` guarda apenas o que
   todos os controllers dividem:
   - `@db` — a conexão (`Database.instance`);
   - `to_hash(model, ocultar: [...])` — converte a model para JSON, escondendo
     campos como `usu_senha`;
   - `erro_interno(ex)` — registra o erro no log e devolve o 500 padrão.
3. **Testar fica simples.** Dá para chamar
   `ImovelController.new.cadastrar({...})` direto, sem subir servidor nem
   simular requisição HTTP.
4. **Troca de framework.** Os controllers não dependem do Sinatra; se o
   projeto for para Rails ou Roda, só os routers mudam.

É a mesma divisão do projeto Node original: `routes/` usa o Express, e
`controllers/` são classes JavaScript comuns, que não herdam do Express.

## Por que os routers são módulos e não `Sinatra::Base`?

Cada arquivo em `router/` é uma **extensão do Sinatra**:

```ruby
module ImovelRouter
  def self.registered(app)        # chamado pelo `register ImovelRouter`
    app.get '/imovel' do ... end  # define a rota no App principal
  end
end
```

e o `server.rb` registra todas:

```ruby
register LoginRouter
register ImovelRouter
...
```

A alternativa seria cada router ser um `Sinatra::Base` separado e montado com
`use`. Usamos módulos porque assim:

- existe **um único app**, e o middleware de autenticação roda uma vez por requisição;
- os helpers (`corpo`, `responder`, `usuario_logado`) definidos no `server.rb`
  ficam disponíveis em todas as rotas, sem repetir código.

## Carregamento dos arquivos

O `server.rb` não tem um `require` por arquivo. Ele carrega pastas inteiras:

```ruby
Dir[File.join(__dir__, "model", "*.rb")].each { |f| require f }
```

- `__dir__` é a pasta do `server.rb`;
- `Dir[...]` lista os arquivos que casam com o padrão, em ordem alfabética;
- cada um recebe um `require`.

A **ordem das pastas importa**: model → dao → middleware → controller →
router, porque cada camada usa a anterior. Dentro de uma pasta, se um arquivo
depende de outro que vem depois no alfabeto, use `require_relative` no topo
(é o que os controllers fazem com o `base_controller`).
