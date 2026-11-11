'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ApiClient } from '@/utils/apiCliente'
import { iniciais } from '@/utils/formatar'
import Button from './button'

// formulário de alteração de usuário (o cadastro é público, feito via POST /usuario)
export default function FormUsuario({ usuario }) {
    const router = useRouter()

    let nome = useRef('')
    let email = useRef('')
    let senha = useRef('')
    let perfil = useRef('')

    async function gravar() {
        let obj = {
            usu_nome: nome.current.value.trim(),
            usu_email: email.current.value.trim(),
            usu_senha: senha.current.value, // em branco = mantém a senha atual
            per_id: Number(perfil.current.value)
        }
        if (!obj.usu_nome || !obj.usu_email) {
            toast.error('Preencha nome e e-mail!')
            return
        }
        if (obj.usu_senha && obj.usu_senha.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres')
            return
        }

        let r = await ApiClient.put('/usuario/' + usuario.usu_id, obj)
        if (r) {
            toast.success('Usuário alterado com sucesso')
            router.push('/admin/usuario')
        }
    }

    return (
        <form className="cartao cartao-corpo form-limite anima-escala" onSubmit={(e) => e.preventDefault()}>
            <div className="pessoa mb-4">
                <span className="avatar" style={{ width: '3rem', height: '3rem', fontSize: '1rem' }} aria-hidden="true">
                    {iniciais(usuario.usu_nome)}
                </span>
                <div>
                    <span className="titulo-linha">{usuario.usu_nome}</span>
                    <span className="sub-linha">{usuario.usu_email}</span>
                </div>
            </div>

            <div className="form-grade">
                <div>
                    <label className="form-label" htmlFor="nome">Nome</label>
                    <input type="text" id="nome" className="form-control" ref={nome} defaultValue={usuario.usu_nome} />
                </div>

                <div>
                    <label className="form-label" htmlFor="email">E-mail</label>
                    <input type="email" id="email" className="form-control" ref={email} defaultValue={usuario.usu_email} />
                </div>

                <div>
                    <label className="form-label" htmlFor="senha">Nova senha</label>
                    <input type="password" id="senha" className="form-control" ref={senha}
                        placeholder="••••••" autoComplete="new-password" />
                    <p className="dica-campo">Deixe em branco para manter a senha atual.</p>
                </div>

                <div>
                    <label className="form-label" htmlFor="perfil">Perfil</label>
                    <select id="perfil" className="form-select" ref={perfil} defaultValue={usuario.per_id}>
                        <option value={1}>Administrador</option>
                        <option value={2}>Locatário</option>
                    </select>
                </div>
            </div>

            <div className="form-rodape">
                <Link className="btn btn-claro" href="/admin/usuario">Cancelar</Link>
                <Button texto="Salvar alterações" icone="fas fa-check" funcao={gravar} />
            </div>
        </form>
    )
}
