require 'bcrypt'
require_relative 'base_controller'

class UsuarioController < BaseController

  # perfil dado a quem se cadastra pela API (2 = Locatário no db.sql);
  # administradores precisam ser promovidos direto no banco
  PERFIL_LOCATARIO = 2

  def initialize(db = Database.instance)
    super
    @dao = UsuarioDao.new
  end

  def listar
    lista = @dao.read(@db)
    return [204, { msg: 'Nenhum usuário encontrado!' }] if lista.empty?

    [200, lista.map { |usuario| to_hash(usuario, ocultar: [:usu_senha]) }]
  rescue => ex
    erro_interno(ex)
  end

  def cadastrar(params)
    usuario = UsuarioModel.new(
      nil,
      params['usu_nome'],
      params['usu_email'].to_s.strip.downcase,
      params['usu_senha'],
      PERFIL_LOCATARIO
    )

    # valida com a senha ainda em texto puro
    erro = usuario.validation
    return [400, { msg: erro }] if erro
    return [400, { msg: 'A senha deve ter pelo menos 6 caracteres' }] if usuario.usu_senha.to_s.length < 6

    if @dao.find_by_email(usuario.usu_email, @db)
      return [409, { msg: 'Já existe um usuário com este e-mail!' }]
    end

    # nunca grava a senha em texto puro
    usuario.usu_senha = BCrypt::Password.create(usuario.usu_senha)

    id = @dao.create(usuario, @db)
    raise 'Erro ao inserir usuário no banco de dados' unless id

    usuario.usu_id = id
    [201, to_hash(usuario, ocultar: [:usu_senha])]
  rescue => ex
    erro_interno(ex)
  end

end
