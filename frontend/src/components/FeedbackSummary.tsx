import type { Recommendation } from '../types'

const priorityLabel: Record<string, string> = {
  high: 'HIGH',
  medium: 'MED',
  low: 'LOW',
}

interface Props {
  recommendations: Recommendation[]
  selected: Set<number>
  onToggle: (rank: number) => void
  onRefine: () => void
  refining: boolean
}

export default function FeedbackSummary({ recommendations, selected, onToggle, onRefine, refining }: Props) {
  return (
    <div className="feedback-card">
      <div className="feedback-header">
        <h3>🎯 Feedback Agent — Top Recommendations</h3>
        <p>Select recommendations below, then get targeted revision guidance</p>
      </div>
      <div className="rec-list">
        {recommendations.map(rec => (
          <div
            key={rec.rank}
            className={`rec-item${selected.has(rec.rank) ? ' rec-item--selected' : ''}`}
            onClick={() => onToggle(rec.rank)}
            role="checkbox"
            aria-checked={selected.has(rec.rank)}
            tabIndex={0}
            onKeyDown={e => e.key === ' ' && onToggle(rec.rank)}
          >
            <div className="rec-check">
              {selected.has(rec.rank) ? '✓' : ''}
            </div>
            <div className="rec-rank">{rec.rank}</div>
            <div className="rec-content">
              <div className="rec-action">{rec.action}</div>
              <div className="rec-rationale">{rec.rationale}</div>
              <div className="rec-effort">{rec.effort}</div>
            </div>
            <span className={`priority-badge priority-${rec.priority}`}>
              {priorityLabel[rec.priority] ?? rec.priority.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
      <div className="refine-bar">
        <span className="refine-hint">
          {selected.size === 0
            ? 'Click recommendations to select'
            : `${selected.size} selected`}
        </span>
        <button
          className="refine-btn"
          disabled={selected.size === 0 || refining}
          onClick={onRefine}
        >
          {refining ? (
            <>
              <span className="btn-spinner" />
              Generating guidance…
            </>
          ) : (
            `Get Targeted Improvements →`
          )}
        </button>
      </div>
    </div>
  )
}
