import type { TargetedImprovement } from '../types'

interface Props {
  improvements: TargetedImprovement[]
  exportSelected: Set<number>
  onToggleExport: (rank: number) => void
  onExport: () => void
  exporting: boolean
}

export default function TargetedImprovements({
  improvements,
  exportSelected,
  onToggleExport,
  onExport,
  exporting,
}: Props) {
  return (
    <div className="improvements-section">
      <div className="improvements-header">
        <span className="improvements-icon">✏️</span>
        <div>
          <h3>Targeted Revision Guidance</h3>
          <p>{improvements.length} recommendation{improvements.length !== 1 ? 's' : ''} with specific edits — select to include in export</p>
        </div>
      </div>

      {improvements.map(imp => (
        <div
          key={imp.rank}
          className={`improvement-card${exportSelected.has(imp.rank) ? ' improvement-card--selected' : ''}`}
          onClick={() => onToggleExport(imp.rank)}
          role="checkbox"
          aria-checked={exportSelected.has(imp.rank)}
          tabIndex={0}
          onKeyDown={e => e.key === ' ' && onToggleExport(imp.rank)}
        >
          <div className="improvement-title-row">
            <div className="improvement-check">
              {exportSelected.has(imp.rank) ? '✓' : ''}
            </div>
            <span className="improvement-rank">#{imp.rank}</span>
            <span className="improvement-action">{imp.action}</span>
          </div>

          <div className="improvement-where">
            <span className="label">Where:</span> {imp.where}
          </div>

          <div className="improvement-section-label">Steps</div>
          <ol className="improvement-steps">
            {imp.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>

          <div className="improvement-section-label">Suggested text to add</div>
          <pre className="improvement-text">{imp.suggested_text}</pre>

          <div className="improvement-footer">
            <span className="improvement-source">📎 {imp.source}</span>
            <span className="improvement-effort">⏱ {imp.effort}</span>
          </div>
        </div>
      ))}

      <div className="export-bar">
        <span className="export-hint">
          {exportSelected.size === 0
            ? 'Select improvements to include in the document'
            : `${exportSelected.size} improvement${exportSelected.size !== 1 ? 's' : ''} selected for export`}
        </span>
        <button
          className="export-btn"
          disabled={exportSelected.size === 0 || exporting}
          onClick={e => { e.stopPropagation(); onExport(); }}
        >
          {exporting ? (
            <>
              <span className="btn-spinner-dark" />
              Building document…
            </>
          ) : (
            '⬇ Save to Document'
          )}
        </button>
      </div>
    </div>
  )
}
