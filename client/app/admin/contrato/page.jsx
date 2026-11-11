import Link from "next/link"
import Cabecalho from "@/app/components/cabecalho"

export default function ContratoPage() {
  return (
    <div>
      <Cabecalho sobre="Locações" titulo="Contratos" subtitulo="Acompanhe os contratos de locação ativos." />

      <div className="cartao anima-escala">
        <div className="vazio">
          <div className="vazio-icone"><i className="fas fa-file-signature"></i></div>
          <h2>Em breve</h2>
          <p>A listagem de contratos ainda está sendo construída. Enquanto isso, gerencie a carteira de imóveis.</p>
          <Link className="btn btn-primary" href="/admin/imovel">
            <i className="fas fa-house"></i> Ver imóveis
          </Link>
        </div>
      </div>
    </div>
  )
}
