import { Suspense } from "react"
import Menu from "../components/menu"
import styles from "@/public/css/admin.module.css"

export default function AdminLayout({ children }) {
  return (
    <div className={styles.shell}>
      <Suspense>
        <Menu />
      </Suspense>
      <main className={styles.conteudo}>{children}</main>
    </div>
  )
}
