module LocacaoRouter
  def self.registered(app)

    app.post '/locacao' do
      responder LocacaoController.new.locar(corpo['imv_id'], usuario_logado)
    end

  end
end
