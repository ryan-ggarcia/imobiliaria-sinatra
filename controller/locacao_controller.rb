require 'date'
require_relative 'base_controller'

class LocacaoController < BaseController

  # regra de negócio: todo contrato tem duração de 1 ano
  MESES_CONTRATO = 12

  def initialize(db = Database.instance)
    super
    @imovel_dao = ImovelDao.new
    @contrato_dao = ContratoDao.new
    @aluguel_dao = AluguelDao.new
  end

  # usuario: UsuarioModel do usuário logado (vem do middleware de autenticação)
  def locar(imv_id, usuario)
    # tudo dentro da transação: se qualquer passo falhar, nada é gravado.
    # A verificação de disponibilidade também fica dentro, para que duas
    # requisições ao mesmo tempo não aluguem o mesmo imóvel.
    @db.transacao do
      imovel = @imovel_dao.find_by_id(imv_id, @db)
      next [400, { msg: 'Este imóvel não está disponível para locação!' }] if imovel.nil? || imovel.imv_disponivel == 'N'

      # gera o contrato
      contrato = ContratoModel.new(nil, imovel.imv_id, usuario.usu_id)
      ctr_id = @contrato_dao.create(contrato, @db)
      raise 'Erro ao inserir contrato no banco de dados!' unless ctr_id

      # gera os 12 aluguéis, começando no mês seguinte ao atual
      hoje = Date.today
      (1..MESES_CONTRATO).each do |i|
        vencimento = hoje >> i # soma i meses (31/01 + 1 mês = 28/02)
        aluguel = AluguelModel.new(nil, vencimento.month, vencimento, imovel.imv_valor, ctr_id, 'N')
        raise 'Erro ao inserir aluguel no banco de dados!' unless @aluguel_dao.create(aluguel, @db)
      end

      # marca o imóvel como indisponível
      imovel.imv_disponivel = 'N'
      raise 'Erro ao atualizar imóvel no banco de dados!' unless @imovel_dao.update(imovel, @db)

      [200, { msg: 'Imóvel alugado com sucesso!', ctr_id: ctr_id }]
    end
  rescue => ex
    erro_interno(ex)
  end

end
