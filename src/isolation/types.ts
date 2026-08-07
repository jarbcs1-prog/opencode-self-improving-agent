// Isolation Types - Experiment as first-class artifact
export type ExperimentStatus = "created" | "running" | "evaluating" | "accepted" | "rejected" | "failed"

export interface Experiment {
  id: string
  proposalId: string
  branch: string
  worktree: string
  status: ExperimentStatus
  created: string
  completed?: string
  result?: {
    promoted: boolean
    reason: string
  }
}