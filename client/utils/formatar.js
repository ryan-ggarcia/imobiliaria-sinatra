const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatarMoeda(valor) {
  const n = Number(valor)
  return Number.isFinite(n) ? moeda.format(n) : '—'
}

export function formatarCep(cep) {
  const d = String(cep ?? '').replace(/\D/g, '')
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : cep
}

export function iniciais(nome) {
  return String(nome ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

export const PERFIS = { 1: 'Administrador', 2: 'Locatário' }
