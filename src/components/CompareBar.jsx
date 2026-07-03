import React from 'react'
import { COMPANIES } from '../lib/ui.js'

export default function CompareBar({ selected, setSelected }) {
  const toggle = (id) => {
    if (id === 'RPTECH') return // pinned
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...COMPANIES.map(c => c.id).filter(c => c === id || s.includes(c))])
  }
  const set = (ids) => setSelected(ids)
  const all = COMPANIES.map(c => c.id)
  const isAll = selected.length === all.length
  const isSolo = selected.length === 1

  return (
    <div className="compare">
      <span className="lbl">Compare</span>
      {COMPANIES.map(c => {
        const on = selected.includes(c.id)
        return (
          <button key={c.id}
            className={'chip ' + (on ? 'on ' : 'off ') + (c.id === 'RPTECH' ? 'pinned' : '')}
            style={on ? { '--soft': c.color + '22' } : null}
            onClick={() => toggle(c.id)}>
            <span className="dot" style={{ background: c.color }} />
            {c.name.replace(' Infocom', '').replace(' Peripherals', '').replace(' Newtech', ' Newtech')}
            {c.id === 'RPTECH' && <span className="pin">📌</span>}
          </button>
        )
      })}
      <span style={{ flex: 1 }} />
      <div className="seg">
        <button className={isSolo ? 'on' : ''} onClick={() => set(['RPTECH'])}>Rashi only</button>
        <button className={isAll ? 'on' : ''} onClick={() => set(all)}>Rashi vs all</button>
      </div>
    </div>
  )
}
