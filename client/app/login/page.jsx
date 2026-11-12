'use client'
import { useRef } from "react"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "../components/button";
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
      erro.push("Senha inválida ou com menos de 6 dígitos")
    if(email.trim() == "" && senha.trim() == "")
      erro.push("Preencha todos os campos")

    if(erro.length > 0){
      toast.error(erro.join(", "))
      return 
    }

    let r = await fetch("http://localhost:5000/login",{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
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
      router.replace("/admin")
    }
      
  }

  return (
    <div className={styles.pagina}>
      <aside className={styles.painel}>
        <span className={`${styles.orbe} ${styles.orbe1}`} aria-hidden="true" />
        <span className={`${styles.orbe} ${styles.orbe2}`} aria-hidden="true" />

        <div className={styles.marca}>
          <span className={styles.selo} aria-hidden="true"><i className="fas fa-house"></i></span>
          Imobiliária
        </div>

        <div className={styles.chamada}>
          <h2 className={styles.slogan}>Sua carteira de imóveis, <span>organizada</span>.</h2>
          <p className={styles.descricao}>Gestão de usuários, imóveis e contratos em um só lugar.</p>
          <ul className={styles.recursos}>
            <li style={{ '--i': 0 }}><i className="fas fa-house"></i> Cadastro completo de imóveis</li>
            <li style={{ '--i': 1 }}><i className="fas fa-file-signature"></i> Contratos e aluguéis mensais</li>
            <li style={{ '--i': 2 }}><i className="fas fa-shield-halved"></i> Acesso seguro por perfil</li>
          </ul>
        </div>
      </aside>

      <main className={styles.area}>
        {/* Enter no campo dispara o clique do botão submit (que chama "cadastrar") */}
        <form className={styles.cartao} onSubmit={(e) => e.preventDefault()}>
          <h1 className={styles.titulo}>Bem-vindo de volta</h1>
          <p className={styles.subtitulo}>Acesse sua conta para continuar</p>

          <div className={styles.campo}>
            <label htmlFor="email" className="form-label">E-mail</label>
            <div className={styles.comIcone}>
              <i className="fas fa-envelope" aria-hidden="true"></i>
              <input id="email" type="email" className="form-control" ref={emailRef} placeholder="exemplo@gmail.com" autoComplete="email" />
            </div>
          </div>

          <div className={styles.campo}>
            <label htmlFor="senha" className="form-label">Senha</label>
            <div className={styles.comIcone}>
              <i className="fas fa-lock" aria-hidden="true"></i>
              <input id="senha" type="password" className="form-control" ref={senhaRef} placeholder="Sua senha" autoComplete="current-password" />
            </div>
          </div>

          <div className={styles.acao}>
            <Button texto="Entrar" type="submit" icone="fas fa-arrow-right-to-bracket" funcao={cadastrar} className="btn" />
          </div>
        </form>
      </main>
    </div>
  )
}
