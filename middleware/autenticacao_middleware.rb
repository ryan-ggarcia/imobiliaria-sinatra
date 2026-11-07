require 'jwt'
require 'json'

# Middleware Rack de autenticação via JWT guardado em cookie.
#
# Uso no server.rb:   use AutenticacaoMiddleware
# Nas rotas, o usuário logado fica em:   env['usuario']   (UsuarioModel)
class AutenticacaoMiddleware

  COOKIE = 'token-pfs2'
  ALGORITMO = 'HS256'
  VALIDADE = 8 * 60 * 60 # token vale 8 horas

  # defina JWT_SEGREDO no arquivo .env; o valor padrão serve só para desenvolvimento
  SEGREDO = ENV.fetch('JWT_SEGREDO', 'RUBYONRAILS')

  # rotas que não exigem login: [método, caminho]
  ROTAS_PUBLICAS = [
    ['POST', '/login'],
    ['POST', '/usuario'],          # cadastro de usuário
    ['GET',  '/docs'],             # Swagger UI
    ['GET',  '/docs/openapi.yaml'] # especificação OpenAPI
  ].freeze

  def self.gerar_jwt(usu_id, usu_nome, usu_email, per_id)
    payload = {
      id: usu_id,
      nome: usu_nome,
      email: usu_email,
      perfil_id: per_id,
      exp: Time.now.to_i + VALIDADE
    }
    JWT.encode(payload, SEGREDO, ALGORITMO)
  end

  def initialize(app, db = Database.instance)
    @app = app
    @db = db
    @dao = UsuarioDao.new
  end

  def call(env)
    request = Rack::Request.new(env)
    return @app.call(env) if ROTAS_PUBLICAS.include?([request.request_method, request.path_info])

    # o token precisa existir nos cookies da requisição
    token = request.cookies[COOKIE]
    return resposta(401, 'Token inexistente!') if token.to_s.empty?

    # verifica a assinatura e a validade do token com o nosso segredo
    payload, = JWT.decode(token, SEGREDO, true, algorithm: ALGORITMO)

    # usa o id do payload para encontrar o usuário no banco
    usuario = @dao.find_by_id(payload['id'], @db)
    return resposta(404, 'Usuário não encontrado!') unless usuario && ativo?(usuario)

    env['usuario'] = usuario
    @app.call(env)
  rescue JWT::ExpiredSignature
    resposta(401, 'Token expirado!')
  rescue JWT::DecodeError
    resposta(401, 'Token inválido!')
  end

  private

  # o mysql2 devolve bool como 1/0
  def ativo?(usuario)
    [true, 1].include?(usuario.usu_ativo)
  end

  def resposta(status, msg)
    [status, { 'content-type' => 'application/json' }, [{ msg: msg }.to_json]]
  end

end
