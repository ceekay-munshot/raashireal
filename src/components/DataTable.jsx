import React from 'react'
import { colorOf, shortName, mergeAnnual, mergeQuarters } from '../lib/ui.js'
import { Sparkline } from './kit.jsx'

/* heat interpolation: t=0 worst (soft red) → t=1 best (soft green) */
function heat(t) {
  t = Math.max(0, Math.min(1, t))
  const bad = [248, 210, 204], mid = [255, 252, 245], good = [200, 233, 214]
  const lerp = (a, b, k) => Math.round(a + (b - a) * k)
  const mix = t < 0.5
    ? bad.map((c, i) => lerp(c, mid[i], t * 2))
    : mid.map((c, i) => lerp(c, good[i], (t - 0.5) * 2))
  return `rgb(${mix[0]},${mix[1]},${mix[2]})`
}

/* SCORECARD heat table.
   rows: [{id}]  columns:[{key,label,fmt,dir:'high'|'low',sub}]
   values pulled from a getter(id,key) */
export function HeatTable({ rowIds, columns, get, onCell }) {
  // per-column normalization
  const stats = {}
  columns.forEach(c => {
    const vals = rowIds.map(id => get(id, c.key)).filter(v => v != null && isFinite(v))
    stats[c.key] = { min: Math.min(...vals), max: Math.max(...vals) }
  })
  return (
    <div className="tblwrap">
      <table className="dtable">
        <thead><tr>
          <th>Company</th>
          {columns.map(c => <th key={c.key}>{c.label}{c.sub && <div style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0, color: '#b3aca2' }}>{c.sub}</div>}</th>)}
        </tr></thead>
        <tbody>
          {rowIds.map(id => (
            <tr key={id}>
              <td><span className="co"><span className="dot" style={{ background: colorOf(id) }} />{shortName(id)}</span></td>
              {columns.map(c => {
                const v = get(id, c.key)
                const { min, max } = stats[c.key]
                let t = max === min ? 0.5 : (v - min) / (max - min)
                if (c.dir === 'low') t = 1 - t
                const best = v != null && (c.dir === 'low' ? v === min : v === max)
                return (
                  <td key={c.key} style={{ background: v == null ? 'transparent' : heat(t), cursor: onCell ? 'pointer' : 'default' }}
                    className={best ? 'rank1' : ''} onClick={onCell ? () => onCell(id, c) : undefined}>
                    {v == null ? '—' : c.fmt(v)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* SERIES table (table-view of a trend chart): companies as rows, years/quarters as cols + sparkline */
export function SeriesTable({ ids, metric, fmt = v => v, kind = 'annual', yearMin }) {
  const data = kind === 'quarter' ? mergeQuarters(ids, metric) : mergeAnnual(ids, metric, yearMin)
  const xKey = kind === 'quarter' ? 'q' : 'fy'
  const cols = data.map(d => d[xKey])
  return (
    <div className="tblwrap">
      <table className="dtable">
        <thead><tr>
          <th>Company</th>{cols.map(c => <th key={c}>{c}</th>)}<th>Trend</th>
        </tr></thead>
        <tbody>
          {ids.map(id => {
            const vals = data.map(d => d[id])
            return (
              <tr key={id}>
                <td><span className="co"><span className="dot" style={{ background: colorOf(id) }} />{shortName(id)}</span></td>
                {vals.map((v, i) => <td key={i}>{v == null ? '—' : fmt(v)}</td>)}
                <td><Sparkline values={vals} color={colorOf(id)} w={70} h={22} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* simple bar-in-cell rows for a single-metric comparison inside a card */
export function BarRows({ rows, fmt = v => v, dir = 'high' }) {
  const vals = rows.map(r => r.v).filter(v => v != null)
  const max = Math.max(...vals), min = Math.min(0, ...vals)
  return (
    <table className="dtable"><tbody>
      {rows.map(r => {
        const w = max === min ? 0 : ((r.v - min) / (max - min)) * 100
        return (
          <tr key={r.id}>
            <td style={{ width: 96 }}><span className="co"><span className="dot" style={{ background: r.color }} />{r.name}</span></td>
            <td style={{ width: '100%' }}>
              <div className="cell-bar">
                <span className="fill" style={{ width: w + '%', background: r.color, opacity: .22 }} />
                <span className="cv tnum">{fmt(r.v)}</span>
              </div>
            </td>
          </tr>
        )
      })}
    </tbody></table>
  )
}
