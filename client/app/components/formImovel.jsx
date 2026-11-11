'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ApiClient } from '@/utils/apiCliente'
import { formatarCep } from '@/utils/formatar'
import Button from './button'

// máscara 00000-000 enquanto digita
function mascararCep(e) {
    const d = e.target.value.replace(/\D/g, '').slice(0, 8)
    e.target.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

// sem "imovel" = cadastro (POST); com "imovel" = alteração (PUT)
export default function FormImovel({ imovel }) {
    const router = useRouter()

    let descricao = useRef('')
    let endereco = useRef('')
    let bairro = useRef('')
    let cep = useRef('')
    let cidade = useRef('')
    let valor = useRef('')
    let disponivel = useRef('')

    function montarObjeto() {
        return {
            imv_descricao: descricao.current.value.trim(),
            imv_endereco: endereco.current.value.trim(),
            imv_bairro: bairro.current.value.trim(),
            imv_cep: cep.current.value.replace(/\D/g, ''),
            imv_cidade: cidade.current.value.trim(),
            imv_valor: valor.current.value,
            imv_disponivel: disponivel.current.checked ? 'S' : 'N'
        }
    }

    async function gravar() {
        let obj = montarObjeto()
        if (!obj.imv_descricao || !obj.imv_endereco || !obj.imv_bairro || !obj.imv_cep || !obj.imv_cidade || !obj.imv_valor) {
            toast.error('Preencha todos os campos obrigatórios!')
            return
        }

        let r = imovel
            ? await ApiClient.put('/imovel/' + imovel.imv_id, obj)
            : await ApiClient.post('/imovel', obj)

        if (r) {
            toast.success(imovel ? 'Imóvel alterado com sucesso' : 'Imóvel cadastrado com sucesso')
            router.push('/admin/imovel')
        }
    }

    return (
        <form className="cartao cartao-corpo form-limite anima-escala" onSubmit={(e) => e.preventDefault()}>
            <h2 className="form-secao">Dados do imóvel</h2>
            <div className="form-grade">
                <div className="inteiro">
                    <label className="form-label" htmlFor="descricao">Descrição</label>
                    <input type="text" id="descricao" className="form-control" ref={descricao}
                        defaultValue={imovel?.imv_descricao} placeholder="Ex.: Apartamento 2 quartos com varanda" />
                </div>

                <div>
                    <label className="form-label" htmlFor="valor">Valor do aluguel</label>
                    <div className="input-group">
                        <span className="input-group-text">R$</span>
                        <input type="number" step="0.01" min="0" max="9999.99" id="valor" className="form-control" ref={valor}
                            defaultValue={imovel?.imv_valor} placeholder="0,00" />
                    </div>
                    <p className="dica-campo">Máximo de R$ 9.999,99</p>
                </div>
            </div>

            <h2 className="form-secao mt-4">Endereço</h2>
            <div className="form-grade">
                <div>
                    <label className="form-label" htmlFor="cep">CEP</label>
                    <input type="text" inputMode="numeric" id="cep" className="form-control" ref={cep} onInput={mascararCep}
                        defaultValue={formatarCep(imovel?.imv_cep)} placeholder="00000-000" />
                </div>

                <div>
                    <label className="form-label" htmlFor="cidade">Cidade</label>
                    <input type="text" id="cidade" className="form-control" ref={cidade} defaultValue={imovel?.imv_cidade} />
                </div>

                <div>
                    <label className="form-label" htmlFor="endereco">Endereço</label>
                    <input type="text" id="endereco" className="form-control" ref={endereco}
                        defaultValue={imovel?.imv_endereco} placeholder="Rua, número" />
                </div>

                <div>
                    <label className="form-label" htmlFor="bairro">Bairro</label>
                    <input type="text" id="bairro" className="form-control" ref={bairro} defaultValue={imovel?.imv_bairro} />
                </div>

                <label className="interruptor inteiro form-switch" htmlFor="disponivel">
                    <div>
                        <strong>Disponível para locação</strong>
                        <span>Desmarque se o imóvel já estiver alugado.</span>
                    </div>
                    <input type="checkbox" role="switch" id="disponivel" className="form-check-input" ref={disponivel}
                        defaultChecked={imovel ? imovel.imv_disponivel === 'S' : true} />
                </label>
            </div>

            <div className="form-rodape">
                <Link className="btn btn-claro" href="/admin/imovel">Cancelar</Link>
                <Button texto={imovel ? 'Salvar alterações' : 'Cadastrar imóvel'} icone="fas fa-check" funcao={gravar} />
            </div>
        </form>
    )
}
