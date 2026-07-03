import { DATA } from '../data/dataset.js'

export const COMPANIES = DATA.companies
export const byId = Object.fromEntries(COMPANIES.map(c => [c.id, c]))
export const colorOf = (id) => byId[id]?.color || '#999'
export const nameOf = (id) => byId[id]?.name || id
export const shortName = (id) => ({RPTECH:'Rashi', REDINGTON:'Redington', CREATIVE:'Creative', COMPUAGE:'Compuage'}[id] || id)

// annual series for a company as {years:[], key:[]}
export const seriesOf = (id, key) => {
  const rows = DATA.annual[id] || []
  return { years: rows.map(r => r.y), values: rows.map(r => r[key]) }
}
export const rowAt = (id, year) => (DATA.annual[id] || []).find(r => r.y === year)
export const latest = (id) => { const r = DATA.annual[id]; return r ? r[r.length-1] : null }
export const rows = (id) => DATA.annual[id] || []

// merge multiple companies' annual key into recharts-friendly rows keyed by FY
export function mergeAnnual(ids, key, yearMin) {
  const yrs = new Set()
  ids.forEach(id => (DATA.annual[id]||[]).forEach(r => { if (!yearMin || r.y >= yearMin) yrs.add(r.y) }))
  return [...yrs].sort().map(y => {
    const o = { y, fy: 'FY' + String(y).slice(2) }
    ids.forEach(id => { const r = rowAt(id, y); o[id] = r ? r[key] : null })
    return o
  })
}

export function mergeQuarters(ids, key) {
  const labels = DATA.quarters[ids[0]]?.map(q => q.q) || []
  return labels.map((q, i) => {
    const o = { q }
    ids.forEach(id => { o[id] = DATA.quarters[id]?.[i]?.[key] ?? null })
    return o
  })
}

export { DATA }
