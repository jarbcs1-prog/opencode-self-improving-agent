// Pattern Detection - First primitive of MetaEval engine
import { Trajectory } from "./trajectory"

export type PatternType = "failure-loop" | "missing-verification" | "successful-path"

export interface Pattern {
  type: PatternType
  evidence: string[]
}

export function detectPatterns(trajectories: Trajectory[]): Pattern[] {
  const patterns: Pattern[] = []

  const failures = trajectories.filter(t => !t.success)
  if (failures.length >= 2) {
    patterns.push({
      type: "failure-loop",
      evidence: failures.map(f => `${f.id}: ${f.failures} failures`)
    })
  }

  const successes = trajectories.filter(t => t.success)
  if (successes.length >= 3) {
    patterns.push({
      type: "successful-path",
      evidence: successes.map(s => `${s.id}: repeated success`)
    })
  }

  return patterns
}