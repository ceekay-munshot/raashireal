import React from 'react'
import { Card, Insight, Stat } from '../components/kit.jsx'
import ChartCard from '../components/ChartCard.jsx'
import { KpiBars } from '../components/charts.jsx'
import { BarRows, HeatTable } from '../components/DataTable.jsx'
import { COMPANIES, shortName, latest, DATA } from '../lib/ui.js'
import { num, crK } from '../lib/format.js'

const nn = arr => arr.filter(v => v != null)

export default function Operations({ selected }) {
  const K = DATA.kpi.RPTECH
  const snapRows = (fn) => COMPANIES.filter(c => selected.includes(c.id))
    .map(c => ({ id: c.id, name: shortName(c.id), color: c.color, v: fn(c.id) })).filter(r => r.v != null)

  const brands = snapRows(id => DATA.snap[id]?.brands)
  const partners = snapRows(id => DATA.snap[id]?.channelPartners)
  const revPerPart = snapRows(id => { const p = DATA.snap[id]?.channelPartners; return p ? latest(id).sales / p : null })
  const revPerEmp = latest('RPTECH').sales / 1598

  const SCORE = [
    { key: 'brands', label: 'Brands', fmt: num, dir: 'high' },
    { key: 'channelPartners', label: 'Partners', fmt: num, dir: 'high' },
    { key: 'warehouses', label: 'Warehouses', fmt: num, dir: 'high' },
    { key: 'branches', label: 'Branches', fmt: num, dir: 'high' },
    { key: 'employees', label: 'Employees', fmt: num, dir: 'high' },
  ]

  return (
    <div className="grid" style={{ gap: 14 }}>
      {/* Rashi footprint — every KPI from the screenshots */}
      <div className="grid g-4" style={{ gap: 12 }}>
        <Stat k="🏷️ Global brands" value="78" accent="#ee5a24" delta={1} deltaLabel="45 → 78 in 5 yrs" spark={K.brands} sparkColor="#ee5a24" />
        <Stat k="🤝 Channel partners" value={num(10300)} accent="#2a78d6" delta={1} deltaLabel="8.8k → 10.3k" spark={K.channelPartners} sparkColor="#2a78d6" />
        <Stat k="📇 Active SKUs" value={num(18479)} accent="#12a07a" delta={1} deltaLabel="11.9k → 18.5k" spark={K.skus} sparkColor="#12a07a" />
        <Stat k="🏬 Warehouses" value="71" accent="#7c4fc4" delta={1} deltaLabel="58 → 71" spark={K.warehouses} sparkColor="#7c4fc4" />
      </div>
      <div className="grid g-4" style={{ gap: 12 }}>
        <Stat k="📍 Locations billed" value={num(701)} accent="#2a78d6" delta={1} deltaLabel="664 → 701" spark={nn(K.locations)} sparkColor="#2a78d6" />
        <Stat k="📦 Units distributed" value="618 M" accent="#ee5a24" delta={1} deltaLabel="380M → 618M cumulative" spark={nn(K.cumUnitsMn)} sparkColor="#ee5a24" />
        <Stat k="👥 Employees" value={num(1598)} accent="#12a07a" delta={1} deltaLabel="1,423 → 1,598" spark={nn(K.employees)} sparkColor="#12a07a" />
        <Stat k="⚡ Revenue / employee" value={'₹' + revPerEmp.toFixed(1)} unit=" Cr" accent="#7c4fc4" delta={1} deltaLabel="asset-light output" />
      </div>

      {/* head-to-head operational scorecard */}
      <Card title="Operational scale — head to head" sub="Latest disclosed footprint · green = biggest in column (scale, not quality)">
        <HeatTable rowIds={selected} columns={SCORE} get={(id, k) => DATA.snap[id]?.[k]} />
        <Insight icon="📐">On the India-focused players Rashi carries the <b>deepest brand roster and widest footprint</b>;
          Redington plays a different weight class on partners &amp; warehouses (global scale), but doesn't disclose branches/headcount here.</Insight>
      </Card>

      <div className="grid g-12">
        <ChartCard title="Rashi's expanding vendor portfolio" sub="Number of global technology brands carried"
          chart={<KpiBars labels={K.fy.map(y => 'FY' + String(y).slice(2))} values={K.brands} color="#ee5a24" height={230} />}
          table={<BarRows rows={K.fy.map((y, i) => ({ id: y, name: 'FY' + String(y).slice(2), color: '#ee5a24', v: K.brands[i] }))} />}
          insight={<Insight icon="🧲">Rashi added <b>33 brands in five years</b> (+73%). A growing vendor roster is
            compounding trust — brands don't hand their India business to a shaky partner.</Insight>} />

        <Card title="Productivity — revenue per relationship" sub="₹ Cr of revenue per channel partner">
          <BarRows rows={revPerPart} fmt={v => '₹' + v.toFixed(2) + ' Cr'} />
          <Insight icon="⚡">Rashi and Redington extract <b>~₹1.5 Cr per partner</b> — roughly 5× what the smaller
            players manage. Same partner count, very different yield.</Insight>
        </Card>
      </div>
    </div>
  )
}
