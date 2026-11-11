module ImovelRouter
  def self.registered(app)

    app.get '/imovel' do
      responder ImovelController.new.listar
    end

    app.post '/imovel' do
      responder ImovelController.new.cadastrar(corpo)
    end

    app.get '/imovel/:id' do
      responder ImovelController.new.find_by(params[:id].to_i)
    end

    app.put '/imovel/:id' do
      responder ImovelController.new.atualizar(params[:id].to_i, corpo)
    end

    app.delete '/imovel/:id' do
      responder ImovelController.new.deletar(params[:id].to_i)
    end

  end
end
