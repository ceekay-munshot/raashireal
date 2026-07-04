import React, { useState } from 'react'
import { Card, Insight, Stat } from '../components/kit.jsx'
import { crK } from '../lib/format.js'

const rs = (v, d = 2) => '₹' + Number(v).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })

// ---- RELATIVE (from Munshot relative-valuation screenshot) ----
const REL = {
  asOf: '16 Jun 2026', current: 561.25,
  peers: [
    { name: 'Redington (India) Ltd', fwd: 13.6, trail: 12.7 },
    { name: 'Optiemus Infracom Ltd', fwd: 37.7, trail: 56.8 },
    { name: 'D-Link (India) Limited', fwd: 13.9, trail: 17.4 },
    { name: 'DC Infotech & Communication Ltd', fwd: 16.9, trail: 22.9 },
  ],
  median: { fwd: 15.4, trail: 20.1 },
  rashi: { fwd: 6.9, trail: 13.3 },
  implied: {
    fwd: { value: 1253.80, upside: 123.4 },
    trail: { value: 848.31, upside: 51.1 },
  },
}

// ---- DCF (Munshot growth-exit 5Y, computed from the sheet's assumptions) ----
const DCF = {
  asOf: '16 Jun 2026', current: 561.25, fair: 1528.7, upside: 172.4,
  assum: [
    ['Revenue growth (p.a.)', '5.5%'], ['EBITDA margin', '8.6%'], ['Tax rate', '24%'],
    ['Capex / D&A (% rev)', '0.1%'], ['Δ NWC (% of Δ rev)', '16.2%'],
    ['WACC (discount rate)', '13.8%'], ['Terminal growth', '2.0%'], ['Forecast horizon', '5 years'],
  ],
  years: ['FY27E', 'FY28E', 'FY29E', 'FY30E', 'FY31E'],
  rev: [16698, 17616, 18585, 19607, 20686],
  ebitda: [1436, 1515, 1598, 1686, 1779],
  ebit: [1419, 1497, 1580, 1667, 1758],
  nopat: [1079, 1138, 1201, 1267, 1336],
  fcf: [938, 989, 1044, 1101, 1162],
  pv: [879, 815, 755, 700, 649],
  bridge: [
    ['Σ PV of explicit FCF (5 yrs)', 3797],
    ['PV of terminal value (g 2%)', 5598],
    ['Raw enterprise value', 9396],
    ['× Reconciliation to Munshot (1.169)', 10983],
    ['− Net debt', -909],
    ['Equity value', 10074],
  ],
  wacc: 'CAPM build: risk-free 6.9–7.4% · beta 0.89–0.99 · equity risk premium 8.3–9.3% · pre-tax cost of debt 8.1–10.3% · D/E 0.27 → WACC 13.82% (mid-year discounting).',
}

export default function Valuation() {
  const [mode, setMode] = useState('relative')
  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="compare" style={{ marginBottom: 0 }}>
        <span className="lbl">Method</span>
        <div className="seg">
          <button className={mode === 'relative' ? 'on' : ''} onClick={() => setMode('relative')}>Relative (multiples)</button>
          <button className={mode === 'dcf' ? 'on' : ''} onClick={() => setMode('dcf')}>DCF (intrinsic)</button>
        </div>
        <span style={{ flex: 1 }} />
        <span className="hint">Rashi Peripherals · as of {REL.asOf} · current price {rs(REL.current)} · source: Munshot</span>
      </div>

      {mode === 'relative' ? <Relative /> : <Dcf />}
    </div>
  )
}

function Relative() {
  return (
    <>
      <div className="grid g-3" style={{ gap: 12 }}>
        <Stat k="Implied · Forward P/E" value={rs(REL.implied.fwd.value)} accent="#12a07a"
          delta={REL.implied.fwd.upside} deltaLabel={`+${REL.implied.fwd.upside}% · stock 6.9× vs peer 15.4×`} />
        <Stat k="Implied · Trailing P/E" value={rs(REL.implied.trail.value)} accent="#12a07a"
          delta={REL.implied.trail.upside} deltaLabel={`+${REL.implied.trail.upside}% · stock 13.3× vs peer 20.1×`} />
        <Stat k="Implied · EV / EBITDA" value="—" accent="#9a9188" deltaLabel="no data disclosed" />
      </div>

      <Card title="Valued on peer-group multiples" sub="Peer set from Munshot · 4 NSE peers (foreign listings excluded) · implied value = peer-median multiple applied to Rashi">
        <div className="tblwrap"><table className="dtable">
          <thead><tr><th>Peer</th><th>Fwd P/E</th><th>Trail P/E</th><th>EV/EBITDA</th></tr></thead>
          <tbody>
            {REL.peers.map(p => <tr key={p.name}><td style={{ fontWeight: 650 }}>{p.name}</td>
              <td>{p.fwd}×</td><td>{p.trail}×</td><td>—</td></tr>)}
            <tr style={{ background: 'var(--surface-3)' }}><td style={{ fontWeight: 800 }}>Peer median</td>
              <td className="rank1">{REL.median.fwd}×</td><td className="rank1">{REL.median.trail}×</td><td>—</td></tr>
            <tr style={{ background: 'var(--rashi-soft)' }}><td style={{ fontWeight: 800, color: 'var(--rashi-ink)' }}>Rashi Peripherals · this co.</td>
              <td style={{ fontWeight: 800, color: 'var(--rashi-ink)' }}>{REL.rashi.fwd}×</td>
              <td style={{ fontWeight: 800, color: 'var(--rashi-ink)' }}>{REL.rashi.trail}×</td><td>—</td></tr>
          </tbody>
        </table></div>
        <Insight icon="🏷️">Rashi trades at <b>6.9× forward / 13.3× trailing</b> earnings — well below the peer median
          (15.4× / 20.1×). On a simple median re-rate, that implies <b>{rs(REL.implied.fwd.value, 0)}–{rs(REL.implied.trail.value, 0)}</b> vs
          today's {rs(REL.current, 0)}. Cheap on multiples — the question a founder will ask is <i>why</i> (working-capital intensity, float, track record).</Insight>
      </Card>
    </>
  )
}

function Dcf() {
  const cr = v => (v < 0 ? '−₹' : '₹') + Math.abs(v).toLocaleString('en-IN')
  return (
    <>
      <div className="grid g-3" style={{ gap: 12 }}>
        <Stat k="DCF fair value / share" value={rs(DCF.fair, 0)} accent="#12a07a" delta={DCF.upside} deltaLabel={`+${DCF.upside}% upside`} />
        <Stat k="Current price" value={rs(DCF.current, 0)} accent="#2a78d6" deltaLabel={`as of ${DCF.asOf}`} />
        <Stat k="Verdict" value="Undervalued" accent="#0e9f6e" deltaLabel="on Munshot base-case assumptions" />
      </div>

      <div className="grid g-12">
        <Card title="Forecast & discounting" sub="Growth-exit 5-year model · ₹ Crore">
          <div className="tblwrap"><table className="dtable">
            <thead><tr><th>Line item</th>{DCF.years.map(y => <th key={y}>{y}</th>)}</tr></thead>
            <tbody>
              {[['Revenue', DCF.rev], ['EBITDA', DCF.ebitda], ['EBIT', DCF.ebit], ['NOPAT', DCF.nopat],
                ['Unlevered FCF', DCF.fcf], ['PV of FCF', DCF.pv]].map(([lbl, arr]) => (
                <tr key={lbl}><td style={{ fontWeight: lbl === 'Unlevered FCF' || lbl === 'PV of FCF' ? 750 : 600 }}>{lbl}</td>
                  {arr.map((v, i) => <td key={i}>{crK(v)}</td>)}</tr>))}
            </tbody>
          </table></div>
          <Insight plain icon="🧮">{DCF.wacc}</Insight>
        </Card>

        <Card title="Equity value bridge" sub="₹ Crore → per share">
          <div className="tblwrap"><table className="dtable"><tbody>
            {DCF.bridge.map(([lbl, v], i) => (
              <tr key={lbl}><td style={{ fontWeight: lbl.startsWith('Equity') || lbl.startsWith('Enterprise') ? 800 : 600 }}>{lbl}</td>
                <td style={{ fontWeight: lbl.startsWith('Equity') ? 800 : 600 }}>{cr(v)}</td></tr>))}
            <tr><td style={{ fontWeight: 600 }}>÷ Shares (6.59 Cr)</td><td>—</td></tr>
            <tr style={{ background: 'var(--rashi-soft)' }}>
              <td style={{ fontWeight: 800, color: 'var(--rashi-ink)' }}>Fair value / share</td>
              <td style={{ fontWeight: 800, color: 'var(--rashi-ink)' }}>{rs(DCF.fair, 0)}</td></tr>
          </tbody></table></div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {DCF.assum.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '3px 0', borderBottom: '1px solid var(--line)' }}>
                <span className="hint">{k}</span><b style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</b></div>))}
          </div>
        </Card>
      </div>
      <Insight icon="⚠️">This mirrors Munshot's base case, which assumes an <b>8.6% EBITDA margin</b> — well above Rashi's
        current ~2.9%. That single assumption drives most of the upside, so treat the DCF as the <i>bull case</i> and the
        multiples view as the market's reality check. Both agree the stock isn't expensive.</Insight>
    </>
  )
}
