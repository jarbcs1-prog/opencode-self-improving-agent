// Improvement Proposals - Bridge between observation and engineering action
import { Pattern } from "./patterns"

export type ProposalCategory = "skill" | "workflow" | "guardrail" | "evaluation"

export interface ImprovementProposal {
  id: string
  category: ProposalCategory
  reason: string
  evidence: string[]
}

export function createProposals(patterns: Pattern[]): ImprovementProposal[] {
  return patterns.map(pattern => {
    switch (pattern.type) {
      case "failure-loop":
        return {
          id: crypto.randomUUID(),
          category: "guardrail",
          reason: "Repeated failure detected. Add prevention mechanism.",
          evidence: pattern.evidence
        }
      case "missing-verification":
        return {
          id: crypto.randomUUID(),
          category: "evaluation",
          reason: "Verification boundary appears weak.",
          evidence: pattern.evidence
        }
      default:
        return {
          id: crypto.randomUUID(),
          category: "workflow",
          reason: "Successful trajectory should be captured as reusable process.",
          evidence: pattern.evidence
        }
    }
  })
}