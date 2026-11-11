'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { ApiClient } from "@/utils/apiCliente"
import { formatarCep, formatarMoeda } from "@/utils/formatar"
import Cabecalho from "@/app/components/cabecalho"
import BotaoExcluir from "@/app/components/botaoExcluir"
import { EsqueletoTabela } from "@/app/components/esqueleto"

export default function ImovelPage() {
  const [imoveis, setImoveis] = useState(null) // null = carregando

  async function carregarImoveis() {
    const resposta = await ApiClient.get('/imovel')
    // 204 (lista vazia) volta null
    setImoveis(resposta || [])
  }

  async function deletar(id) {
    let resposta = await ApiClient.delete('/imovel/' + id)
    if (resposta) {
      toast.success("Imóvel excluído com sucesso")
      carregarImoveis()
    }
  }

  useEffect(() => {
    carregarImoveis()
  }, [])

  const disponiveis = imoveis?.filter((i) => i.imv_disponivel === 'S').length ?? 0

  return (
    <div>
      <Cabecalho
        sobre="Carteira"
        titulo="Imóveis"
        subtitulo={imoveis ? `${imoveis.length} cadastrado(s) · ${disponiveis} disponível(is)` : 'Carregando carteira...'}
      >
        <Link className="btn btn-primary" href="/admin/imovel/cadastro">
          <i className="fas fa-plus"></i> Novo imóvel
        </Link>
      </Cabecalho>

      <div className="cartao">
        {imoveis && imoveis.length === 0 ? (
          <div className="vazio">
            <div className="vazio-icone"><i className="fas fa-house"></i></div>
            <h2>Nenhum imóvel ainda</h2>
            <p>Cadastre o primeiro imóvel da carteira para começar a gerar contratos.</p>
            <Link className="btn btn-primary" href="/admin/imovel/cadastro">
              <i className="fas fa-plus"></i> Cadastrar imóvel
            </Link>
          </div>
        ) : (
          <div className="tabela-moldura">
            <table className="tabela">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Imóvel</th>
                  <th>Localização</th>
                  <th>CEP</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th className="col-acoes"><span className="visually-hidden">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {imoveis == null ? (
                  <EsqueletoTabela colunas={7} />
                ) : (
                  imoveis.map((value, i) => (
                    <tr key={value.imv_id} className="anima-item" style={{ '--i': i }}>
                      <td className="fraco num">{value.imv_id}</td>
                      <td>
                        <span className="titulo-linha">{value.imv_descricao}</span>
                        <span className="sub-linha">{value.imv_endereco}</span>
                      </td>
                      <td>
                        {value.imv_bairro}
                        <span className="sub-linha">{value.imv_cidade}</span>
                      </td>
                      <td className="num">{formatarCep(value.imv_cep)}</td>
                      <td className="num titulo-linha">{formatarMoeda(value.imv_valor)}</td>
                      <td>
                        {value.imv_disponivel === 'S'
                          ? <span className="selo-status sucesso">Disponível</span>
                          : <span className="selo-status alerta">Alugado</span>}
                      </td>
                      <td className="col-acoes">
                        <div className="acoes">
                          <Link className="btn-icone" href={`/admin/imovel/alterar/${value.imv_id}`} aria-label="Editar" title="Editar">
                            <i className="fas fa-pen"></i>
                          </Link>
                          <BotaoExcluir onConfirmar={() => deletar(value.imv_id)} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
