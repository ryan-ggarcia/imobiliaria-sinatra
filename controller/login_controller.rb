require 'bcrypt'
require_relative 'base_controller'

class LoginController < BaseController

  def initialize(db = Database.instance)
    super
    @dao = UsuarioDao.new
  end

  # devolve os dados do usuário; a geração do token/sessão fica com o middleware
  def validar(params)
    email = params['email'].to_s.strip
    senha = params['senha'].to_s
    return [400, { msg: 'Email e senha não informados corretamente!' }] if email.empty? || senha.empty?

    usuario = @dao.find_by_email(email, @db)
    return [404, { msg: 'Usuário não encontrado!' }] unless usuario && senha_confere?(usuario.usu_senha, senha)

    [200, to_hash(usuario, ocultar: [:usu_senha])]
  rescue => ex
    erro_interno(ex)
  end

  private

  # a senha no banco é o hash gerado com BCrypt::Password.create
  def senha_confere?(hash, senha)
    BCrypt::Password.new(hash) == senha
  rescue BCrypt::Errors::InvalidHash
    false
  end

end
