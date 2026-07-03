import React from 'react'
import { Card, Insight } from '../components/kit.jsx'
import ChartCard from '../components/ChartCard.jsx'
import { KpiLine } from '../components/charts.jsx'
import { DATA, shortName, colorOf } from '../lib/ui.js'
import { pct, crK } from '../lib/format.js'

// editorial positioning matrix (from public disclosures / portfolios)
const PLAYERS = ['RPTECH', 'REDINGTON', 'CREATIVE']
const SEG = [
  { s: 'PC & Laptops', v: { RPTECH: 3, REDINGTON: 3, CREATIVE: 1 } },
  { s: 'Components · DIY · Gaming', v: { RPTECH: 3, REDINGTON: 2, CREATIVE: 2 } },
  { s: 'Storage & Memory', v: { RPTECH: 3, REDINGTON: 3, CREATIVE: 2 } },
  { s: 'Enterprise & Servers', v: { RPTECH: 2, REDINGTON: 3, CREATIVE: 1 } },
  { s: 'Networking', v: { RPTECH: 2, REDINGTON: 3, CREATIVE: 1 } },
  { s: 'Software & Cloud', v: { RPTECH: 1, REDINGTON: 3, CREATIVE: 1 } },
  { s: 'Lifestyle · Wearables', v: { RPTECH: 2, REDINGTON: 1, CREATIVE: 3 } },
  { s: 'AI / Data-center HW', v: { RPTECH: 2, REDINGTON: 2, CREATIVE: 0 } },
]
const LV = { 3: { t: 'Strong', bg: '#cdeadd', c: '#0a7d55' }, 2: { t: 'Moderate', bg: '#fbeacb', c: '#9a6b12' },
  1: { t: 'Light', bg: '#f1ece3', c: '#948a7d' }, 0: { t: 'Absent', bg: 'transparent', c: '#c3bcb2' } }

export default function Whitespace({ selected, openModal }) {
  const redFy = DATA.kpi.REDINGTON.fy.map(y => 'FY' + String(y).slice(2))
  const creFy = DATA.kpi.CREATIVE.fy.map(y => 'FY' + String(y).slice(2))
  return (
    <div className="grid" style={{ gap: 14 }}>
      <Card title="Product whitespace — who owns what, and what's open"
        sub="Green = strong position, amber = moderate, faded = light, blank = absent. The gaps are the opportunity.">
        <div className="tblwrap">
          <table className="dtable">
            <thead><tr><th>Segment</th>
              {PLAYERS.map(id => <th key={id} style={{ textAlign: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 9, background: colorOf(id) }} />{shortName(id)}</span></th>)}
              <th style={{ textAlign: 'left' }}>Read</th></tr></thead>
            <tbody>
              {SEG.map(row => {
                const rashi = row.v.RPTECH
                const read = rashi === 3 ? 'Rashi stronghold' : rashi <= 1 && row.v.REDINGTON === 3 ? '⬅ Redington whitespace' :
                  row.s.startsWith('AI') ? '🟡 open field' : rashi === 2 ? 'contested' : '—'
                return (
                  <tr key={row.s}>
                    <td style={{ fontWeight: 700 }}>{row.s}</td>
                    {PLAYERS.map(id => { const lv = LV[row.v[id]]; return (
                      <td key={id} style={{ textAlign: 'center', background: lv.bg }}>
                        <span style={{ color: lv.c, fontWeight: 700, fontSize: 11.5 }}>{lv.t}</span></td>) })}
                    <td style={{ textAlign: 'left', color: 'var(--ink-2)', fontWeight: 600, fontSize: 11.5 }}>{read}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Insight icon="🧭">Rashi owns <b>components, gaming and storage</b>. The clearest whitespace: <b>Software &amp;
          Cloud</b> and <b>enterprise services</b>, where Redington runs away with it — and <b>AI / data-center hardware</b>,
          an open field Rashi is positioned for with NVIDIA &amp; AMD already in the bag.</Insight>
      </Card>

      <div className="grid g-3">
        <ChartCard title="Redington climbs into software" sub="Software Solutions Group · % of revenue"
          chart={<KpiLine labels={redFy} series={[{ name: 'Software %', color: '#2a78d6', values: DATA.kpi.REDINGTON.softwareShare }]} height={200} fmt={v => v + '%'} showLegend={false} />}
          table={<div className="hint" style={{ padding: 8 }}>{redFy.map((f, i) => <div key={f}>{f}: {DATA.kpi.REDINGTON.softwareShare[i]}%</div>)}</div>}
          insight={<Insight plain icon="☁️">Redington is deliberately shifting mix toward higher-margin software &amp; cloud.</Insight>} />

        <ChartCard title="Creative's brand-incubation engine" sub="Brand-business revenue · ₹ Cr"
          chart={<KpiLine labels={creFy} series={[{ name: 'Brand biz ₹Cr', color: '#12a07a', values: DATA.kpi.CREATIVE.brandBizRev }]} height={200} fmt={crK} showLegend={false} />}
          table={<div className="hint" style={{ padding: 8 }}>{creFy.map((f, i) => <div key={f}>{f}: {DATA.kpi.CREATIVE.brandBizRev[i] ?? '—'}</div>)}</div>}
          insight={<Insight plain icon="🌱">Creative moved up the chain into owning brands — that's why its net margin leads.</Insight>} />

        <Card title="Rashi's own mix — to add" sub="From investor PPT / concall">
          <div style={{ padding: '18px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 30 }}>📥</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>Segment split: PES vs LIT</div>
            <div className="hint" style={{ marginTop: 4, lineHeight: 1.5 }}>Drop Rashi's Personal-Computing/Enterprise vs
              Components/Lifestyle revenue split from the investor deck and this card fills in automatically.</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
