class UsuarioDao

  def create(entity,db)
    query = "insert into tb_usuario(usu_nome,usu_email,usu_senha,per_id,usu_ativo) values(?,?,?,?,true)"
    values = [entity.usu_nome, entity.usu_email, entity.usu_senha, entity.per_id]
    result = db.executa_id(query, *values)
    result > 0 ? result : false
  end

  def read(db)
    query = "select * from tb_usuario where usu_ativo = true"
    rows = db.executa_select(query)
    list = []
    rows.each do |row|
      list << UsuarioModel.map(row)
    end
    list
  end

  def find_by_id(usu_id,db)
    query = "select * from tb_usuario where usu_id = ?"
    rows = db.executa_select(query, usu_id)
    rows.empty? ? nil : UsuarioModel.map(rows.first)
  end

  # usado no login
  def find_by_email(usu_email,db)
    query = "select * from tb_usuario where usu_email = ? and usu_ativo = true"
    rows = db.executa_select(query, usu_email)
    rows.empty? ? nil : UsuarioModel.map(rows.first)
  end

  def update(entity,db)
    query = "update tb_usuario set usu_nome = ?, usu_email = ?, usu_senha = ?, per_id = ? where usu_id = ?"
    values = [entity.usu_nome, entity.usu_email, entity.usu_senha, entity.per_id, entity.usu_id]
    db.executa_comando(query, *values)
  end

  # exclusão lógica: só marca o usuário como inativo
  def delete(usu_id,db)
    query = "update tb_usuario set usu_ativo = false where usu_id = ?"
    db.executa_comando(query, usu_id)
  end
end
