'use client'
import { useRef, useState } from "react"
import Button from "./components/button"
export default function LoginPage() {

  let email = useRef('')
  let senha = useRef('')

  function cadastrar(){
    let email = email.current.value
    let senha = senha.current.value

    let erro = []
    if(email.trim() == "" || email.includes('@'))
      erro.push("Email inválido")
    if(senha.trim() == "" || senha.length > 8)
      erro.push("Senha inválida ou menos que 8 digitos")
    if(email.trim() == "" && senha.trim() == "")
      erro.push("Preencha todos os campos")
  }

  return (
    <>
      <div>
        <div>
          <div>

            <div>
              <label htmlFor="text" className="form-label">Email</label>
            </div>

            <div>
              <input type="text" className="form-control" ref={email} placeholder="exemplo@gmail.com" />
            </div>

          </div>

          <div>

            <div>
              <label htmlFor="text" className="form-label">Senha</label>
            </div>

            <div>
              <input type="text" className="form-control" ref={senha} placeholder="exemPlo123#" />
            </div>

          </div>
          <div>
            <Button texto="Entrar" type="button" funcao={cadastrar} />
          </div>
        </div>
      </div>
    </>
  )
}