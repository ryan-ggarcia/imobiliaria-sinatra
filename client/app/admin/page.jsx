'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { ApiClient } from "@/utils/apiCliente"
import { formatarMoeda } from "@/utils/formatar"
import Cabecalho from "@/app/components/cabecalho"
import ContadorAnimado from "@/app/components/contadorAnimado"
import styles from "@/public/css/painel.module.css"

function saudacao() {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

export default function Page() {
  const [dados, setDados] = useState(null)

  useEffect(() => {
    async function carregar() {
      const [usuarios, imoveis] = await Promise.all([
        ApiClient.get('/usuario'),
        ApiClient.get('/imovel'),
      ])
      const lista = imoveis || []
      const disponiveis = lista.filter((i) => i.imv_disponivel === 'S')
      setDados({
        usuarios: (usuarios || []).length,
        imoveis: lista.length,
        disponiveis: disponiveis.length,
        alugados: lista.length - disponiveis.length,
        receita: lista
          .filter((i) => i.imv_disponivel === 'N')
          .reduce((soma, i) => soma + Number(i.imv_valor || 0), 0),
        recentes: [...lista].sort((a, b) => b.imv_id - a.imv_id).slice(0, 5),
      })
    }
    carregar()
  }, [])

  const ocupacao = dados?.imoveis ? Math.round((dados.alugados / dados.imoveis) * 100) : 0

  const cards = [
    { rotulo: "Imóveis na carteira", valor: dados?.imoveis, icone: "fa-house", tom: styles.tomPrimario },
    { rotulo: "Disponíveis", valor: dados?.disponiveis, icone: "fa-key", tom: styles.tomSucesso },
    { rotulo: "Alugados", valor: dados?.alugados, icone: "fa-file-signature", tom: styles.tomAlerta },
    { rotulo: "Usuários ativos", valor: dados?.usuarios, icone: "fa-users", tom: styles.tomInfo },
  ]

  return (
    <div>
      <Cabecalho sobre="Painel" titulo={saudacao()} subtitulo="Um resumo da sua imobiliária hoje." />

      <div className={styles.grade}>
        {cards.map((c, i) => (
          <div key={c.rotulo} className={`cartao ${styles.stat} anima-escala`} style={{ '--i': i }}>
            <span className={`${styles.statIcone} ${c.tom}`}><i className={`fas ${c.icone}`}></i></span>
            <span className={styles.statRotulo}>{c.rotulo}</span>
            <strong className={styles.statValor}>
              {dados ? <ContadorAnimado valor={c.valor} /> : <span className="esqueleto" style={{ width: '3rem', height: '1.8rem' }} />}
            </strong>
          </div>
        ))}
      </div>

      <div className={styles.linha}>
        <section className={`cartao cartao-corpo anima-escala ${styles.ocupacao}`} style={{ '--i': 4 }}>
          <h2 className={styles.secaoTitulo}>Taxa de ocupação</h2>
          <div className={styles.anelArea}>
            <div className={styles.anel} style={{ '--p': dados ? ocupacao : 0 }}>
              <span>{dados ? <ContadorAnimado valor={ocupacao} sufixo="%" /> : '—'}</span>
            </div>
            <div>
              <p className={styles.receitaRotulo}>Receita mensal em contratos</p>
              <p className={styles.receitaValor}>{dados ? formatarMoeda(dados.receita) : '—'}</p>
              <p className="dica-campo m-0">Soma do aluguel dos imóveis marcados como alugados.</p>
            </div>
          </div>
        </section>

        <section className="cartao anima-escala" style={{ '--i': 5 }}>
          <div className={styles.recentesTopo}>
            <h2 className={styles.secaoTitulo}>Imóveis recentes</h2>
            <Link href="/admin/imovel" className={styles.verTodos}>
              Ver todos <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <ul className={styles.recentes}>
            {dados == null && Array.from({ length: 4 }, (_, i) => (
              <li key={i}><span className="esqueleto" style={{ width: `${60 - i * 8}%` }} /></li>
            ))}
            {dados?.recentes.length === 0 && (
              <li className={styles.recenteVazio}>Nenhum imóvel cadastrado ainda.</li>
            )}
            {dados?.recentes.map((im, i) => (
              <li key={im.imv_id} className="anima-item" style={{ '--i': i + 4 }}>
                <Link href={`/admin/imovel/alterar/${im.imv_id}`} className={styles.recente}>
                  <span className={styles.recenteIcone}><i className="fas fa-house"></i></span>
                  <span className="flex-grow-1 text-truncate">
                    <span className="titulo-linha">{im.imv_descricao}</span>
                    <span className="sub-linha">{im.imv_bairro} · {im.imv_cidade}</span>
                  </span>
                  <span className="num titulo-linha">{formatarMoeda(im.imv_valor)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
