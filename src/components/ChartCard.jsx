import React, { useState } from 'react'
import { Card, ViewToggle } from './kit.jsx'

/* Card that toggles between a chart element and a table element */
export default function ChartCard({ title, sub, chart, table, insight, span, defaultView = 'chart', extraTools, onExpand }) {
  const [view, setView] = useState(defaultView)
  return (
    <Card title={title} sub={sub} span={span} tools={
      <>
        {extraTools}
        {onExpand && <button className="icon-btn" title="Expand" onClick={onExpand}>⤢</button>}
        {table && <ViewToggle view={view} setView={setView} />}
      </>
    }>
      {view === 'chart' ? chart : table}
      {insight}
    </Card>
  )
}
