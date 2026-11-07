class ImovelDao

  def create(entity,db)
    query = "insert into tb_imovel(imv_descricao,imv_cep,imv_endereco,imv_bairro,imv_cidade,imv_valor,imv_disponivel) values(?,?,?,?,?,?,?)"
    values = [entity.imv_descricao, entity.imv_cep, entity.imv_endereco, entity.imv_bairro, entity.imv_cidade, entity.imv_valor, entity.imv_disponivel]
    result = db.executa_id(query, *values)
    result > 0 ? result : false
  end

  def read(db)
    query = "select * from tb_imovel"
    rows = db.executa_select(query)
    list = []
    rows.each do |row|
      list << ImovelModel.map(row)
    end
    list
  end

  def find_by_id(imv_id,db)
    query = "select * from tb_imovel where imv_id = ?"
    rows = db.executa_select(query, imv_id)
    rows.empty? ? nil : ImovelModel.map(rows.first)
  end

  def update(entity,db)
    query = "update tb_imovel set imv_descricao = ?, imv_cep = ?, imv_endereco = ?, imv_bairro = ?, imv_cidade = ?, imv_valor = ?, imv_disponivel = ? where imv_id = ?"
    values = [entity.imv_descricao, entity.imv_cep, entity.imv_endereco, entity.imv_bairro, entity.imv_cidade, entity.imv_valor, entity.imv_disponivel, entity.imv_id]
    db.executa_comando(query, *values)
  end

  # exclusão física: tb_imovel não tem coluna de ativo
  def delete(imv_id,db)
    query = "delete from tb_imovel where imv_id = ?"
    db.executa_comando(query, imv_id)
  end
end
