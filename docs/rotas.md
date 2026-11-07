# Rotas

Base: `http://localhost:5000`. Corpo sempre em JSON. 🔒 = exige login.

| Método | Rota | Corpo | Sucesso | Erros |
|---|---|---|---|---|
| POST | `/login` | `email`, `senha` | 200 `{token}` + cookie | 400, 404 |
| POST | `/logout` 🔒 | — | 200 | 401 |
| POST | `/usuario` | `usu_nome`, `usu_email`, `usu_senha` | 201 usuário | 400, 409 |
| GET | `/usuario` 🔒 | — | 200 lista / 204 vazia | 401 |
| GET | `/imovel` 🔒 | — | 200 lista / 204 vazia | 401 |
| POST | `/imovel` 🔒 | campos `imv_*` | 201 imóvel | 400, 401 |
| PUT | `/imovel/:id` 🔒 | campos `imv_*` | 200 | 400, 401, 404 |
| DELETE | `/imovel/:id` 🔒 | — | 200 | 401, 404, 409 |
| POST | `/locacao` 🔒 | `imv_id` | 200 `{msg, ctr_id}` | 400, 401 |
| GET | `/docs` | — | Swagger UI | — |

Erros sempre no formato `{"msg": "..."}`. Um corpo que não é JSON válido
devolve `400 JSON inválido!`; erros inesperados devolvem `500 Erro interno no servidor!`
(o detalhe vai para o log do servidor, nunca para o cliente).

## Exemplos com `curl`

O `-c`/`-b cookies.txt` guarda e reenvia o cookie do login.

```bash
# cadastrar usuário
curl -X POST localhost:5000/usuario -H 'Content-Type: application/json' \
  -d '{"usu_nome":"Ana","usu_email":"ana@email.com","usu_senha":"123456"}'

# login (salva o cookie)
curl -c cookies.txt -X POST localhost:5000/login -H 'Content-Type: application/json' \
  -d '{"email":"ana@email.com","senha":"123456"}'

# cadastrar imóvel
curl -b cookies.txt -X POST localhost:5000/imovel -H 'Content-Type: application/json' \
  -d '{"imv_descricao":"Casa 2 quartos","imv_cep":"19015-000","imv_endereco":"Rua das Flores, 100",
       "imv_bairro":"Centro","imv_cidade":"Presidente Prudente","imv_valor":1500}'

# listar imóveis
curl -b cookies.txt localhost:5000/imovel

# atualizar imóvel 1
curl -b cookies.txt -X PUT localhost:5000/imovel/1 -H 'Content-Type: application/json' \
  -d '{"imv_descricao":"Casa reformada","imv_cep":"19015-000","imv_endereco":"Rua das Flores, 100",
       "imv_bairro":"Centro","imv_cidade":"Presidente Prudente","imv_valor":1700,"imv_disponivel":"S"}'

# alugar imóvel 1
curl -b cookies.txt -X POST localhost:5000/locacao -H 'Content-Type: application/json' \
  -d '{"imv_id":1}'

# excluir imóvel 1 (409 se tiver contrato)
curl -b cookies.txt -X DELETE localhost:5000/imovel/1

# sair
curl -b cookies.txt -c cookies.txt -X POST localhost:5000/logout
```

## Regras de negócio

**Imóvel**
- Todos os campos obrigatórios; CEP com 8 dígitos; valor entre 0,01 e 9999,99;
  `imv_disponivel` `S` ou `N` (padrão `S` no cadastro).
- Não pode ser excluído se tiver contrato (409).

**Locação**
- Só imóveis existentes e com `imv_disponivel = 'S'`.
- Gera 1 contrato para o usuário logado e **12 aluguéis** (contrato de 1 ano),
  com o valor do imóvel, vencendo no mesmo dia dos 12 meses seguintes.
  Dias que não existem no mês são ajustados (31/01 → 28/02).
- Marca o imóvel como `N`.
- Tudo em uma transação: se um passo falhar, nada é gravado.

**Usuário**
- Cadastro público, sempre como Locatário; e-mail único; senha ≥ 6 caracteres,
  gravada com BCrypt.
- A senha nunca aparece nas respostas.
