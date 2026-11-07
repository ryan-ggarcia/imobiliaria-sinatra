class UsuarioModel
  attr_accessor :usu_id, :usu_nome, :usu_email, :usu_senha, :per_id, :usu_ativo

  def initialize(usu_id, usu_nome, usu_email, usu_senha, per_id, usu_ativo = true)
    @usu_id = usu_id
    @usu_nome = usu_nome
    @usu_email = usu_email
    @usu_senha = usu_senha
    @per_id = per_id
    @usu_ativo = usu_ativo
  end

  def self.map(row)
    UsuarioModel.new(
      row['usu_id'],
      row['usu_nome'],
      row['usu_email'],
      row['usu_senha'],
      row['per_id'],
      row['usu_ativo']
    )
  end

  def validation
    return 'Nome incorreto' if @usu_nome.to_s.strip.empty?
    return 'E-mail incorreto' unless @usu_email.to_s.match?(/\A[^@\s]+@[^@\s]+\.[^@\s]+\z/)
    return 'Senha incorreta' if @usu_senha.to_s.strip.empty?
    return 'Perfil incorreto' if @per_id.nil? || @per_id.to_i <= 0

    nil
  end

end
