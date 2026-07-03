import React from 'react'
import { Card, Insight } from '../components/kit.jsx'
import { HeatTable } from '../components/DataTable.jsx'
import { latest, rowAt, shortName, colorOf, DATA } from '../lib/ui.js'
import { pct, x1, days, crK, signed } from '../lib/format.js'

// Compuage collapsed FY23-24 → score it at its last healthy year for a fair comparison
const scoreRow = (id) => id === 'COMPUAGE' ? rowAt('COMPUAGE', 2022) : latest(id)

function get(id, key) {
  const r = scoreRow(id); if (!r) return null
  if (key === 'revPerPartner') { const cp = DATA.snap[id]?.channelPartners; return cp ? r.sales / cp : null }
  if (key === 'growth') return r.salesGrowth
  return r[key]
}

const COLS = [
  { key: 'sales', label: 'Revenue', fmt: crK, dir: 'high' },
  { key: 'growth', label: 'Growth', fmt: v => signed(v, 0) + '%', dir: 'high', sub: 'YoY' },
  { key: 'grossMargin', label: 'Gross', fmt: v => pct(v), dir: 'high' },
  { key: 'ebitdaMargin', label: 'EBITDA', fmt: v => pct(v), dir: 'high' },
  { key: 'netMargin', label: 'Net', fmt: v => pct(v), dir: 'high' },
  { key: 'roce', label: 'ROCE', fmt: v => pct(v), dir: 'high' },
  { key: 'roe', label: 'ROE', fmt: v => pct(v), dir: 'high' },
  { key: 'debtEquity', label: 'Debt/Eq', fmt: v => x1(v), dir: 'low', sub: 'lower better' },
  { key: 'ccc', label: 'Cash cycle', fmt: days, dir: 'low', sub: 'lower better' },
  { key: 'revPerPartner', label: '₹/partner', fmt: v => '₹' + v.toFixed(1) + 'Cr', dir: 'high', sub: 'productivity' },
]

const LEADERS = [
  { key: 'sales', label: 'Biggest scale', dir: 'high', icon: '🏔️' },
  { key: 'growth', label: 'Fastest grower', dir: 'high', icon: '🚀' },
  { key: 'netMargin', label: 'Best net margin', dir: 'high', icon: '🥇' },
  { key: 'roce', label: 'Best return on capital', dir: 'high', icon: '⚙️' },
  { key: 'ccc', label: 'Leanest cash cycle', dir: 'low', icon: '⏳' },
]

export default function Scorecard({ selected, openModal }) {
  const leaderOf = (key, dir) => {
    let best = null, bv = null
    selected.forEach(id => { const v = get(id, key); if (v == null) return
      if (bv == null || (dir === 'high' ? v > bv : v < bv)) { bv = v; best = id } })
    return best
  }
  return (
    <div className="grid" style={{ gap: 14 }}>
      <Card title="Peer scorecard — one look, who leads what"
        sub="Green = best in column, red = worst. Every number is color-graded so the winner jumps out. Compuage shown at FY22 (pre-collapse).">
        <HeatTable rowIds={selected} columns={COLS} get={get}
          onCell={(id, c) => openModal({
            title: `${shortName(id)} · ${c.label}`,
            sub: 'Where this sits in the peer set',
            content: <MetricBreak metric={c} selected={selected} get={get} />
          })} />
        <Insight icon="🎯">No one sweeps the board. Rashi leads on <b>growth &amp; scale-vs-Creative</b>; Redington
          leads on <b>ROCE and cash cycle</b>; Creative leads on <b>margin</b>. That's your talking map.</Insight>
      </Card>

      <div className="grid g-4" style={{ gap: 12 }}>
        {LEADERS.map(l => {
          const id = leaderOf(l.key, l.dir)
          const col = COLS.find(c => c.key === l.key)
          return (
            <div className="stat" key={l.key} style={{ borderTop: `3px solid ${colorOf(id)}` }}>
              <div className="k">{l.icon} {l.label}</div>
              <div className="v" style={{ fontSize: 20, color: colorOf(id) }}>{shortName(id)}</div>
              <div className="d" style={{ color: 'var(--ink-2)' }}>{col.fmt(get(id, l.key))}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MetricBreak({ metric, selected, get }) {
  const rows = selected.map(id => ({ id, v: get(id, metric.key) })).filter(r => r.v != null)
    .sort((a, b) => metric.dir === 'low' ? a.v - b.v : b.v - a.v)
  const max = Math.max(...rows.map(r => Math.abs(r.v)))
  return (
    <table className="dtable"><tbody>
      {rows.map((r, i) => (
        <tr key={r.id}>
          <td style={{ width: 120 }}><span className="co"><span className="dot" style={{ background: colorOf(r.id) }} />{shortName(r.id)}{i === 0 && <span className="badge best" style={{ marginLeft: 6 }}>lead</span>}</span></td>
          <td style={{ width: '100%' }}>
            <div className="cell-bar">
              <span className="fill" style={{ width: (Math.abs(r.v) / max * 100) + '%', background: colorOf(r.id), opacity: .22 }} />
              <span className="cv tnum">{metric.fmt(r.v)}</span>
            </div>
          </td>
        </tr>
      ))}
    </tbody></table>
  )
}
