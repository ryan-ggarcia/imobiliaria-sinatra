# Documentação — API Imobiliária (Sinatra)

API de locação de imóveis, adaptada do projeto em Node/Express da disciplina PFS2.

| Arquivo | Assunto |
|---|---|
| [ambiente.md](ambiente.md) | Instalar Ruby, dependências, MariaDB, Ruby LSP e configurar o `.env` |
| [arquitetura.md](arquitetura.md) | Camadas do projeto, caminho de uma requisição, por que `< BaseController` |
| [banco-de-dados.md](banco-de-dados.md) | Tabelas, conexão em Singleton, transações, DAOs |
| [autenticacao.md](autenticacao.md) | Login com JWT, middleware, cadastro de usuário, senhas com BCrypt |
| [swagger.md](swagger.md) | Como o Swagger foi integrado, como usar e como documentar rotas novas |
| [rotas.md](rotas.md) | Lista de rotas com exemplos usando `curl` |

## Começo rápido

```bash
bundle install
cp .env.example .env      # e preencha os dados do banco
rake api:start            # http://localhost:5000
```

Depois abra **http://localhost:5000/docs** para testar a API pelo Swagger.

## Estrutura de pastas

```
imobiliaria-sinatra/
├── server.rb            # monta o app: carrega tudo, liga middleware e rotas
├── config.ru            # ponto de entrada do Rack (usado pelo rackup)
├── Rakefile             # rake api:start
├── .env                 # credenciais (NÃO vai para o git)
├── db/
│   ├── db.rb            # conexão com o banco (Singleton)
│   └── db.sql           # script de criação das tabelas
├── model/               # uma classe por tabela + validação
├── dao/                 # SQL de cada tabela
├── controller/          # regras de negócio
├── middleware/          # autenticação JWT
├── router/              # rotas HTTP (uma por recurso)
├── swagger/             # especificação OpenAPI + página do Swagger UI
└── docs/                # esta documentação
```
