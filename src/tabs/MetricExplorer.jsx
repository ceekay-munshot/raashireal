import React, { useState } from 'react'
import { Card, Insight } from '../components/kit.jsx'
import ChartCard from '../components/ChartCard.jsx'
import { TrendChart, BarsByCompany } from '../components/charts.jsx'
import { SeriesTable } from '../components/DataTable.jsx'
import { latest, shortName, colorOf } from '../lib/ui.js'
import { crK, crAxis, pct, days, x1 } from '../lib/format.js'

const P = v => pct(v), PA = v => pct(v, 0), D = v => days(v)
const METRICS = [
  { g: 'Growth', k: 'sales', label: 'Revenue', fmt: crK, yFmt: crAxis, dir: 'high', min: 2017 },
  { g: 'Growth', k: 'salesGrowth', label: 'Revenue growth', fmt: v => pct(v) , yFmt: PA, dir: 'high', min: 2021 },
  { g: 'Profitability', k: 'grossMargin', label: 'Gross margin', fmt: P, yFmt: PA, dir: 'high', min: 2019 },
  { g: 'Profitability', k: 'ebitdaMargin', label: 'EBITDA margin', fmt: P, yFmt: PA, dir: 'high', min: 2019 },
  { g: 'Profitability', k: 'netMargin', label: 'Net margin', fmt: P, yFmt: PA, dir: 'high', min: 2019 },
  { g: 'Returns', k: 'roce', label: 'ROCE', fmt: P, yFmt: PA, dir: 'high', min: 2019 },
  { g: 'Returns', k: 'roe', label: 'ROE', fmt: P, yFmt: PA, dir: 'high', min: 2019 },
  { g: 'Working capital', k: 'ccc', label: 'Cash cycle', fmt: D, yFmt: D, dir: 'low', min: 2019 },
  { g: 'Working capital', k: 'inventoryDays', label: 'Inventory days', fmt: D, yFmt: D, dir: 'low', min: 2019 },
  { g: 'Working capital', k: 'debtorDays', label: 'Debtor days', fmt: D, yFmt: D, dir: 'low', min: 2019 },
  { g: 'Working capital', k: 'payableDays', label: 'Payable days', fmt: D, yFmt: D, dir: 'high', min: 2019 },
  { g: 'Balance sheet', k: 'debtEquity', label: 'Debt / Equity', fmt: x1, yFmt: x1, dir: 'low', min: 2019 },
  { g: 'Balance sheet', k: 'borrowings', label: 'Total debt', fmt: crK, yFmt: crAxis, dir: 'low', min: 2019 },
  { g: 'Balance sheet', k: 'cfo', label: 'Operating cash flow', fmt: crK, yFmt: crAxis, dir: 'high', min: 2019 },
]
const GROUPS = ['Growth', 'Profitability', 'Returns', 'Working capital', 'Balance sheet']

export default function MetricExplorer({ selected }) {
  const [mk, setMk] = useState('roce')
  const m = METRICS.find(x => x.k === mk)
  const leader = (() => {
    let best = null, bv = null
    selected.forEach(id => { const v = latest(id)?.[m.k]; if (v == null) return
      if (bv == null || (m.dir === 'high' ? v > bv : v < bv)) { bv = v; best = id } })
    return { id: best, v: bv }
  })()

  return (
    <div className="grid" style={{ gap: 14 }}>
      <Card title="Metric explorer" sub="Pick any metric — every selected company is compared on it, over time and today.">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {GROUPS.map(g => (
            <div key={g} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{g}</div>
              <div className="pill-row">
                {METRICS.filter(x => x.g === g).map(x => (
                  <button key={x.k} onClick={() => setMk(x.k)}
                    className="chip" style={mk === x.k ? { background: 'var(--rashi)', color: '#fff', borderColor: 'transparent' } : {}}>
                    {x.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid g-12">
        <ChartCard title={`${m.label} — over time`} sub="All selected companies, same axis"
          chart={<TrendChart ids={selected} metric={m.k} yearMin={m.min} height={300} fmt={m.fmt} yFmt={m.yFmt} />}
          table={<SeriesTable ids={selected} metric={m.k} fmt={m.fmt} yearMin={m.min} />}
          insight={<Insight icon={m.dir === 'low' ? '🥇' : '🏆'}>On <b>{m.label.toLowerCase()}</b>, {shortName(leader.id)} leads
            the pack at <b>{m.fmt(leader.v)}</b> {m.dir === 'low' ? '(lowest is best here)' : ''}.</Insight>} />

        <Card title="Where they stand now" sub={`${m.label} · latest`}>
          <BarsByCompany ids={selected} metric={m.k} height={260} fmt={m.fmt} sortDir={m.dir === 'low' ? 'asc' : 'desc'} />
        </Card>
      </div>
    </div>
  )
}
