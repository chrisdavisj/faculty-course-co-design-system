import { useState } from 'react'
import type { AgentResult } from '../types'

export default function AgentCard({ agent }: { agent: AgentResult }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="agent-card">
      <div className="agent-card-header" onClick={() => setOpen(o => !o)}>
        <span className="agent-icon">{agent.icon}</span>
        <span className="agent-name">{agent.name}</span>
        <span className="agent-summary">{agent.summary}</span>
        <span className={`agent-chevron${open ? ' open' : ''}`}>▼</span>
      </div>
      {open && (
        <div className="agent-card-body">
          <ul className="agent-findings">
            {agent.findings.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          <p className="agent-source">Source: {agent.source}</p>
          {agent.citations && agent.citations.length > 0 && (
            <div className="agent-citations">
              {agent.citations.map((c, i) => (
                <a key={i} className="agent-citation-link" href={c.uri} target="_blank" rel="noreferrer">
                  📎 {c.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
