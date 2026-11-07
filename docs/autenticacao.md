# Autenticação

## Visão geral

1. O usuário faz `POST /login` com e-mail e senha.
2. O servidor confere a senha e gera um **JWT** (JSON Web Token), um texto
   assinado com o segredo do servidor contendo id, nome, e-mail, perfil e
   validade.
3. O token vai para o cookie **`token-pfs2`** (`httponly`: o JavaScript da
   página não consegue ler, o que protege contra roubo por XSS).
4. Em toda requisição seguinte, o navegador envia o cookie, e o
   `AutenticacaoMiddleware` confere o token antes de chegar na rota.

## Middleware (`middleware/autenticacao_middleware.rb`)

É um **middleware Rack**: uma classe com `call(env)` que fica entre o
servidor e o app. Ligado no `server.rb` com:

```ruby
use AutenticacaoMiddleware
```

Para cada requisição:

| Situação | Resposta |
|---|---|
| rota pública | passa direto |
| sem cookie | 401 `Token inexistente!` |
| token alterado ou assinado com outro segredo | 401 `Token inválido!` |
| token vencido (mais de 8 horas) | 401 `Token expirado!` |
| usuário apagado ou inativo | 404 `Usuário não encontrado!` |
| tudo certo | guarda o usuário em `env['usuario']` e segue |

Nas rotas, o usuário logado está disponível pelo helper `usuario_logado`.

### Rotas públicas

Definidas por **método + caminho**, para que `POST /usuario` (cadastro) seja
público, mas `GET /usuario` (listagem) não:

```ruby
ROTAS_PUBLICAS = [
  ['POST', '/login'],
  ['POST', '/usuario'],
  ['GET',  '/docs'],
  ['GET',  '/docs/openapi.yaml']
].freeze
```

Para liberar uma rota nova, acrescente o par aqui e reinicie o servidor.

### Segredo e validade

- `JWT_SEGREDO` vem do `.env`. Quem conhece o segredo consegue gerar tokens
  válidos para qualquer usuário, então use um valor longo e aleatório e
  nunca faça commit dele. Sem a variável, o padrão é `RUBYONRAILS` (o mesmo
  do projeto Node), aceitável só em desenvolvimento.
- Validade: `VALIDADE = 8 * 60 * 60` (8 horas). Trocar o segredo invalida
  todos os tokens já emitidos.

## Senhas com BCrypt

As senhas **nunca** são gravadas em texto puro. No cadastro:

```ruby
usuario.usu_senha = BCrypt::Password.create(senha)   # "$2a$12$Kx9..."
```

No login:

```ruby
BCrypt::Password.new(hash_do_banco) == senha_digitada  # true/false
```

O BCrypt é lento de propósito e adiciona um "sal" aleatório: duas pessoas com
a mesma senha têm hashes diferentes, e testar milhões de senhas fica caro.

Login com e-mail inexistente ou senha errada devolve a **mesma** mensagem
(`Usuário não encontrado!`), para não revelar quais e-mails estão cadastrados.

## Cadastro de usuário (`POST /usuario`)

```json
{ "usu_nome": "Ana Souza", "usu_email": "ana@email.com", "usu_senha": "123456" }
```

| Situação | Resposta |
|---|---|
| nome vazio, e-mail inválido | 400 com a mensagem da validação |
| senha com menos de 6 caracteres | 400 |
| e-mail já cadastrado (sem diferenciar maiúsculas) | 409 |
| sucesso | 201 com o usuário, **sem** a senha |

Todo cadastro pela API recebe o perfil **2 (Locatário)**. Se o perfil viesse
do JSON, qualquer pessoa poderia se cadastrar como Administrador.

### Criando um administrador

Cadastre normalmente pela API e promova direto no banco:

```sql
update tb_usuario set per_id = 1 where usu_email = 'admin@email.com';
```

### Usuários antigos com senha em texto puro

Se já existirem usuários gravados antes do BCrypt, gere o hash e atualize:

```bash
bundle exec ruby -e 'require "bcrypt"; puts BCrypt::Password.create("senha_atual")'
```

```sql
update tb_usuario set usu_senha = '<hash gerado>' where usu_email = '...';
```
