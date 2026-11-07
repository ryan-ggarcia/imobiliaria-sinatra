require 'date'

class AluguelModel
  attr_accessor :alu_id, :alu_mes, :alu_vencimento, :alu_valor, :alu_pago, :ctr_id

  def initialize(alu_id, alu_mes, alu_vencimento, alu_valor, ctr_id, alu_pago = 'N')
    @alu_id = alu_id
    @alu_mes = alu_mes
    @alu_vencimento = alu_vencimento
    @alu_valor = alu_valor
    @ctr_id = ctr_id
    @alu_pago = alu_pago # 'S' = pago, 'N' = em aberto
  end

  def self.map(row)
    AluguelModel.new(
      row['alu_id'],
      row['alu_mes'],
      row['alu_vencimento'],
      row['alu_valor'],
      row['ctr_id'],
      row['alu_pago']
    )
  end

  def validation
    return 'Mês incorreto' unless (1..12).cover?(@alu_mes.to_i)
    return 'Vencimento incorreto' unless data_valida?(@alu_vencimento)
    # decimal(6,2) no banco: máximo 9999.99
    return 'Valor incorreto' if @alu_valor.nil? || @alu_valor.to_f <= 0 || @alu_valor.to_f > 9999.99
    return 'Pagamento incorreto' unless %w[S N].include?(@alu_pago.to_s)
    return 'Contrato incorreto' if @ctr_id.nil? || @ctr_id.to_i <= 0

    nil
  end

  private

  # aceita Date (vindo do banco) ou String 'AAAA-MM-DD' (vindo do formulário)
  def data_valida?(valor)
    return true if valor.is_a?(Date)

    Date.iso8601(valor.to_s)
    true
  rescue Date::Error
    false
  end

end
