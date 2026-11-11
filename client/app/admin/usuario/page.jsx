'use client'
import { useState } from "react"

export default function UsuarioPage() {
  const [usuario,setUsuario] = useState([])

  async function carregarUsuarioa(){
    
  }
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
            <tr>
              <td>

              </td>
              <td>

              </td>
              <td>

              </td>
              <td>

              </td>
              <td>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
