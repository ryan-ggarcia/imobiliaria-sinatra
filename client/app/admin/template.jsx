// template (diferente do layout) é recriado a cada navegação,
// então a animação de entrada roda em toda troca de página
export default function AdminTemplate({ children }) {
  return <div className="anima-pagina">{children}</div>
}
