# Swagger

O Swagger é uma página que **documenta e testa a API** pelo navegador. Fica em:

**http://localhost:5000/docs**

## Como foi integrado

No projeto Node, o `swagger-autogen` lia comentários nas rotas e gerava o
`swagger-output.json`, que o `swagger-ui-express` exibia. No Sinatra não
existe um equivalente maduro a esse gerador, então a integração tem duas
partes simples e **nenhuma gem nova**:

| Arquivo | O que é |
|---|---|
| `swagger/openapi.yaml` | a **especificação OpenAPI 3**: rotas, parâmetros, corpos e respostas. Escrita à mão |
| `swagger/index.html` | página que carrega o **Swagger UI** de um CDN e mostra o `openapi.yaml` |
| `router/swagger_router.rb` | serve as duas URLs abaixo |

| URL | Conteúdo |
|---|---|
| `GET /docs` | a página do Swagger UI |
| `GET /docs/openapi.yaml` | a especificação crua (útil para importar no Postman/Insomnia) |

As duas são rotas públicas no `AutenticacaoMiddleware`.

> O Swagger UI é baixado de `cdn.jsdelivr.net`, então a página precisa de
> internet. Para usar offline, baixe os arquivos `swagger-ui.css` e
> `swagger-ui-bundle.js` do pacote `swagger-ui-dist`, coloque em `swagger/`,
> sirva pelo `SwaggerRouter` e troque os links no `index.html`.

## Como usar

1. Suba o servidor: `rake api:start`.
2. Abra `http://localhost:5000/docs`.
3. Se ainda não tem usuário: **Usuário → POST /usuario → Try it out**, preencha
   e clique em **Execute**.
4. **Login → POST /login → Try it out**, informe e-mail e senha, **Execute**.
   O servidor grava o cookie `token-pfs2` no navegador.
5. Pronto: as outras rotas já funcionam, porque o navegador envia o cookie
   sozinho. Não precisa colar o token no botão *Authorize*.
6. Para sair: **POST /logout**.

Se receber `401 Token inexistente!`, faça o login de novo (o token vence em 8 horas).

## Documentando uma rota nova

Sempre que criar uma rota em `router/`, acrescente-a no `swagger/openapi.yaml`.
Exemplo para um `GET /imovel/{id}`:

```yaml
paths:
  /imovel/{id}:
    parameters:
      - name: id
        in: path
        required: true
        schema: { type: integer }
    get:                                   # <- novo
      tags: [Imóvel]
      summary: Busca um imóvel pelo id
      responses:
        "200":
          description: Imóvel encontrado
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Imovel" }
        "401": { $ref: "#/components/responses/NaoAutenticado" }
        "404": { $ref: "#/components/responses/NaoEncontrado" }
```

Dicas:

- **`$ref`** reaproveita definições de `components` (schemas como `Imovel` e
  respostas como `NaoEncontrado`), evitando repetição.
- Rotas **públicas** levam `security: []`; as outras herdam o `cookieAuth`
  global e mostram um cadeado na página.
- Em desenvolvimento, basta salvar o YAML e recarregar a página.
- Para conferir se o YAML está válido, cole o conteúdo em
  https://editor.swagger.io — ele aponta os erros linha a linha.
- Teste rápido de sintaxe no terminal:
  `ruby -ryaml -e 'YAML.load_file("swagger/openapi.yaml"); puts "ok"'`

## Por que escrito à mão?

Prós: zero dependências, controle total da documentação, formato padrão
(OpenAPI) que qualquer ferramenta entende.

Contra: se alguém mudar uma rota e esquecer o YAML, a documentação fica
desatualizada. A regra é simples: **mudou a rota, mude o `openapi.yaml` no
mesmo commit**.
