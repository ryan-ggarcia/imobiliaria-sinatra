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

  def find_by(usu_id)
    usuario = buscar_ativo(usu_id)
    return [404, { msg: 'Usuário não encontrado!' }] unless usuario

    [200, to_hash(usuario, ocultar: [:usu_senha])]
  rescue => ex
    erro_interno(ex)
  end

  # senha em branco = mantém a senha atual; per_id ausente = mantém o perfil atual
  def atualizar(usu_id, params)
    atual = buscar_ativo(usu_id)
    return [404, { msg: 'Usuário não encontrado para atualização!' }] unless atual

    nova_senha = params['usu_senha'].to_s
    usuario = UsuarioModel.new(
      usu_id,
      params['usu_nome'],
      params['usu_email'].to_s.strip.downcase,
      nova_senha.empty? ? atual.usu_senha : nova_senha,
      params['per_id'] || atual.per_id
    )

    erro = usuario.validation
    return [400, { msg: erro }] if erro
    return [400, { msg: 'A senha deve ter pelo menos 6 caracteres' }] if !nova_senha.empty? && nova_senha.length < 6

    outro = @dao.find_by_email(usuario.usu_email, @db)
    if outro && outro.usu_id != usu_id
      return [409, { msg: 'Já existe um usuário com este e-mail!' }]
    end

    usuario.usu_senha = BCrypt::Password.create(nova_senha) unless nova_senha.empty?

    # update sem mudança nenhuma retorna 0 linhas afetadas, por isso não é tratado como erro
    @dao.update(usuario, @db)
    [200, { msg: 'Usuário atualizado com sucesso!' }]
  rescue => ex
    erro_interno(ex)
  end

  # exclusão lógica (usu_ativo = false), feita no DAO
  def deletar(usu_id)
    return [404, { msg: 'Usuário não encontrado para exclusão!' }] unless buscar_ativo(usu_id)

    raise 'Erro durante exclusão do usuário no banco de dados!' unless @dao.delete(usu_id, @db)

    [200, { msg: 'Usuário excluído com sucesso!' }]
  rescue => ex
    erro_interno(ex)
  end

  private

  def buscar_ativo(usu_id)
    usuario = @dao.find_by_id(usu_id, @db)
    usuario if usuario && [true, 1].include?(usuario.usu_ativo)
  end

end
