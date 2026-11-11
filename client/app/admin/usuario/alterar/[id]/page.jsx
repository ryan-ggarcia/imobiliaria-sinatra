'use client'
import { use, useEffect, useState } from "react"
import Link from "next/link"
import FormUsuario from "@/app/components/formUsuario"
import Cabecalho from "@/app/components/cabecalho"
import { EsqueletoForm } from "@/app/components/esqueleto"
import { ApiClient } from "@/utils/apiCliente"

export default function AlterarUsuario({ params }) {
    const { id } = use(params)
    const [usuario, setUsuario] = useState(null)

    async function carregarUsuario() {
        let resposta = await ApiClient.get(`/usuario/${id}`)
        if (resposta) {
            setUsuario(resposta)
        }
    }

    useEffect(() => {
        carregarUsuario()
    }, [])

    return (
        <div>
            <Cabecalho sobre={`Usuário #${id}`} titulo="Editar usuário" subtitulo="Atualize os dados de acesso.">
                <Link className="btn btn-claro" href="/admin/usuario">
                    <i className="fas fa-arrow-left"></i> Voltar
                </Link>
            </Cabecalho>
            {/* só renderiza o form depois de carregar, senão os defaultValue ficam vazios */}
            {usuario == null ? <EsqueletoForm campos={4} /> : <FormUsuario usuario={usuario} />}
        </div>
    )
}
