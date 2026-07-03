import React from 'react'
import { Card, Stat, Insight, Legend } from '../components/kit.jsx'
import ChartCard from '../components/ChartCard.jsx'
import { SingleBars, TrendChart } from '../components/charts.jsx'
import { HeatTable, SeriesTable } from '../components/DataTable.jsx'
import { latest, seriesOf, rows, DATA } from '../lib/ui.js'
import { crK, cr, pct, num, days, cagr, x1, crAxis, crLabel } from '../lib/format.js'

export default function Overview({ selected, openModal }) {
  const R = latest('RPTECH')
  const sales = seriesOf('RPTECH', 'sales').values
  const revCagr = cagr(sales)
  const mult = sales[sales.length - 1] / sales[0]

  const cccModal = () => openModal({
    title: 'Cash conversion cycle — the real battleground',
    sub: 'Days of cash locked in operations (inventory + receivables − payables). Lower = leaner.',
    content: <>
      <TrendChart ids={selected} metric="ccc" yearMin={2019} height={260} fmt={v => v + 'd'} />
      <Insight icon="💰">Rashi's cash sits idle roughly <b>{Math.round(latest('RPTECH').ccc)} days</b> vs
        Redington's <b>~{Math.round(latest('REDINGTON').ccc)} days</b> — it needs nearly double the working
        capital to push each rupee of sales.</Insight>
    </>
  })

  const revModal = () => openModal({
    title: 'Revenue — Rashi vs peers', sub: 'Absolute scale (₹ Cr). Redington is ~7× Rashi; the story isn\'t size, it\'s efficiency.',
    content: <TrendChart ids={selected} metric="sales" yearMin={2017} height={280} fmt={crK} yFmt={crAxis} />
  })

  return (
    <div className="grid" style={{ gap: 14 }}>
      {/* hero stat tiles */}
      <div className="grid g-4" style={{ gap: 12 }}>
        <Stat k="Revenue FY26" icon="📦" value={crK(R.sales)} accent="#ee5a24"
          delta={revCagr} deltaLabel={`${revCagr.toFixed(0)}% CAGR · 8 yrs`} spark={sales} sparkColor="#ee5a24" onClick={revModal} />
        <Stat k="Net Profit FY26" icon="📈" value={cr(R.netProfit)} accent="#2a78d6"
          delta={12} deltaLabel={`${pct(R.netMargin)} margin`} spark={seriesOf('RPTECH', 'netProfit').values} sparkColor="#2a78d6" />
        <Stat k="Return on Capital" icon="⚙️" value={pct(R.roce)} accent="#12a07a"
          delta={1} deltaLabel="capital-efficient" spark={seriesOf('RPTECH', 'roce').values} sparkColor="#12a07a" />
        <Stat k="Cash cycle" icon="⏳" value={days(R.ccc)} accent="#e0a04b"
          delta={-1} deltaLabel="stretched from 38d" spark={seriesOf('RPTECH', 'ccc').values} sparkColor="#e0a04b" onClick={cccModal} />
      </div>

      {/* flywheel */}
      <Card title="The distribution flywheel" sub="Rashi is the bridge between global tech brands and India's reseller channel — asset-light, relationship-heavy.">
        <div className="flow">
          <div className="flow-node"><div className="fn-k">Vendors</div><div className="fn-v">78</div><div className="fn-l">global tech brands</div></div>
          <div className="flow-arrow">→</div>
          <div className="flow-node" style={{ background: 'var(--rashi-soft)', borderColor: '#f7d8c6' }}>
            <div className="fn-k" style={{ color: 'var(--rashi-ink)' }}>Rashi Peripherals</div>
            <div className="fn-v" style={{ color: 'var(--rashi)' }}>55</div><div className="fn-l">branches · 71 warehouses</div></div>
          <div className="flow-arrow">→</div>
          <div className="flow-node"><div className="fn-k">Channel</div><div className="fn-v">10,300</div><div className="fn-l">distribution partners</div></div>
          <div className="flow-arrow">→</div>
          <div className="flow-node"><div className="fn-k">Reach</div><div className="fn-v">701</div><div className="fn-l">locations billed</div></div>
        </div>
        <Insight icon="🔗">A distributor's moat isn't a factory — it's <b>78 vendor relationships</b> feeding
          <b> 10,300 resellers</b>. Rashi barely spends on capex; its real investment is working capital.</Insight>
      </Card>

      {/* revenue + peer snapshot */}
      <div className="grid g-12">
        <ChartCard title="Rashi revenue trajectory" sub="₹ Cr · FY19 → FY26"
          onExpand={revModal}
          chart={<SingleBars id="RPTECH" metric="sales" yearMin={2019} height={250} fmt={crK} yFmt={crAxis} labelFmt={crLabel} />}
          table={<SeriesTable ids={['RPTECH']} metric="sales" fmt={crK} yearMin={2019} />}
          insight={<Insight icon="🚀">Revenue compounded <b>~{revCagr.toFixed(0)}% a year</b> — a <b>{mult.toFixed(1)}×</b> jump in 8 years,
            from ₹3,990 Cr to ₹15,827 Cr.</Insight>} />

        <ChartCard title="Where everyone stands" sub="Latest full year · click a cell to drill in"
          defaultView="table"
          chart={<PeerMini selected={selected} />}
          table={<PeerMini selected={selected} />}
          insight={<Insight plain icon="⚖️">Margins look near-identical across the board — the separation shows up in
            <b> ROCE</b> and the <b>cash cycle</b>, not the P&L.</Insight>} />
      </div>
    </div>
  )
}

function PeerMini({ selected }) {
  const cols = [
    { key: 'sales', label: 'Revenue', fmt: crK, dir: 'high' },
    { key: 'grossMargin', label: 'Gross', fmt: v => pct(v), dir: 'high' },
    { key: 'netMargin', label: 'Net', fmt: v => pct(v), dir: 'high' },
    { key: 'roce', label: 'ROCE', fmt: v => pct(v), dir: 'high' },
    { key: 'ccc', label: 'Cash cycle', fmt: days, dir: 'low', sub: 'lower better' },
  ]
  return <HeatTable rowIds={selected} columns={cols} get={(id, k) => latest(id)?.[k]} />
}
