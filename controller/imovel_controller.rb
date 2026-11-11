require_relative 'base_controller'

class ImovelController < BaseController

  # código de erro do MySQL quando a FK impede a exclusão
  FK_EM_USO = 1451

  def initialize(db = Database.instance)
    super
    @dao = ImovelDao.new
  end

  def listar
    lista = @dao.read(@db)
    return [204, { msg: 'Nenhum imóvel encontrado!' }] if lista.empty?

    [200, lista.map { |imovel| to_hash(imovel) }]
  rescue => ex
    erro_interno(ex)
  end

  def find_by(imv_id)
    imovel = @dao.find_by_id(imv_id, @db)
    return [404, { msg: 'Imóvel não encontrado!' }] unless imovel

    [200, to_hash(imovel)]
  rescue => ex
    erro_interno(ex)
  end

  def cadastrar(params)
    imovel = ImovelModel.new(
      nil,
      params['imv_descricao'],
      params['imv_cep'],
      params['imv_endereco'],
      params['imv_bairro'],
      params['imv_cidade'],
      params['imv_valor'],
      params['imv_disponivel'] || 'S'
    )

    erro = imovel.validation
    return [400, { msg: erro }] if erro

    id = @dao.create(imovel, @db)
    raise 'Erro ao inserir imóvel no banco de dados' unless id

    imovel.imv_id = id
    [201, to_hash(imovel)]
  rescue => ex
    erro_interno(ex)
  end

  def atualizar(imv_id, params)
    return [404, { msg: 'Imóvel não encontrado para atualização!' }] unless @dao.find_by_id(imv_id, @db)

    imovel = ImovelModel.new(
      imv_id,
      params['imv_descricao'],
      params['imv_cep'],
      params['imv_endereco'],
      params['imv_bairro'],
      params['imv_cidade'],
      params['imv_valor'],
      params['imv_disponivel']
    )

    erro = imovel.validation
    return [400, { msg: erro }] if erro

    # update sem mudança nenhuma retorna 0 linhas afetadas, por isso não é tratado como erro
    @dao.update(imovel, @db)
    [200, { msg: 'Imóvel atualizado com sucesso!' }]
  rescue => ex
    erro_interno(ex)
  end

  def deletar(imv_id)
    return [404, { msg: 'Imóvel não encontrado para exclusão!' }] unless @dao.find_by_id(imv_id, @db)

    raise 'Erro durante exclusão do imóvel no banco de dados!' unless @dao.delete(imv_id, @db)

    [200, { msg: 'Imóvel excluído com sucesso!' }]
  rescue Mysql2::Error => ex
    return [409, { msg: 'Imóvel possui contrato e não pode ser excluído!' }] if ex.error_number == FK_EM_USO

    erro_interno(ex)
  rescue => ex
    erro_interno(ex)
  end

end
