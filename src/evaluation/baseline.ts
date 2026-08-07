// Baseline - Harness must know what "better" means
import { EvaluationRun } from "./types"

export interface Baseline {
  success: boolean
  durationMs: number
  failures: number
}

export function createBaseline(run: EvaluationRun): Baseline {
  return {
    success: run.status === "passed",
    durationMs: run.metrics.durationMs ?? 0,
    failures: run.metrics.testsFailed ?? 0
  }
}