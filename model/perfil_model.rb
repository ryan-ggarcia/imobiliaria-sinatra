class PerfilModel
  attr_accessor :per_id, :per_descricao

  def initialize(per_id, per_descricao)
    @per_id = per_id
    @per_descricao = per_descricao
  end

  def self.map(row)
    PerfilModel.new(
      row['per_id'],
      row['per_descricao']
    )
  end

  def validation
    return 'Descrição incorreta' if @per_descricao.to_s.strip.empty?

    nil
  end

end
