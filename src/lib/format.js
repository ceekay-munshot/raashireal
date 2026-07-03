// Indian-number + finance formatting helpers
export const inr = (v) => v == null ? '—' : Math.round(v).toLocaleString('en-IN')
export const cr = (v) => v == null ? '—' : '₹' + Math.round(v).toLocaleString('en-IN')
export const crK = (v) => {           // compact: ₹15,827 Cr  or ₹1.19 L Cr
  if (v == null) return '—'
  if (v >= 100000) return '₹' + (v/100000).toFixed(2) + ' L Cr'
  return '₹' + Math.round(v).toLocaleString('en-IN') + ' Cr'
}
export const pct = (v, d=1) => v == null ? '—' : v.toFixed(d) + '%'
export const days = (v) => v == null ? '—' : Math.round(v) + 'd'
export const x1 = (v) => v == null ? '—' : v.toFixed(1) + '×'
export const num = (v) => v == null ? '—' : Math.round(v).toLocaleString('en-IN')
export const fy = (y) => 'FY' + String(y).slice(2)
// compact axis for ₹ Cr values: 5000→5k, 119000→1.2L
export const crAxis = (v) => v == null ? '' :
  Math.abs(v) >= 100000 ? (v/100000).toFixed(1) + 'L' :
  Math.abs(v) >= 1000 ? Math.round(v/1000) + 'k' : String(Math.round(v))
// short bar-top label (no suffix → no wrap)
export const crLabel = (v) => v == null ? '' : '₹' + Math.round(v).toLocaleString('en-IN')
export const signed = (v, d=1) => v == null ? '—' : (v>=0?'+':'') + v.toFixed(d)

// CAGR between first and last of an array (skipping nulls)
export const cagr = (arr) => {
  const v = arr.filter(x => x != null && x > 0)
  if (v.length < 2) return null
  const n = v.length - 1
  return (Math.pow(v[v.length-1]/v[0], 1/n) - 1) * 100
}
