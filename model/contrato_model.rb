class ContratoModel
  attr_accessor :ctr_id, :imv_id, :usu_id

  def initialize(ctr_id, imv_id, usu_id)
    @ctr_id = ctr_id
    @imv_id = imv_id
    @usu_id = usu_id
  end

  def self.map(row)
    ContratoModel.new(
      row['ctr_id'],
      row['imv_id'],
      row['usu_id']
    )
  end

  def validation
    return 'Imóvel incorreto' if @imv_id.nil? || @imv_id.to_i <= 0
    return 'Usuário incorreto' if @usu_id.nil? || @usu_id.to_i <= 0

    nil
  end

end
