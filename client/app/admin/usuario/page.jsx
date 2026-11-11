'use client'
import { useEffect, useState } from "react"
import { ApiClient } from "@/utils/apiCliente"
import Link from "next/link"
import toast from "react-hot-toast"

export default function UsuarioPage() {
  const [usuario, setUsuario] = useState([])

  async function carregarUsuarioa() {
    const resposta = await ApiClient.get('/usuario')
    if (resposta)
      setUsuario(resposta)

    console.log(resposta)
  }
  async function deletar(id) {
    let resposta = await ApiClient.delete('/usuario/' + id)
    if (resposta) {
      toast.success("Usuário excluido com sucesso")
      carregarUsuarioa()
    }
  }
  useEffect(() => {
    carregarUsuarioa()
  }, [])

  return (
    <div>
      <div>
        <h1 className="h3 fw-bold">Usuários</h1>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <td>Id</td>
              <td>Nome</td>
              <td>Email</td>
              <td>Perfil</td>
              <td>Ações</td>
            </tr>
          </thead>
          <tbody>
            {
              usuario.length ?
                usuario.map((value) =>
                (
                  <tr key={value.usu_id}>
                    <td> {value.usu_id} </td>
                    <td> {value.usu_nome} </td>
                    <td> {value.usu_email} </td>
                    <td> {value.per_id} </td>
                    <td>
                      <Link className="btn btn-primary" href={`/admin/usuario/alterar/${value.usu_id}`} >
                        <i className="fas fa-pen"></i>
                      </Link>
                      <button onClick={() => deletar(value.usu_id)} className="btn btn-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                )
                )
                :
                (<tr><td colSpan={5}>Nenhum usuário cadastrado</td></tr>)
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
