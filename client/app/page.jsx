'use client'
import { useRef } from "react"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "./components/button"
import styles from "@/public/css/login.module.css"
export default function LoginPage() {

  const router = useRouter()
  let emailRef = useRef('')
  let senhaRef = useRef('')

   async function cadastrar(){
    let email = emailRef.current.value
    let senha = senhaRef.current.value

    let erro = []
    if(email.trim() == "" || !email.includes('@'))
      erro.push("Email inválido")
    if(senha.trim() == "" || senha.length < 6)
      erro.push("Senha inválida ou menos que 8 digitos")
    if(email.trim() == "" && senha.trim() == "")
      erro.push("Preencha todos os campos")

    if(erro.length > 0){
      toast.error(erro.join(", "))
      return 
    }

    let r = await fetch("http://localhost:5000/login",{
      method: 'POST',
      headers: {'Content-Type':'application/josn'},
      credentials: "include",
      body: JSON.stringify({
        email: email,
        senha: senha,
      })
    })
    if(!r.ok){
      let {msg} = await r.json()
      toast.error(msg)
      return 
    }
    else{
      toast.success("Login efetuado com sucesso!")
      router.push("/admin")
    }
      
  }

  return (
    <div className={styles.pagina}>
      <aside className={styles.painel}>
        <div className={styles.marca}>Imobiliária</div>
        <p className={styles.descricao}>Gestão de usuários, imóveis e contratos em um só lugar.</p>
      </aside>

      <main className={styles.area}>
        <div className={styles.cartao}>
          <h1 className={styles.titulo}>Entrar</h1>
          <p className={styles.subtitulo}>Acesse sua conta para continuar</p>

          <div className={styles.campo}>
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" type="email" className="form-control" ref={emailRef} placeholder="exemplo@gmail.com" />
          </div>

          <div className={styles.campo}>
            <label htmlFor="senha" className="form-label">Senha</label>
            <input id="senha" type="password" className="form-control" ref={senhaRef} placeholder="Sua senha" />
          </div>

          <div className={styles.acao}>
            <Button texto="Entrar" type="button" funcao={cadastrar} className="btn" />
          </div>
        </div>
      </main>
    </div>
  )
}