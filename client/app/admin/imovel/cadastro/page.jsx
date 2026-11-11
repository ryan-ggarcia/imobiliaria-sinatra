import Link from "next/link"
import FormImovel from "@/app/components/formImovel"
import Cabecalho from "@/app/components/cabecalho"

export default function CadastroImovel() {
  return (
    <div>
      <Cabecalho sobre="Imóveis" titulo="Novo imóvel" subtitulo="Preencha os dados para adicionar à carteira.">
        <Link className="btn btn-claro" href="/admin/imovel">
          <i className="fas fa-arrow-left"></i> Voltar
        </Link>
      </Cabecalho>
      <FormImovel />
    </div>
  )
}
