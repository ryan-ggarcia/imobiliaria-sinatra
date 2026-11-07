# Documentação interativa da API (Swagger UI) em /docs
module SwaggerRouter
  PASTA = File.expand_path('../swagger', __dir__)

  def self.registered(app)

    app.get '/docs' do
      send_file File.join(PASTA, 'index.html'), type: :html
    end

    app.get '/docs/openapi.yaml' do
      send_file File.join(PASTA, 'openapi.yaml'), type: 'application/yaml'
    end

  end
end
