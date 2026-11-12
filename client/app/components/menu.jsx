'use client'
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ApiClient } from "@/utils/apiCliente"
import styles from "@/public/css/menu.module.css"

const itens = [
  {
    href: "/admin",
    texto: "Painel",
    exato: true,
    icone: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </>
    ),
  },
  {
    href: "/admin/usuario",
    texto: "Usuários",
    icone: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </>
    ),
  },
  {
    href: "/admin/imovel",
    texto: "Imóveis",
    icone: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M10 21v-6h4v6" />
      </>
    ),
  },
  {
    href: "/admin/contrato",
    texto: "Contratos",
    icone: (
      <>
        <path d="M6 3h8l5 5v13H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h7M9 17h7" />
      </>
    ),
  },
]

function Icone({ children }) {
  return (
    <svg className={styles.icone} viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

export default function Menu() {
  const pathname = usePathname()
  const router = useRouter()

  async function sair() {
    await ApiClient.post('/logout', {})
    toast.success('Até logo!')
    router.push('/login')
  }

  return (
    <nav className={`navbar navbar-expand-lg ${styles.sidebar}`} data-bs-theme="dark">
      <div className={`container-fluid ${styles.interno}`}>
        <Link href="/admin" className={`navbar-brand ${styles.marca}`}>
          <span className={styles.selo}>
            <Icone>
              <path d="M3 11l9-8 9 8" />
              <path d="M5 9.5V21h14V9.5" />
            </Icone>
          </span>
          Imobiliária
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${styles.colapso}`} id="menuPrincipal">
          <p className={styles.grupo}>Gestão</p>
          <ul className={`navbar-nav ${styles.lista}`}>
            {itens.map((item, i) => {
              const ativo = item.exato
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <li className={`nav-item ${styles.item}`} key={item.href} style={{ '--i': i }}>
                  <Link
                    href={item.href}
                    className={`nav-link ${styles.link} ${ativo ? styles.ativo : ""}`}
                    aria-current={ativo ? "page" : undefined}
                  >
                    <Icone>{item.icone}</Icone>
                    {item.texto}
                  </Link>
                </li>
              )
            })}
          </ul>

          <button type="button" className={`${styles.link} ${styles.sair}`} onClick={sair}>
            <Icone>
              <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
              <path d="M10 17l-5-5 5-5M5 12h11" />
            </Icone>
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}
