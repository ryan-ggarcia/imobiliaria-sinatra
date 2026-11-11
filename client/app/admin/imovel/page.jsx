import { ApiClient } from "@/utils/apiCliente"

export default function ImovelPage() {
  async function carregarImovel() {
    const resposta = await ApiClient.get('/imovel')
    if(resposta){
      
    }
  }
  return(
    <div>
      <h1 className="h3 fw-bold">Imóveis</h1>

    </div>
  )
}
