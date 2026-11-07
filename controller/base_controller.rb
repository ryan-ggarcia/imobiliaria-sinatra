# Base das controllers: cada método de controller devolve [status, corpo],
# e a rota só precisa repassar isso para o Sinatra.
class BaseController

  def initialize(db = Database.instance)
    @db = db
  end

  private

  # converte uma model em Hash (para virar JSON), removendo campos sensíveis
  def to_hash(model, ocultar: [])
    model.instance_variables.each_with_object({}) do |var, hash|
      chave = var.to_s.delete('@').to_sym
      hash[chave] = model.instance_variable_get(var) unless ocultar.include?(chave)
    end
  end

  def erro_interno(ex)
    warn ex.full_message
    [500, { msg: 'Erro interno no servidor!' }]
  end

end
