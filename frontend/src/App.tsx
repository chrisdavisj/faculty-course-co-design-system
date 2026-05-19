import { useState } from 'react'
import type { AnalysisResponse, SyllabusInput, TargetedImprovement } from './types'
import SyllabusForm from './components/SyllabusForm'
import AgentCard from './components/AgentCard'
import FeedbackSummary from './components/FeedbackSummary'
import TargetedImprovements from './components/TargetedImprovements'

const DEMO_SYLLABUS: SyllabusInput = {
  title: 'Introduction to Algorithms (CS 301)',
  description:
    'A foundational course covering algorithm design and analysis. Topics include sorting, searching, recursion, dynamic programming, and complexity theory. Students will implement algorithms in Python and analyze their time and space complexity.',
  competencies:
    'Algorithm design and analysis\nTime and space complexity (Big-O)\nSorting algorithms (merge sort, quicksort, heapsort)\nDynamic programming\nGreedy algorithms\nBasic data structures (trees, heaps, hash tables)',
  readings:
    "CLRS – Introduction to Algorithms (Cormen et al.)\nAlgorithm Design (Kleinberg & Tardos)\nSelected chapters from Skiena's Algorithm Design Manual",
  assignments:
    'Weekly homework sets (algorithm problems)\nTwo midterm exams\nFinal exam\nOptional extra credit: LeetCode challenge',
}

export default function App() {
  const [syllabus, setSyllabus] = useState<SyllabusInput>(DEMO_SYLLABUS)
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // round 2: select recommendations → get targeted improvements
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [improvements, setImprovements] = useState<TargetedImprovement[] | null>(null)
  const [refining, setRefining] = useState(false)

  // round 3: select improvements → export to .docx
  const [exportSelected, setExportSelected] = useState<Set<number>>(new Set())
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)

  async function handleAnalyze(s: SyllabusInput) {
    setSyllabus(s)
    setLoading(true)
    setResult(null)
    setError(null)
    setSelected(new Set())
    setImprovements(null)
    setExportSelected(new Set())
    setExported(false)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      setResult(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function toggleRank(rank: number) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(rank) ? next.delete(rank) : next.add(rank)
      return next
    })
    setImprovements(null)
    setExportSelected(new Set())
    setExported(false)
  }

  async function handleRefine() {
    setRefining(true)
    setImprovements(null)
    setExportSelected(new Set())
    setExported(false)
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabus,
          selected_ranks: Array.from(selected),
          recommendations: result?.feedback.top_recommendations ?? [],
        }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setImprovements(data.improvements)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setRefining(false)
    }
  }

  function toggleExport(rank: number) {
    setExportSelected(prev => {
      const next = new Set(prev)
      next.has(rank) ? next.delete(rank) : next.add(rank)
      return next
    })
    setExported(false)
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabus, selected_ranks: Array.from(exportSelected) }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const blob = await res.blob()
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="([^"]+)"/)
      const filename = match ? match[1] : 'curriculum_review.docx'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      setExported(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <header className="header">
        <div className="header-logo">🎓</div>
        <div>
          <h1>Faculty Course Co-Design System</h1>
          <p>AI-powered curriculum alignment for higher education faculty</p>
        </div>
        <span className="header-badge">Pilot: CS Algorithms</span>
      </header>

      <div className="layout">
        <SyllabusForm
          defaultValues={DEMO_SYLLABUS}
          loading={loading}
          onSubmit={handleAnalyze}
        />

        <div className="results-panel">
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '16px 20px', color: '#dc2626', fontSize: 14 }}>
              {error}
            </div>
          )}

          {!loading && !result && !error && (
            <div className="empty-state">
              <div className="big-icon">🤖</div>
              <p>Submit a syllabus to receive multi-agent feedback</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Agents are analyzing your syllabus…</p>
              <div className="agents-loading">
                {['Transparency', 'Labor Market', 'Competencies', 'University Strategy', 'Assessment', 'Policy'].map(a => (
                  <span key={a} className="agent-chip">{a}</span>
                ))}
              </div>
            </div>
          )}

          {result && (
            <>
              <FeedbackSummary
                recommendations={result.feedback.top_recommendations}
                selected={selected}
                onToggle={toggleRank}
                onRefine={handleRefine}
                refining={refining}
              />

              {improvements && (
                <>
                  <TargetedImprovements
                    improvements={improvements}
                    exportSelected={exportSelected}
                    onToggleExport={toggleExport}
                    onExport={handleExport}
                    exporting={exporting}
                  />

                  {exported && (
                    <div className="export-success">
                      <span>✅</span>
                      <div>
                        <strong>Document saved.</strong> Open it in Google Docs or Word to review and edit the suggested changes.
                      </div>
                    </div>
                  )}
                </>
              )}

              {result.agents.map(agent => (
                <AgentCard key={agent.name} agent={agent} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}
