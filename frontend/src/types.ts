export interface Citation {
  label: string
  uri: string
}

export interface AgentResult {
  name: string
  icon: string
  summary: string
  findings: string[]
  source: string
  citations?: Citation[]
}

export interface Recommendation {
  rank: number
  priority: 'high' | 'medium' | 'low'
  action: string
  rationale: string
  effort: string
}

export interface AnalysisResponse {
  agents: AgentResult[]
  feedback: {
    top_recommendations: Recommendation[]
  }
}

export interface TargetedImprovement {
  rank: number
  action: string
  where: string
  steps: string[]
  suggested_text: string
  source: string
  effort: string
}

export interface ExportInput {
  syllabus: SyllabusInput
  selected_ranks: number[]
}

export interface SyllabusInput {
  title: string
  description: string
  competencies: string
  readings: string
  assignments: string
}
