import React from 'react'
import { Card, Insight, Stat } from '../components/kit.jsx'
import ChartCard from '../components/ChartCard.jsx'
import { StackBars, KpiLine } from '../components/charts.jsx'
import { DATA, shortName, colorOf } from '../lib/ui.js'
import { pct } from '../lib/format.js'

const SH = DATA.shareholding, Q = DATA.shareQuarters
const lastVal = arr => { for (let i = arr.length - 1; i >= 0; i--) if (arr[i] != null) return arr[i]; return null }
const inst = id => (SH[id].fii.map((f, i) => (f == null && SH[id].dii[i] == null) ? null : (f || 0) + (SH[id].dii[i] || 0)))

const CAT = [
  { k: 'promoter', label: 'Promoter', color: '#334063' },
  { k: 'dii', label: 'DII (domestic funds)', color: '#12a07a' },
  { k: 'fii', label: 'FII (foreign funds)', color: '#2a78d6' },
  { k: 'public', label: 'Public', color: '#cbc3b4' },
]

export default function Ownership({ selected, openModal }) {
  const comp = selected.map(id => {
    const s = SH[id]
    return { x: shortName(id), promoter: lastVal(s.promoter), dii: lastVal(s.dii), fii: lastVal(s.fii), public: lastVal(s.public) }
  })
  const promSeries = selected.map(id => ({ name: shortName(id), color: colorOf(id), values: SH[id].promoter, width: id === 'RPTECH' ? 3.2 : 2.2 }))
  const instSeries = selected.map(id => ({ name: shortName(id), color: colorOf(id), values: inst(id), width: id === 'RPTECH' ? 3.2 : 2.2 }))

  const rPromFirst = SH.RPTECH.promoter.find(v => v != null)
  const rPromLast = lastVal(SH.RPTECH.promoter)
  const rInst = lastVal(inst('RPTECH'))

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid g-4" style={{ gap: 12 }}>
        <Stat k="🧑‍💼 Rashi promoter" value={pct(rPromLast)} accent="#ee5a24" delta={1} deltaLabel={`up from ${pct(rPromFirst)}`} spark={SH.RPTECH.promoter.filter(v => v != null)} sparkColor="#ee5a24" />
        <Stat k="🏦 Rashi institutions" value={pct(rInst)} accent="#12a07a" delta={1} deltaLabel="DIIs accumulating" spark={inst('RPTECH').filter(v => v != null)} sparkColor="#12a07a" />
        <Stat k="🌐 Redington promoter" value="0%" accent="#2a78d6" delta={null} deltaLabel="promoter-less" />
        <Stat k="🌐 Redington institutions" value={pct(lastVal(inst('REDINGTON')))} accent="#2a78d6" delta={1} deltaLabel="~78% FII+DII owned" spark={inst('REDINGTON')} sparkColor="#2a78d6" />
      </div>

      <div className="grid g-12">
        <ChartCard title="Who owns each company today" sub="Latest quarter · % of shares · promoter / institutions / public"
          chart={<StackBars data={comp} keys={CAT} height={250} fmt={v => Math.round(v) + '%'} />}
          table={<OwnTable comp={comp} />}
          insight={<Insight icon="🔑">Two very different models: <b>Rashi &amp; Creative are founder-led</b> (high promoter);
            <b> Redington is promoter-less</b> — ~78% owned by institutions. Rashi combines founder skin-in-the-game with rising institutional interest.</Insight>} />

        <ChartCard title="Promoter holding — conviction signal" sub="% held by promoters, quarter by quarter"
          chart={<KpiLine labels={Q} series={promSeries} height={250} fmt={v => v + '%'} />}
          table={<TrendTbl series={promSeries} />}
          insight={<Insight icon="📈">Rashi's promoters have <b>raised</b> their stake ({pct(rPromFirst)} → {pct(rPromLast)}) —
            owners buying more is the strongest insider vote of confidence. Redington's line sits at zero: no promoter at all.</Insight>} />
      </div>

      <ChartCard title="Smart money — institutional ownership trend" sub="FII + DII combined, quarter by quarter"
        chart={<KpiLine labels={Q} series={instSeries} height={230} fmt={v => v + '%'} />}
        table={<TrendTbl series={instSeries} />}
        insight={<Insight icon="🧠">Domestic funds (DIIs) have been <b>steadily accumulating Rashi</b> since listing — a young
          stock the street is warming to. Redington is already a heavily institution-owned name; Creative and Compuage barely register on the fund radar.</Insight>} />
    </div>
  )
}

function OwnTable({ comp }) {
  return <div className="tblwrap"><table className="dtable">
    <thead><tr><th>Company</th><th>Promoter</th><th>DII</th><th>FII</th><th>Public</th></tr></thead>
    <tbody>{comp.map(c => <tr key={c.x}>
      <td style={{ fontWeight: 700 }}>{c.x}</td>
      <td>{c.promoter ? pct(c.promoter) : '—'}</td><td>{pct(c.dii)}</td><td>{pct(c.fii)}</td><td>{pct(c.public)}</td>
    </tr>)}</tbody></table></div>
}
function TrendTbl({ series }) {
  return <div className="tblwrap"><table className="dtable">
    <thead><tr><th>Company</th>{DATA.shareQuarters.filter((_, i) => i % 2 === 1).map(q => <th key={q}>{q}</th>)}</tr></thead>
    <tbody>{series.map(s => <tr key={s.name}>
      <td><span className="co"><span className="dot" style={{ background: s.color }} />{s.name}</span></td>
      {s.values.filter((_, i) => i % 2 === 1).map((v, i) => <td key={i}>{v == null ? '—' : pct(v)}</td>)}
    </tr>)}</tbody></table></div>
}
