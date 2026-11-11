require "sinatra/base"
require "sinatra/json"
require "json"
require "dotenv/load" # carrega o .env (ex.: JWT_SEGREDO)
require "rack/cors"

require_relative "db/db.rb"


Dir[File.join(__dir__, "model", "*.rb")].each { |f| require f }
Dir[File.join(__dir__, "dao", "*.rb")].each { |f| require f }
Dir[File.join(__dir__, "middleware", "*.rb")].each { |f| require f }
Dir[File.join(__dir__, "controller", "*.rb")].each { |f| require f }
Dir[File.join(__dir__, "router", "*.rb")].each { |f| require f }

class App < Sinatra::Base
  helpers Sinatra::JSON

  configure :development do
    require "sinatra/reloader"
    register Sinatra::Reloader
    also_reload File.join(__dir__, "router", "*.rb")
  end

  use Rack::Cors do
    allow do
      origins "http://localhost:3000"
      resource "*", headers: :any, methods: %i[get post put delete options], credentials: true
    end
  end

  # exige token JWT em todas as rotas, menos as públicas
  use AutenticacaoMiddleware

  helpers do
    # corpo da requisição em JSON -> Hash com chaves string
    def corpo
      @corpo ||= begin
        dados = JSON.parse(request.body.read)
        dados.is_a?(Hash) ? dados : {}
      rescue JSON::ParserError
        halt 400, json(msg: "JSON inválido!")
      end
    end

    # usuário logado, definido pelo AutenticacaoMiddleware
    def usuario_logado
      env["usuario"]
    end

    # recebe o [status, corpo] devolvido pelas controllers
    def responder(resultado)
      codigo, dados = resultado
      status codigo
      json dados
    end
  end

  # rotas (pasta router/)
  register LoginRouter
  register UsuarioRouter
  register ImovelRouter
  register LocacaoRouter
  register SwaggerRouter

end
