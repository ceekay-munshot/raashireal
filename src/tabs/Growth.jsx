import React, { useState } from 'react'
import { Card, Insight } from '../components/kit.jsx'
import ChartCard from '../components/ChartCard.jsx'
import { TrendChart, GroupedYearBars, BarsByCompany } from '../components/charts.jsx'
import { SeriesTable } from '../components/DataTable.jsx'
import { seriesOf, latest, mergeAnnual } from '../lib/ui.js'
import { crK, pct, signed, cagr, crAxis } from '../lib/format.js'

const MARGINS = [
  { key: 'grossMargin', label: 'Gross' },
  { key: 'ebitdaMargin', label: 'EBITDA' },
  { key: 'netMargin', label: 'Net' },
]

export default function Growth({ selected, openModal }) {
  const [m, setM] = useState('grossMargin')
  const rCagr = cagr(seriesOf('RPTECH', 'sales').values)
  const cCagr = cagr(seriesOf('CREATIVE', 'sales').values)

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid g-12">
        <ChartCard title="Revenue — the field over time" sub="₹ Cr · absolute scale"
          onExpand={() => openModal({ title: 'Revenue over time', sub: '₹ Cr', content: <TrendChart ids={selected} metric="sales" yearMin={2017} height={300} fmt={crK} yFmt={crAxis} /> })}
          chart={<TrendChart ids={selected} metric="sales" yearMin={2017} height={250} fmt={crK} yFmt={crAxis} />}
          table={<SeriesTable ids={selected} metric="sales" fmt={crK} yearMin={2017} />}
          insight={<Insight icon="🚀">Rashi (<b>{rCagr.toFixed(0)}%</b>) and Creative (<b>{cCagr.toFixed(0)}%</b>) compound
            fastest; Redington is far bigger but grows steadily. Size ≠ momentum.</Insight>} />

        <ChartCard title="Revenue growth, year on year" sub="% YoY"
          chart={<GroupedYearBars ids={selected} metric="salesGrowth" yearMin={2021} height={250} fmt={v => v + '%'} />}
          table={<SeriesTable ids={selected} metric="salesGrowth" fmt={v => signed(v, 0) + '%'} yearMin={2021} />}
          insight={<Insight plain icon="📊">Distribution growth rides the PC/component upgrade cycle — everyone
            moves together, but the amplitude differs.</Insight>} />
      </div>

      <div className="grid g-12">
        <ChartCard title="Margins over time" sub="Pick a margin — watch how close the lines run"
          extraTools={<div className="seg">{MARGINS.map(x =>
            <button key={x.key} className={m === x.key ? 'on' : ''} onClick={() => setM(x.key)}>{x.label}</button>)}</div>}
          chart={<TrendChart ids={selected} metric={m} yearMin={2019} height={250} fmt={v => pct(v, 0)} />}
          table={<SeriesTable ids={selected} metric={m} fmt={v => pct(v)} yearMin={2019} />}
          insight={<Insight icon="⚖️">This is the punchline: <b>gross margins sit ~5–8%, net ~1.3–2.6%</b> for
            everyone. No distributor wins on margin — so the meeting can't be about margin.</Insight>} />

        <ChartCard title="Net margin — who keeps the most" sub="Latest FY · % of revenue"
          chart={<BarsByCompany ids={selected} metric="netMargin" height={230} fmt={v => pct(v)} />}
          table={<SeriesTable ids={selected} metric="netMargin" fmt={v => pct(v)} yearMin={2022} />}
          insight={<Insight icon="🥇">Creative Newtech quietly leads on net margin — its brand-incubation arm
            earns more per rupee than pure box-moving. A <b>product-mix</b> lesson, not a scale one.</Insight>} />
      </div>
    </div>
  )
}
