class PerfilDao

  def create(entity,db)
    query = "insert into tb_perfil(per_descricao) values(?)"
    values = [entity.per_descricao]
    result = db.executa_id(query, *values)
    result > 0 ? result : false
  end

  def read(db)
    query = "select * from tb_perfil"
    rows = db.executa_select(query)
    list = []
    rows.each do |row|
      list << PerfilModel.map(row)
    end
    list
  end

  def find_by_id(per_id,db)
    query = "select * from tb_perfil where per_id = ?"
    rows = db.executa_select(query, per_id)
    rows.empty? ? nil : PerfilModel.map(rows.first)
  end

  def update(entity,db)
    query = "update tb_perfil set per_descricao = ? where per_id = ?"
    values = [entity.per_descricao, entity.per_id]
    db.executa_comando(query, *values)
  end

  # exclusão física: tb_perfil não tem coluna de ativo
  def delete(per_id,db)
    query = "delete from tb_perfil where per_id = ?"
    db.executa_comando(query, per_id)
  end
end
