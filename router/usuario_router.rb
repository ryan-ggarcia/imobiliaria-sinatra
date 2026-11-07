module UsuarioRouter
  def self.registered(app)

    app.get '/usuario' do
      responder UsuarioController.new.listar
    end

    # rota pública (liberada no AutenticacaoMiddleware)
    app.post '/usuario' do
      responder UsuarioController.new.cadastrar(corpo)
    end

  end
end
