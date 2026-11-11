import Menu from "../components/menu"
import styles from "@/public/css/admin.module.css"

export default function AdminLayout({ children }) {
  return (
    <div className={styles.shell}>
      <Menu />
      <main className={styles.conteudo}>{children}</main>
    </div>
  )
}
