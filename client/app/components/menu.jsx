'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "@/public/css/menu.module.css"

const itens = [
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
          <ul className={`navbar-nav ${styles.lista}`}>
            {itens.map((item) => {
              const ativo = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <li className="nav-item" key={item.href}>
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
        </div>
      </div>
    </nav>
  )
}
