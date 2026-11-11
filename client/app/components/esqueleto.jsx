// linhas "fantasma" enquanto a lista carrega
export function EsqueletoTabela({ colunas, linhas = 5 }) {
  return Array.from({ length: linhas }, (_, l) => (
    <tr key={l} aria-hidden="true">
      {Array.from({ length: colunas }, (_, c) => (
        <td key={c}>
          <span className="esqueleto" style={{ width: `${c === 0 ? 30 : 50 + ((l * 7 + c * 13) % 40)}%` }} />
        </td>
      ))}
    </tr>
  ))
}

// bloco de formulário enquanto o registro carrega
export function EsqueletoForm({ campos = 6 }) {
  return (
    <div className="cartao cartao-corpo form-limite" aria-busy="true">
      <div className="form-grade">
        {Array.from({ length: campos }, (_, i) => (
          <div key={i}>
            <span className="esqueleto mb-2" style={{ width: "30%" }} />
            <span className="esqueleto" style={{ height: "2.9rem", borderRadius: "10px" }} />
          </div>
        ))}
      </div>
    </div>
  )
}
