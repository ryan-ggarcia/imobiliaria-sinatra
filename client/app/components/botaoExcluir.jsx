'use client'
import { useEffect, useState } from 'react'

// 1º clique arma a exclusão (vira "Confirmar"), 2º clique executa; volta sozinho após 3s
export default function BotaoExcluir({ onConfirmar, rotulo = 'Excluir' }) {
  const [armado, setArmado] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    if (!armado) return
    const t = setTimeout(() => setArmado(false), 3000)
    return () => clearTimeout(t)
  }, [armado])

  async function clicar() {
    if (!armado) {
      setArmado(true)
      return
    }
    setExcluindo(true)
    await onConfirmar()
    setExcluindo(false)
    setArmado(false)
  }

  return (
    <button
      type="button"
      onClick={clicar}
      disabled={excluindo}
      className={`btn-icone perigo ${armado ? 'confirmar' : ''}`}
      aria-label={armado ? 'Confirmar exclusão' : rotulo}
      title={armado ? 'Clique novamente para confirmar' : rotulo}
    >
      {excluindo
        ? <span className="carregando-spinner" />
        : <i className="fas fa-trash-can"></i>}
      {armado && !excluindo && 'Confirmar'}
    </button>
  )
}
