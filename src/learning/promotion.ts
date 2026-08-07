// Promotion Engine - Skills promoted because evidence justified them
import { ImprovementProposal } from "./proposals"

export interface PromotionDecision {
  approved: boolean
  artifact?: string
}

export function evaluatePromotion(proposal: ImprovementProposal): PromotionDecision {
  if (proposal.category === "guardrail") {
    return {
      approved: true,
      artifact: `
# Generated Guardrail

Reason:
${proposal.reason}

Evidence:
${proposal.evidence.join("\n")}

Action:
Create regression protection.
`
    }
  }
  return { approved: false }
}