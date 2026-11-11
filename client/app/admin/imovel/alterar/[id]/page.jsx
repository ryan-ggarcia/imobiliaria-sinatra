'use client'
import { use, useEffect, useState } from "react"
import Link from "next/link"
import FormImovel from "@/app/components/formImovel"
import Cabecalho from "@/app/components/cabecalho"
import { EsqueletoForm } from "@/app/components/esqueleto"
import { ApiClient } from "@/utils/apiCliente"

export default function AlterarImovel({ params }) {
    const { id } = use(params)
    const [imovel, setImovel] = useState(null)

    async function carregarImovel() {
        let resposta = await ApiClient.get(`/imovel/${id}`)
        if (resposta) {
            setImovel(resposta)
        }
    }

    useEffect(() => {
        carregarImovel()
    }, [])

    return (
        <div>
            <Cabecalho sobre={`Imóvel #${id}`} titulo="Editar imóvel" subtitulo={imovel?.imv_descricao ?? 'Carregando...'}>
                <Link className="btn btn-claro" href="/admin/imovel">
                    <i className="fas fa-arrow-left"></i> Voltar
                </Link>
            </Cabecalho>
            {/* só renderiza o form depois de carregar, senão os defaultValue ficam vazios */}
            {imovel == null ? <EsqueletoForm /> : <FormImovel imovel={imovel} />}
        </div>
    )
}
