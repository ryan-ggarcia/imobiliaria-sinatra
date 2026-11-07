class AluguelDao

  def create(entity,db)
    query = "insert into tb_aluguel(alu_mes,alu_vencimento,alu_valor,alu_pago,ctr_id) values(?,?,?,?,?)"
    values = [entity.alu_mes, entity.alu_vencimento, entity.alu_valor, entity.alu_pago, entity.ctr_id]
    result = db.executa_id(query, *values)
    result > 0 ? result : false
  end

  def read(db)
    query = "select * from tb_aluguel"
    rows = db.executa_select(query)
    list = []
    rows.each do |row|
      list << AluguelModel.map(row)
    end
    list
  end

  def find_by_id(alu_id,db)
    query = "select * from tb_aluguel where alu_id = ?"
    rows = db.executa_select(query, alu_id)
    rows.empty? ? nil : AluguelModel.map(rows.first)
  end

  def update(entity,db)
    query = "update tb_aluguel set alu_mes = ?, alu_vencimento = ?, alu_valor = ?, alu_pago = ?, ctr_id = ? where alu_id = ?"
    values = [entity.alu_mes, entity.alu_vencimento, entity.alu_valor, entity.alu_pago, entity.ctr_id, entity.alu_id]
    db.executa_comando(query, *values)
  end

  # exclusão física: tb_aluguel não tem coluna de ativo
  def delete(alu_id,db)
    query = "delete from tb_aluguel where alu_id = ?"
    db.executa_comando(query, alu_id)
  end
end
