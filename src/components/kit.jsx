import React from 'react'

/* ---- inline sparkline ---- */
export function Sparkline({ values, color = '#ee5a24', w = 62, h = 20, fill = true }) {
  const v = values.filter(x => x != null)
  if (v.length < 2) return null
  const min = Math.min(...v), max = Math.max(...v), rng = max - min || 1
  const step = w / (v.length - 1)
  const pts = v.map((val, i) => [i * step, h - ((val - min) / rng) * (h - 3) - 1.5])
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = d + ` L ${w} ${h} L 0 ${h} Z`
  const id = 'sg' + color.replace('#', '')
  return (
    <svg width={w} height={h} className="spark">
      {fill && <><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity=".22" /><stop offset="1" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <path d={area} fill={`url(#${id})`} /></>}
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2.3" fill={color} />
    </svg>
  )
}

/* ---- stat tile ---- */
export function Stat({ k, icon, value, unit, delta, deltaLabel, spark, sparkColor, onClick, accent }) {
  const up = delta != null && delta >= 0
  return (
    <div className="stat click" onClick={onClick} style={accent ? { borderTopColor: accent, borderTop: `3px solid ${accent}` } : null}>
      <div className="k">{icon && <span>{icon}</span>}{k}</div>
      <div className="v tnum">{value}{unit && <small>{unit}</small>}</div>
      {delta != null && <div className={'d ' + (up ? 'up' : 'down')}>{up ? '▲' : '▼'} {deltaLabel}</div>}
      {spark && <Sparkline values={spark} color={sparkColor || accent || '#ee5a24'} />}
    </div>
  )
}

/* ---- card ---- */
export function Card({ title, sub, tools, children, className = '', span }) {
  return (
    <div className={'card ' + (span ? 'span2 ' : '') + className}>
      {(title || tools) && (
        <div className="card-h">
          <div>{title && <h3 className="card-t">{title}</h3>}{sub && <div className="card-s">{sub}</div>}</div>
          {tools && <div className="card-tools">{tools}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

/* ---- insight chip ---- */
export function Insight({ children, icon = '💡', plain }) {
  return (
    <div className={'insight' + (plain ? ' plain' : '')}>
      <span className="ic">{icon}</span>
      <span className="tx">{children}</span>
    </div>
  )
}

/* ---- chart / table toggle ---- */
export function ViewToggle({ view, setView }) {
  return (
    <div className="seg" role="tablist">
      <button className={view === 'chart' ? 'on' : ''} onClick={() => setView('chart')} title="Chart">▚ Chart</button>
      <button className={view === 'table' ? 'on' : ''} onClick={() => setView('table')} title="Table">▦ Table</button>
    </div>
  )
}

/* ---- legend ---- */
export function Legend({ items }) {
  return (
    <div className="legend">
      {items.map(it => <span className="li" key={it.label}>
        <span className="dot" style={{ background: it.color }} />{it.label}</span>)}
    </div>
  )
}

/* ---- center modal ---- */
export function Modal({ open, onClose, title, sub, children }) {
  React.useEffect(() => {
    if (!open) return
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-h">
          <div><h3>{title}</h3>{sub && <div className="ms">{sub}</div>}</div>
          <button className="x-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ---- recharts custom tooltip ---- */
export function makeTooltip(fmt, labelFmt) {
  return function Tip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
      <div className="rc-tip">
        <div className="rt-h">{labelFmt ? labelFmt(label) : label}</div>
        {payload.filter(p => p.value != null).map(p => (
          <div className="rt-r" key={p.dataKey}>
            <span className="dot" style={{ background: p.color || p.stroke || p.fill }} />
            {p.name}<b>{fmt(p.value)}</b>
          </div>
        ))}
      </div>
    )
  }
}
