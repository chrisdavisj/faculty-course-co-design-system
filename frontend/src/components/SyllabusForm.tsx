import { useState } from 'react'
import type { SyllabusInput } from '../types'

interface Props {
  defaultValues: SyllabusInput
  loading: boolean
  onSubmit: (s: SyllabusInput) => void
}

export default function SyllabusForm({ defaultValues, loading, onSubmit }: Props) {
  const [form, setForm] = useState<SyllabusInput>(defaultValues)

  function set(field: keyof SyllabusInput) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  return (
    <div className="form-panel">
      <h2>📄 Syllabus Input</h2>

      <div className="field">
        <label>Course Title</label>
        <input value={form.title} onChange={set('title')} placeholder="e.g. Introduction to Algorithms" />
      </div>

      <div className="field">
        <label>Course Description</label>
        <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Describe the course…" />
      </div>

      <div className="field">
        <label>Course Competencies</label>
        <textarea rows={4} value={form.competencies} onChange={set('competencies')} placeholder="List learning objectives, one per line…" />
      </div>

      <div className="field">
        <label>Required Readings</label>
        <textarea rows={3} value={form.readings} onChange={set('readings')} placeholder="Textbooks, papers, online resources…" />
      </div>

      <div className="field">
        <label>Assignments &amp; Assessments</label>
        <textarea rows={3} value={form.assignments} onChange={set('assignments')} placeholder="Homework, exams, projects…" />
      </div>

      <button
        className="analyze-btn"
        disabled={loading || !form.title.trim()}
        onClick={() => onSubmit(form)}
      >
        {loading ? (
          <>
            <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Analyzing…
          </>
        ) : (
          '▶ Analyze Syllabus'
        )}
      </button>
    </div>
  )
}
