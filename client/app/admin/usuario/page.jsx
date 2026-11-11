'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { ApiClient } from "@/utils/apiCliente"
import { iniciais, PERFIS } from "@/utils/formatar"
import Cabecalho from "@/app/components/cabecalho"
import BotaoExcluir from "@/app/components/botaoExcluir"
import { EsqueletoTabela } from "@/app/components/esqueleto"

export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState(null) // null = carregando

  async function carregarUsuarios() {
    const resposta = await ApiClient.get('/usuario')
    // 204 (lista vazia) volta null
    setUsuarios(resposta || [])
  }

  async function deletar(id) {
    let resposta = await ApiClient.delete('/usuario/' + id)
    if (resposta) {
      toast.success("Usuário excluído com sucesso")
      carregarUsuarios()
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  return (
    <div>
      <Cabecalho
        sobre="Acesso"
        titulo="Usuários"
        subtitulo={usuarios ? `${usuarios.length} usuário(s) ativo(s)` : 'Carregando usuários...'}
      />

      <div className="cartao">
        {usuarios && usuarios.length === 0 ? (
          <div className="vazio">
            <div className="vazio-icone"><i className="fas fa-user"></i></div>
            <h2>Nenhum usuário ativo</h2>
            <p>Novos usuários aparecem aqui assim que se cadastram.</p>
          </div>
        ) : (
          <div className="tabela-moldura">
            <table className="tabela">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Usuário</th>
                  <th>Perfil</th>
                  <th className="col-acoes"><span className="visually-hidden">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {usuarios == null ? (
                  <EsqueletoTabela colunas={4} />
                ) : (
                  usuarios.map((value, i) => (
                    <tr key={value.usu_id} className="anima-item" style={{ '--i': i }}>
                      <td className="fraco num">{value.usu_id}</td>
                      <td>
                        <div className="pessoa">
                          <span className="avatar" aria-hidden="true">{iniciais(value.usu_nome)}</span>
                          <div>
                            <span className="titulo-linha">{value.usu_nome}</span>
                            <span className="sub-linha">{value.usu_email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`selo-status ${value.per_id === 1 ? 'info' : 'neutro'}`}>
                          {PERFIS[value.per_id] ?? `Perfil ${value.per_id}`}
                        </span>
                      </td>
                      <td className="col-acoes">
                        <div className="acoes">
                          <Link className="btn-icone" href={`/admin/usuario/alterar/${value.usu_id}`} aria-label="Editar" title="Editar">
                            <i className="fas fa-pen"></i>
                          </Link>
                          <BotaoExcluir onConfirmar={() => deletar(value.usu_id)} />
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
