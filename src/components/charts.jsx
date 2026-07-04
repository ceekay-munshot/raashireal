import React from 'react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, LabelList, ReferenceLine
} from 'recharts'
import { mergeAnnual, mergeQuarters, colorOf, shortName, latest } from '../lib/ui.js'
import { makeTooltip, Legend } from './kit.jsx'
import { fy } from '../lib/format.js'

const AX = { tick: { fontSize: 11, fill: '#9a9188' }, axisLine: false, tickLine: false }
const GRID = { strokeDasharray: '0', stroke: '#ece4d8', vertical: false }

/* multi-company line trend (annual or quarterly) */
export function TrendChart({ ids, metric, kind = 'annual', yearMin, height = 240, fmt = v => v, yFmt, domain, showLegend = true, onDot }) {
  const data = kind === 'quarter' ? mergeQuarters(ids, metric) : mergeAnnual(ids, metric, yearMin)
  const xKey = kind === 'quarter' ? 'q' : 'fy'
  const Tip = makeTooltip(fmt)
  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey={xKey} {...AX} />
          <YAxis {...AX} width={46} tickFormatter={yFmt || fmt} domain={domain} />
          <Tooltip content={<Tip />} cursor={{ stroke: '#d9cfbf', strokeWidth: 1 }} />
          {ids.map(id => (
            <Line key={id} type="monotone" dataKey={id} name={shortName(id)} stroke={colorOf(id)}
              strokeWidth={id === 'RPTECH' ? 3.2 : 2.2} dot={{ r: 2.5, fill: colorOf(id), strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} connectNulls strokeOpacity={id === 'COMPUAGE' ? .8 : 1} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {showLegend && <Legend items={ids.map(id => ({ label: shortName(id), color: colorOf(id) }))} />}
    </>
  )
}

/* one metric, latest value, ranked horizontal bars — one bar per company */
export function BarsByCompany({ ids, metric, height = 190, fmt = v => v, sortDir = 'desc', valueLabel = true }) {
  let data = ids.map(id => ({ id, name: shortName(id), v: latest(id)?.[metric] })).filter(d => d.v != null)
  data.sort((a, b) => sortDir === 'desc' ? b.v - a.v : a.v - b.v)
  const Tip = makeTooltip(fmt)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 46, left: 4, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" {...AX} width={78} />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgba(0,0,0,.03)' }} />
        <Bar dataKey="v" radius={[0, 7, 7, 0]} barSize={22} isAnimationActive={true}>
          {data.map(d => <Cell key={d.id} fill={colorOf(d.id)} />)}
          {valueLabel && <LabelList dataKey="v" position="right" formatter={fmt}
            style={{ fontSize: 12, fontWeight: 800, fill: '#201c18' }} />}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* grouped bars: columns = FY, groups = companies (for one metric) */
export function GroupedYearBars({ ids, metric, yearMin, height = 240, fmt = v => v, yFmt, showLegend = true }) {
  const data = mergeAnnual(ids, metric, yearMin)
  const Tip = makeTooltip(fmt)
  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 10, left: -8, bottom: 0 }} barGap={2} barCategoryGap="22%">
          <CartesianGrid {...GRID} />
          <XAxis dataKey="fy" {...AX} />
          <YAxis {...AX} width={46} tickFormatter={yFmt || fmt} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(0,0,0,.03)' }} />
          {ids.map(id => (
            <Bar key={id} dataKey={id} name={shortName(id)} fill={colorOf(id)} radius={[4, 4, 0, 0]} maxBarSize={26} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {showLegend && <Legend items={ids.map(id => ({ label: shortName(id), color: colorOf(id) }))} />}
    </>
  )
}

/* single-company columns with value labels (e.g. Rashi revenue over years) */
export function SingleBars({ id, metric, yearMin, height = 240, fmt = v => v, yFmt, labelFmt, color, labels = true }) {
  const data = mergeAnnual([id], metric, yearMin).map(d => ({ fy: d.fy, v: d[id] }))
  const c = color || colorOf(id)
  const Tip = makeTooltip(fmt)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 26, right: 8, left: -6, bottom: 0 }}>
        <CartesianGrid {...GRID} />
        <XAxis dataKey="fy" {...AX} />
        <YAxis {...AX} width={46} tickFormatter={yFmt || fmt} />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgba(0,0,0,.03)' }} />
        <Bar dataKey="v" fill={c} radius={[6, 6, 0, 0]} maxBarSize={44}>
          {labels && <LabelList dataKey="v" position="top" formatter={labelFmt || fmt}
            style={{ fontSize: 10.5, fontWeight: 800, fill: '#201c18' }} />}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* generic stacked bars. data:[{x, ...}]  keys:[{k,label,color}] */
export function StackBars({ data, keys, height = 240, fmt = v => v, yFmt, showLegend = true, layout = 'vertical' }) {
  const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const total = payload.reduce((s, p) => s + (p.value || 0), 0)
    return <div className="rc-tip"><div className="rt-h">{label}</div>
      {payload.filter(p => p.value != null && p.value !== 0).map(p => (
        <div className="rt-r" key={p.dataKey}><span className="dot" style={{ background: p.fill }} />
          {keys.find(k => k.k === p.dataKey)?.label || p.dataKey}<b>{fmt(p.value)}</b></div>))}
      <div className="rt-r" style={{ marginTop: 3, borderTop: '1px solid #eee', paddingTop: 3 }}>Total<b>{fmt(total)}</b></div>
    </div>
  }
  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 10, left: -8, bottom: 0 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey="x" {...AX} />
          <YAxis {...AX} width={46} tickFormatter={yFmt || fmt} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(0,0,0,.03)' }} />
          {keys.map((k, i) => (
            <Bar key={k.k} dataKey={k.k} name={k.label} stackId="a" fill={k.color} maxBarSize={64}
              radius={i === keys.length - 1 ? [5, 5, 0, 0] : [0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {showLegend && <Legend items={keys.map(k => ({ label: k.label, color: k.color }))} />}
    </>
  )
}

/* arbitrary-array line (for operational KPIs not in the financial dataset) */
export function KpiLine({ labels, series, height = 220, fmt = v => v, showLegend = true }) {
  // series: [{name,color,values:[]}]
  const data = labels.map((l, i) => { const o = { x: l }; series.forEach(s => o[s.name] = s.values[i]); return o })
  const Tip = makeTooltip(fmt)
  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 14, left: -8, bottom: 0 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey="x" {...AX} />
          <YAxis {...AX} width={44} tickFormatter={fmt} />
          <Tooltip content={<Tip />} cursor={{ stroke: '#d9cfbf' }} />
          {series.map(s => (
            <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color}
              strokeWidth={s.width || 2.6} dot={{ r: 2.5, fill: s.color }} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} connectNulls />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {showLegend && series.length > 1 && <Legend items={series.map(s => ({ label: s.name, color: s.color }))} />}
    </>
  )
}

/* arbitrary-array single-series columns */
export function KpiBars({ labels, values, color = '#ee5a24', height = 220, fmt = v => v, labelsOn = true }) {
  const data = labels.map((l, i) => ({ x: l, v: values[i] }))
  const Tip = makeTooltip(fmt)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 18, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid {...GRID} />
        <XAxis dataKey="x" {...AX} />
        <YAxis {...AX} width={44} tickFormatter={fmt} />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgba(0,0,0,.03)' }} />
        <Bar dataKey="v" fill={color} radius={[6, 6, 0, 0]} maxBarSize={46}>
          {labelsOn && <LabelList dataKey="v" position="top" formatter={fmt} style={{ fontSize: 11, fontWeight: 800, fill: '#201c18' }} />}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* stacked CCC decomposition for one company across years:
   inventory + debtor (up) ; payable (down) ; net line = CCC */
export function CCCStack({ id, yearMin = 2021, height = 250 }) {
  const rows = mergeAnnual([id], 'inventoryDays', yearMin)
  const data = rows.map(r => {
    const y = r.y
    const rd = mergeAnnual([id], 'debtorDays', yearMin).find(x => x.y === y)[id]
    const pd = mergeAnnual([id], 'payableDays', yearMin).find(x => x.y === y)[id]
    const inv = r[id]
    return { fy: r.fy, inv, deb: rd, pay: -pd, ccc: Math.round(inv + rd - pd) }
  })
  const Tip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return <div className="rc-tip"><div className="rt-h">{d.fy}</div>
      <div className="rt-r"><span className="dot" style={{ background: '#2a78d6' }} />Inventory<b>{Math.round(d.inv)}d</b></div>
      <div className="rt-r"><span className="dot" style={{ background: '#12a07a' }} />Receivables<b>{Math.round(d.deb)}d</b></div>
      <div className="rt-r"><span className="dot" style={{ background: '#e0a04b' }} />Payables<b>{Math.round(d.pay)}d</b></div>
      <div className="rt-r" style={{ marginTop: 4, borderTop: '1px solid #eee', paddingTop: 4 }}>Cash cycle<b>{d.ccc}d</b></div>
    </div>
  }
  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} stackOffset="sign" margin={{ top: 8, right: 10, left: -8, bottom: 0 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey="fy" {...AX} />
          <YAxis {...AX} width={40} tickFormatter={v => v + 'd'} />
          <ReferenceLine y={0} stroke="#c3b9a8" />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(0,0,0,.03)' }} />
          <Bar dataKey="inv" name="Inventory" stackId="a" fill="#2a78d6" radius={[3, 3, 0, 0]} maxBarSize={40} />
          <Bar dataKey="deb" name="Receivables" stackId="a" fill="#12a07a" maxBarSize={40} />
          <Bar dataKey="pay" name="Payables" stackId="a" fill="#e0a04b" radius={[0, 0, 3, 3]} maxBarSize={40} />
          <Line dataKey="ccc" />
        </BarChart>
      </ResponsiveContainer>
      <Legend items={[{ label: 'Inventory days', color: '#2a78d6' }, { label: 'Receivable days', color: '#12a07a' }, { label: 'Payable days (−)', color: '#e0a04b' }]} />
    </>
  )
}
