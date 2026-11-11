'use client'
import { useEffect, useState } from 'react'

// conta de 0 até "valor" com desaceleração no final
export default function ContadorAnimado({ valor = 0, duracao = 900, sufixo = '' }) {
  const [atual, setAtual] = useState(0)

  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzir) {
      setAtual(valor)
      return
    }
    let frame
    const inicio = performance.now()
    function passo(agora) {
      const t = Math.min((agora - inicio) / duracao, 1)
      const suave = 1 - Math.pow(1 - t, 3)
      setAtual(Math.round(valor * suave))
      if (t < 1) frame = requestAnimationFrame(passo)
    }
    frame = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(frame)
  }, [valor, duracao])

  return <>{atual}{sufixo}</>
}
