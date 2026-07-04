import React from 'react'
import { Card, Insight } from '../components/kit.jsx'
import ChartCard from '../components/ChartCard.jsx'
import { StackBars, KpiLine } from '../components/charts.jsx'
import { BarRows } from '../components/DataTable.jsx'
import { DATA, shortName, colorOf } from '../lib/ui.js'
import { crK, crAxis, pct } from '../lib/format.js'

const SEG = DATA.segments
const fyl = y => 'FY' + String(y).slice(2)

// editorial positioning matrix (from public disclosures / portfolios)
const PLAYERS = ['RPTECH', 'REDINGTON', 'CREATIVE']
const ROWS = [
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

export default function Whitespace({ selected }) {
  // Rashi PES/LIT segment
  const rs = SEG.RPTECH
  const rSegData = rs.years.map((y, i) => ({ x: fyl(y), PES: rs.PES[i], LIT: rs.LIT[i] }))
  const rMix = [
    { name: 'PES %', color: '#ee5a24', values: rs.years.map((_, i) => +(rs.PES[i] / (rs.PES[i] + rs.LIT[i]) * 100).toFixed(1)) },
    { name: 'LIT %', color: '#12a07a', values: rs.years.map((_, i) => +(rs.LIT[i] / (rs.PES[i] + rs.LIT[i]) * 100).toFixed(1)) },
  ]
  const cs = SEG.CREATIVE
  const cSegData = cs.years.map((y, i) => ({ x: fyl(y), Brand: cs.Brand[i], MarketEntry: cs.MarketEntry[i] }))
  const redSSG = [
    { id: 'sw', name: 'Software', color: '#2a78d6', v: 40 },
    { id: 'cl', name: 'Cloud', color: '#12a07a', v: 33 },
    { id: 'se', name: 'Security', color: '#7c4fc4', v: 27 },
  ]

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid g-12">
        <ChartCard title="Rashi's business mix — PES vs LIT" sub="Revenue by vertical · ₹ Cr · PES = Personal Computing & Enterprise, LIT = Lifestyle & IT Essentials"
          chart={<StackBars data={rSegData} height={250} fmt={crK} yFmt={crAxis}
            keys={[{ k: 'PES', label: 'Personal Computing & Enterprise', color: '#ee5a24' }, { k: 'LIT', label: 'Lifestyle & IT Essentials', color: '#12a07a' }]} />}
          table={<div className="tblwrap"><table className="dtable"><thead><tr><th>Vertical</th>{rs.years.map(y => <th key={y}>{fyl(y)}</th>)}</tr></thead>
            <tbody><tr><td>PES</td>{rs.PES.map((v, i) => <td key={i}>{crK(v)}</td>)}</tr><tr><td>LIT</td>{rs.LIT.map((v, i) => <td key={i}>{crK(v)}</td>)}</tr></tbody></table></div>}
          insight={<Insight icon="🧩">Rashi is <b>~58% PES</b> (computing & enterprise) and <b>~42% LIT</b> (components,
            gaming, lifestyle). PES has grown faster lately — the enterprise/computing tilt is where the scale is coming from.</Insight>} />

        <ChartCard title="Rashi mix shift over time" sub="Share of revenue · %"
          chart={<KpiLine labels={rs.years.map(fyl)} series={rMix} height={250} fmt={v => v + '%'} />}
          table={<div className="tblwrap"><table className="dtable"><thead><tr><th>Vertical</th>{rs.years.map(y => <th key={y}>{fyl(y)}</th>)}</tr></thead>
            <tbody>{rMix.map(s => <tr key={s.name}><td><span className="co"><span className="dot" style={{ background: s.color }} />{s.name}</span></td>{s.values.map((v, i) => <td key={i}>{v}%</td>)}</tr>)}</tbody></table></div>}
          insight={<Insight plain icon="🔀">The mix swings with the demand cycle — PES jumped to 61% in FY25, LIT (components/gaming)
            rebounded in FY26. A diversified two-engine model rather than a single-category bet.</Insight>} />
      </div>

      <div className="grid g-3">
        <Card title="Creative's mix — the margin secret" sub="₹ Cr · brand vs distribution">
          <StackBars data={cSegData} height={190} fmt={crK} yFmt={crAxis} showLegend={true}
            keys={[{ k: 'Brand', label: 'Brand business', color: '#12a07a' }, { k: 'MarketEntry', label: 'Market-entry (distribution)', color: '#cbc3b4' }]} />
          <Insight plain icon="🌱">Creative's small <b>owned/licensed brand</b> arm is why its net margin leads — it climbed the value chain.</Insight>
        </Card>

        <Card title="Redington climbs into software" sub="SSG mix · FY26 · % of software business">
          <BarRows rows={redSSG} fmt={v => v + '%'} />
          <Insight plain icon="☁️">Redington's Software-Cloud-Security arm is now <b>17% of the group</b>, <b>74% recurring</b>,
            growing ~29%/yr toward a $5B target — the enterprise/cloud lane Rashi is light in.</Insight>
        </Card>

        <Card title="Geographic exposure" sub="Focus vs diversification">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 2 }}>
            {[['🇮🇳', 'Rashi', '100% India — pan-India, targeting 800+ districts', '#ee5a24'],
              ['🇮🇳', 'Creative', 'India-first (+ Honeywell licence across 29 countries)', '#12a07a'],
              ['🌍', 'Redington', 'Global — #8 worldwide ($13.4B), #1 India & #1 MEA, 40+ markets', '#2a78d6'],
              ['🇮🇳', 'Compuage', 'India + 7 SAARC nations', '#7c4fc4']].map(r => (
              <div key={r[1]} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 17 }}>{r[0]}</span>
                <div><div style={{ fontWeight: 750, fontSize: 12.5, color: r[3] }}>{r[1]}</div>
                  <div className="hint" style={{ lineHeight: 1.35 }}>{r[2]}</div></div>
              </div>))}
          </div>
          <Insight plain icon="🧭">Rashi is a <b>focused single-market bet</b>; Redington carries global scale but also currency/geo risk. Different risk shapes, not better/worse.</Insight>
        </Card>
      </div>

      <Card title="Product whitespace — who owns what, and what's open"
        sub="Green = strong, amber = moderate, faded = light, blank = absent. The gaps are the opportunity.">
        <div className="tblwrap">
          <table className="dtable">
            <thead><tr><th>Segment</th>
              {PLAYERS.map(id => <th key={id} style={{ textAlign: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 9, background: colorOf(id) }} />{shortName(id)}</span></th>)}
              <th style={{ textAlign: 'left' }}>Read</th></tr></thead>
            <tbody>
              {ROWS.map(row => {
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
                  </tr>)
              })}
            </tbody>
          </table>
        </div>
        <Insight icon="🧭">Rashi owns <b>components, gaming and storage</b>. The clearest whitespace: <b>Software &amp; Cloud</b>
          and <b>enterprise services</b>, where Redington runs away with it — and <b>AI / data-center hardware</b>, an open field
          Rashi is positioned for with NVIDIA &amp; AMD already in the bag.</Insight>
      </Card>
    </div>
  )
}
