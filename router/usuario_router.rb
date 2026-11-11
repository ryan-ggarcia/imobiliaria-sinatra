module UsuarioRouter
  def self.registered(app)

    app.get '/usuario' do
      responder UsuarioController.new.listar
    end

    # rota pública (liberada no AutenticacaoMiddleware)
    app.post '/usuario' do
      responder UsuarioController.new.cadastrar(corpo)
    end

    app.get '/usuario/:id' do
      responder UsuarioController.new.find_by(params[:id].to_i)
    end

    app.put '/usuario/:id' do
      responder UsuarioController.new.atualizar(params[:id].to_i, corpo)
    end

    app.delete '/usuario/:id' do
      responder UsuarioController.new.deletar(params[:id].to_i)
    end

  end
end
