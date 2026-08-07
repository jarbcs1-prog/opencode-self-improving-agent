// Evaluation Types - Evaluation as first-class artifact
export type EvaluationStatus = "created" | "running" | "passed" | "failed" | "rejected"

export interface EvaluationCase {
  id: string
  name: string
  command: string
  expectedExitCode: number
  timeoutMs: number
}

export interface EvaluationRun {
  id: string
  proposalId: string
  started: string
  ended?: string
  status: EvaluationStatus
  exitCode?: number
  output?: string
  errors?: string
  metrics: {
    durationMs?: number
    testsPassed?: number
    testsFailed?: number
  }
}