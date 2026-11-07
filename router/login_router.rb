module LoginRouter
  def self.registered(app)

    app.post '/login' do
      codigo, usuario = LoginController.new.validar(corpo)
      return responder([codigo, usuario]) unless codigo == 200

      token = AutenticacaoMiddleware.gerar_jwt(usuario[:usu_id], usuario[:usu_nome], usuario[:usu_email], usuario[:per_id])
      response.set_cookie(AutenticacaoMiddleware::COOKIE, value: token, httponly: true, path: '/')
      responder([200, { token: token }])
    end

    app.post '/logout' do
      response.delete_cookie(AutenticacaoMiddleware::COOKIE, path: '/')
      responder([200, { msg: 'Logout realizado com sucesso!' }])
    end

  end
end
