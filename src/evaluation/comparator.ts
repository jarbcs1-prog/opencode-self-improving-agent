// Comparator - Intelligence boundary (deterministic first)
import { Baseline } from "./baseline"
import { EvaluationRun } from "./types"

export interface Comparison {
  better: boolean
  reason: string
}

export function compare(baseline: Baseline, candidate: EvaluationRun): Comparison {
  if (candidate.status !== "passed") {
    return { better: false, reason: "Candidate evaluation failed" }
  }

  if (!baseline.success) {
    return { better: true, reason: "Candidate fixed previous failure" }
  }

  if (candidate.metrics.durationMs! < baseline.durationMs) {
    return { better: true, reason: "Candidate improved execution time" }
  }

  return { better: false, reason: "No measurable improvement" }
}