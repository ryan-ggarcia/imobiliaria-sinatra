class ContratoDao

  def create(entity,db)
    query = "insert into tb_contrato(imv_id,usu_id) values(?,?)"
    values = [entity.imv_id, entity.usu_id]
    result = db.executa_id(query, *values)
    result > 0 ? result : false
  end

  def read(db)
    query = "select * from tb_contrato"
    rows = db.executa_select(query)
    list = []
    rows.each do |row|
      list << ContratoModel.map(row)
    end
    list
  end

  def find_by_id(ctr_id,db)
    query = "select * from tb_contrato where ctr_id = ?"
    rows = db.executa_select(query, ctr_id)
    rows.empty? ? nil : ContratoModel.map(rows.first)
  end

  def update(entity,db)
    query = "update tb_contrato set imv_id = ?, usu_id = ? where ctr_id = ?"
    values = [entity.imv_id, entity.usu_id, entity.ctr_id]
    db.executa_comando(query, *values)
  end

  # exclusão física: tb_contrato não tem coluna de ativo
  def delete(ctr_id,db)
    query = "delete from tb_contrato where ctr_id = ?"
    db.executa_comando(query, ctr_id)
  end
end
