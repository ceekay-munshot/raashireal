import React from 'react'
import { Card, Insight, Stat } from '../components/kit.jsx'
import ChartCard from '../components/ChartCard.jsx'
import { CCCStack, TrendChart, SingleBars, BarsByCompany } from '../components/charts.jsx'
import { SeriesTable } from '../components/DataTable.jsx'
import { latest, seriesOf } from '../lib/ui.js'
import { days, pct, cr, x1, crAxis, crLabel } from '../lib/format.js'

export default function Capital({ selected, openModal }) {
  const R = latest('RPTECH'), RED = latest('REDINGTON')
  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid g-2">
        <ChartCard title="Where Rashi's cash gets stuck" sub="Cash conversion cycle, broken apart · inventory + receivables − payables"
          onExpand={() => openModal({ title: 'Cash conversion cycle — decomposed', sub: 'Higher stack = more cash locked in the business',
            content: <CCCStack id="RPTECH" yearMin={2019} height={320} /> })}
          chart={<CCCStack id="RPTECH" yearMin={2020} height={260} />}
          insight={<Insight icon="⏳">Rashi holds inventory <b>~{Math.round(R.inventoryDays)} days</b> and waits
            <b> ~{Math.round(R.debtorDays)} days</b> to get paid, offset by <b>~{Math.round(R.payableDays)} days</b> of
            vendor credit → a <b>{Math.round(R.ccc)}-day</b> cash cycle that has crept up over time.</Insight>} />

        <ChartCard title="Cash cycle vs peers" sub="Days · lower is leaner"
          chart={<TrendChart ids={selected} metric="ccc" yearMin={2019} height={250} fmt={v => v + 'd'} />}
          table={<SeriesTable ids={selected} metric="ccc" fmt={days} yearMin={2019} />}
          insight={<Insight icon="💰">The gap that matters: Rashi <b>{Math.round(R.ccc)}d</b> vs Redington
            <b> ~{Math.round(RED.ccc)}d</b>. Rashi ties up nearly <b>2×</b> the working capital per rupee of sales.</Insight>} />
      </div>

      <div className="grid g-2">
        <ChartCard title="Return on capital employed" sub="ROCE % · the distributor's true scoreboard"
          chart={<TrendChart ids={selected} metric="roce" yearMin={2019} height={240} fmt={v => pct(v, 0)} />}
          table={<SeriesTable ids={selected} metric="roce" fmt={v => pct(v)} yearMin={2019} />}
          insight={<Insight icon="⚙️">Because margins are fixed, ROCE is decided by <b>how fast you spin capital</b>.
            Redington's tighter cycle lets it out-earn on the same thin margin.</Insight>} />

        <ChartCard title="The catch: growth eats cash" sub="Rashi operating cash flow · ₹ Cr"
          chart={<SingleBars id="RPTECH" metric="cfo" yearMin={2019} height={240} fmt={cr} yFmt={crAxis} labelFmt={crLabel} color="#7c4fc4" />}
          table={<SeriesTable ids={['RPTECH']} metric="cfo" fmt={cr} yearMin={2019} />}
          insight={<Insight icon="⚠️">Operating cash flow has been <b>negative most years</b> — Rashi funds growth by
            absorbing working capital and borrowing. Fine while growth is high — but <b>Compuage</b>, once a ₹3,700 Cr
            peer, collapsed to near-zero when this exact lever broke. Discipline here is survival.</Insight>} />
      </div>
    </div>
  )
}
