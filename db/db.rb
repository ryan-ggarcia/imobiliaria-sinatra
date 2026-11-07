require "mysql2"
require "monitor"
require "singleton"

# Conexão com o banco em Singleton: existe UMA instância de Database no
# processo inteiro, acessada por Database.instance (Database.new é privado).
#
# Como o Mysql2::Client não pode ser usado por duas threads ao mesmo tempo
# (e o Puma atende requisições em paralelo), todo acesso passa por um
# Monitor, que é um lock reentrante: a mesma thread pode entrar de novo
# (necessário dentro de uma transação), outras threads esperam.
class Database
  include Singleton

  def initialize
    @lock = Monitor.new
    @client = Mysql2::Client.new(
      host:      ENV.fetch("DB_HOST"),
      username:  ENV.fetch("DB_USER"),
      password:  ENV.fetch("DB_SENHA"),
      database:  ENV.fetch("DB_NOME"),
      port:      ENV.fetch("DB_PORTA", 3306).to_i,
      reconnect: true # reconecta se o servidor derrubar a conexão ociosa
    )
  end

  # INSERT, UPDATE, DELETE -> true/false
  def executa_comando(sql, *values)
    @lock.synchronize do
      comando = @client.prepare(sql) # prepara o SQL com os ?
      comando.execute(*values)       # preenche os ? e executa
      comando.affected_rows > 0
    end
  end

  # SELECT -> array de hashes
  def executa_select(sql, *values)
    @lock.synchronize do
      @client.prepare(sql).execute(*values).to_a
    end
  end

  # INSERT -> id gerado
  def executa_id(sql, *values)
    @lock.synchronize do
      comando = @client.prepare(sql)
      comando.execute(*values)
      comando.last_id
    end
  end

  # Executa o bloco em uma transação: COMMIT se o bloco terminar normalmente,
  # ROLLBACK se ele lançar erro. Devolve o valor do bloco.
  # Enquanto a transação roda, nenhuma outra thread usa a conexão.
  def transacao
    @lock.synchronize do
      @client.query("START TRANSACTION")
      sucesso = false
      begin
        resultado = yield
        @client.query("COMMIT")
        sucesso = true
        resultado
      ensure
        @client.query("ROLLBACK") unless sucesso
      end
    end
  end
end
