import React, { useState } from 'react'
import CompareBar from './components/CompareBar.jsx'
import { Modal } from './components/kit.jsx'
import { COMPANIES } from './lib/ui.js'
import Overview from './tabs/Overview.jsx'
import Growth from './tabs/Growth.jsx'
import Capital from './tabs/Capital.jsx'
import Scorecard from './tabs/Scorecard.jsx'
import Operations from './tabs/Operations.jsx'
import Whitespace from './tabs/Whitespace.jsx'

const TABS = [
  { id: 'overview', label: 'Overview', icon: '🏠', C: Overview },
  { id: 'growth', label: 'Growth & Margins', icon: '📊', C: Growth },
  { id: 'capital', label: 'Capital Engine', icon: '💰', C: Capital },
  { id: 'score', label: 'Peer Scorecard', icon: '🏆', C: Scorecard },
  { id: 'ops', label: 'Operations & Scale', icon: '🏭', C: Operations },
  { id: 'white', label: 'Product & Whitespace', icon: '🧭', C: Whitespace },
]

export default function App() {
  const [tab, setTab] = useState('overview')
  const [selected, setSelected] = useState(COMPANIES.map(c => c.id))
  const [modal, setModal] = useState(null)
  const openModal = (m) => setModal(m)
  const Active = TABS.find(t => t.id === tab).C

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">RP</div>
          <div>
            <h1>Rashi Peripherals · Peer Intelligence</h1>
            <div className="sub">India's ICT distribution — a visual, comparable, buy-side view</div>
          </div>
        </div>
        <div className="spacer" />
        <div className="src-tag">Source · Screener.in (paid) + company disclosures<br />FY ending March · consolidated</div>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={'tab ' + (tab === t.id ? 'on' : '')} onClick={() => setTab(t.id)}>
            <span className="ti">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <CompareBar selected={selected} setSelected={setSelected} />

      <Active selected={selected} openModal={openModal} />

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.title} sub={modal?.sub}>
        {modal?.content}
      </Modal>
    </div>
  )
}
