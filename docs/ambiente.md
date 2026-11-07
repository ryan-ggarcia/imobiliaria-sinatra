# Configurando o ambiente

Os comandos são para **Arch Linux**; em outras distros os nomes dos pacotes mudam.

## 1. Ruby

O projeto usa Ruby 4 via **rbenv**. Confira:

```bash
ruby -v
```

## 2. Biblioteca do MySQL/MariaDB

A gem `mysql2` é compilada na instalação e precisa da biblioteca cliente do
MySQL. Sem ela o `bundle install` falha com:

```
mysql client is missing. You may need to 'sudo apt-get install libmariadb-dev'...
```

A mensagem sugere `apt-get`, que não existe no Arch. No Arch o pacote é:

```bash
sudo pacman -S mariadb-libs
```

Se ainda falhar, aponte o `mariadb_config` manualmente:

```bash
bundle config set build.mysql2 --with-mysql-config=/usr/bin/mariadb_config
```

> Só precisa do **servidor** MariaDB (`sudo pacman -S mariadb`) se for rodar o
> banco na sua máquina. O banco da disciplina fica em um servidor remoto.

## 3. Dependências do projeto

```bash
bundle install
```

| Gem | Para quê |
|---|---|
| `sinatra`, `sinatra-contrib` | framework web e recarregamento automático em desenvolvimento |
| `puma`, `rackup` | servidor HTTP |
| `mysql2` | acesso ao banco |
| `bcrypt` | hash de senhas |
| `jwt` | token de autenticação |
| `dotenv` | lê o arquivo `.env` |
| `ruby-lsp` | autocomplete e "ir para definição" no editor (só desenvolvimento) |

## 4. Arquivo `.env`

As credenciais **não ficam no código**. Copie o modelo e preencha:

```bash
cp .env.example .env
```

```dotenv
DB_HOST=132.226.245.178
DB_USER=seu_ra
DB_SENHA=seu_ra
DB_NOME=PFS2_seu_ra
DB_PORTA=3306

JWT_SEGREDO=um-valor-longo-e-aleatorio
```

Para gerar um segredo forte:

```bash
ruby -rsecurerandom -e 'puts SecureRandom.hex(32)'
```

O `.env` está no `.gitignore`: **nunca faça commit dele**. O `.env.example`
(sem valores) é que vai para o repositório.

## 5. Criar as tabelas

Rode o `db/db.sql` no seu banco (pelo DBeaver, MySQL Workbench ou terminal):

```bash
mariadb -h 132.226.245.178 -u SEU_RA -p PFS2_SEU_RA < db/db.sql
```

## 6. Subir o servidor

```bash
rake api:start
```

A API fica em `http://localhost:5000` e o Swagger em `http://localhost:5000/docs`.
Em desenvolvimento, alterações nos arquivos são recarregadas sem reiniciar
(`Sinatra::Reloader`). Mudanças no `.env` ou no middleware exigem reiniciar.

## 7. Ruby LSP no editor

```bash
gem install ruby-lsp
```

- **VS Code:** extensão *Ruby LSP* (`Shopify.ruby-lsp`).
- **Neovim:** `require('lspconfig').ruby_lsp.setup{}` ou `:MasonInstall ruby-lsp`.
- **Zed / Helix:** suporte embutido.

Se aparecer `command not found`, adicione os binários das gems ao `PATH`:

```bash
export PATH="$(gem env user_gemhome)/bin:$PATH"
```

O Ruby LSP indexa todos os arquivos do projeto, então ele entende as classes
mesmo com o carregamento dinâmico do `server.rb` (`Dir[...].each { require }`).
