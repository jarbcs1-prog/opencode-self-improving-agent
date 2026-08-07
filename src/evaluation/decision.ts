// Decision - Promotion gate
import { Comparison } from "./comparator"

export type DecisionAction = "promote" | "reject"

export interface Decision {
  action: DecisionAction
  reason: string
}

export function decide(comparison: Comparison): Decision {
  if (comparison.better) {
    return { action: "promote", reason: comparison.reason }
  }
  return { action: "reject", reason: comparison.reason }
}