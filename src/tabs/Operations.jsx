import React from 'react'
import { Card, Insight, Stat } from '../components/kit.jsx'
import ChartCard from '../components/ChartCard.jsx'
import { KpiLine, KpiBars } from '../components/charts.jsx'
import { BarRows } from '../components/DataTable.jsx'
import { COMPANIES, shortName, latest, DATA } from '../lib/ui.js'
import { num, crK } from '../lib/format.js'

export default function Operations({ selected, openModal }) {
  const K = DATA.kpi.RPTECH
  const snapRows = (fn) => COMPANIES.filter(c => selected.includes(c.id))
    .map(c => ({ id: c.id, name: shortName(c.id), color: c.color, v: fn(c.id) })).filter(r => r.v != null)

  const brands = snapRows(id => DATA.snap[id]?.brands)
  const partners = snapRows(id => DATA.snap[id]?.channelPartners)
  const revPerWh = snapRows(id => { const w = DATA.snap[id]?.warehouses; return w ? latest(id).sales / w : null })
  const revPerPart = snapRows(id => { const p = DATA.snap[id]?.channelPartners; return p ? latest(id).sales / p : null })

  return (
    <div className="grid" style={{ gap: 14 }}>
      {/* Rashi operating footprint tiles */}
      <div className="grid g-4" style={{ gap: 12 }}>
        <Stat k="🏷️ Global brands" value="78" accent="#ee5a24" delta={1} deltaLabel="45 → 78 in 5 yrs" spark={K.brands} sparkColor="#ee5a24" />
        <Stat k="🤝 Channel partners" value={num(10300)} accent="#2a78d6" delta={1} deltaLabel="8.8k → 10.3k" spark={K.channelPartners} sparkColor="#2a78d6" />
        <Stat k="📇 Active SKUs" value={num(18479)} accent="#12a07a" delta={1} deltaLabel="11.9k → 18.5k" spark={K.skus} sparkColor="#12a07a" />
        <Stat k="🏬 Warehouses" value="71" accent="#7c4fc4" delta={1} deltaLabel="58 → 71" spark={K.warehouses} sparkColor="#7c4fc4" />
      </div>

      <div className="grid g-12">
        <ChartCard title="Rashi's expanding vendor portfolio" sub="Number of global technology brands carried"
          chart={<KpiBars labels={K.fy.map(y => 'FY' + String(y).slice(2))} values={K.brands} color="#ee5a24" height={240} />}
          table={<BarRows rows={K.fy.map((y, i) => ({ id: y, name: 'FY' + String(y).slice(2), color: '#ee5a24', v: K.brands[i] }))} />}
          insight={<Insight icon="🧲">Rashi added <b>33 brands in five years</b> (+73%). In distribution, a growing
            vendor roster is compounding trust — brands don't hand their India business to a shaky partner.</Insight>} />

        <Card title="Operating scale vs peers" sub="Latest disclosed · global brands carried">
          <BarRows rows={brands} fmt={num} />
          <Insight plain icon="📦">Redington operates at a different weight class (450 brands); among the focused
            India players, Rashi's roster is the deepest.</Insight>
        </Card>
      </div>

      <div className="grid g-12">
        <Card title="Channel reach vs peers" sub="Distribution partners / resellers served">
          <BarRows rows={partners} fmt={num} />
          <Insight plain icon="🤝">Reach is comparable across the India players — the differentiation is how much
            revenue each partner relationship throws off.</Insight>
        </Card>

        <Card title="Productivity — revenue per relationship" sub="₹ Cr of revenue per channel partner">
          <BarRows rows={revPerPart} fmt={v => '₹' + v.toFixed(2) + ' Cr'} />
          <Insight icon="⚡">Rashi and Redington extract <b>~₹1.5 Cr per partner</b> — roughly 5× what the smaller
            players manage. Same partner count, very different yield.</Insight>
        </Card>
      </div>
    </div>
  )
}
