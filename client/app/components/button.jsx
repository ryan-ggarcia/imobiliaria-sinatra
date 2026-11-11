'use client'
import { useState } from 'react'

// se "funcao" for async, o botão mostra um spinner e fica desabilitado até terminar
export default function Button({ funcao, type = 'button', texto, icone, className = 'btn btn-primary' }) {
    const [carregando, setCarregando] = useState(false)

    async function clicar(e) {
        if (typeof funcao !== 'function') return
        setCarregando(true)
        try {
            await funcao(e)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <button type={type} className={className} onClick={clicar} disabled={carregando}>
            {carregando ? <span className="carregando-spinner" /> : icone && <i className={icone}></i>}
            {texto}
        </button>
    )
}
