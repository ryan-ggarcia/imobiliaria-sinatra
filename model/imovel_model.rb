class ImovelModel
  attr_accessor :imv_id, :imv_descricao, :imv_cep, :imv_endereco, :imv_bairro, :imv_cidade, :imv_valor, :imv_disponivel

  def initialize(imv_id, imv_descricao, imv_cep, imv_endereco, imv_bairro, imv_cidade, imv_valor, imv_disponivel = 'S')
    @imv_id = imv_id
    @imv_descricao = imv_descricao
    @imv_cep = imv_cep
    @imv_endereco = imv_endereco
    @imv_bairro = imv_bairro
    @imv_cidade = imv_cidade
    @imv_valor = imv_valor
    @imv_disponivel = imv_disponivel # 'S' = disponível, 'N' = alugado
  end

  def self.map(row)
    ImovelModel.new(
      row['imv_id'],
      row['imv_descricao'],
      row['imv_cep'],
      row['imv_endereco'],
      row['imv_bairro'],
      row['imv_cidade'],
      row['imv_valor'],
      row['imv_disponivel']
    )
  end

  def validation
    return 'Descrição incorreta' if @imv_descricao.to_s.strip.empty?
    return 'CEP incorreto' unless @imv_cep.to_s.gsub(/\D/, '').length == 8
    return 'Endereço incorreto' if @imv_endereco.to_s.strip.empty?
    return 'Bairro incorreto' if @imv_bairro.to_s.strip.empty?
    return 'Cidade incorreta' if @imv_cidade.to_s.strip.empty?
    # decimal(6,2) no banco: máximo 9999.99
    return 'Valor incorreto' if @imv_valor.nil? || @imv_valor.to_f <= 0 || @imv_valor.to_f > 9999.99
    return 'Disponibilidade incorreta' unless %w[S N].include?(@imv_disponivel.to_s)

    nil
  end

end
