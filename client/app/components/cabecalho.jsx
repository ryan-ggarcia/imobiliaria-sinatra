export default function Cabecalho({ sobre, titulo, subtitulo, children }) {
  return (
    <header className="cabecalho">
      <div>
        {sobre && <p className="cabecalho-sobre">{sobre}</p>}
        <h1>{titulo}</h1>
        {subtitulo && <p className="cabecalho-sub">{subtitulo}</p>}
      </div>
      {children && <div className="d-flex gap-2">{children}</div>}
    </header>
  )
}
