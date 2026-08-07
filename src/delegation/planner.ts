// Delegation - Decides how to execute (not just which model)
import { RoutingDecision } from "../routing/schemas"

export interface DelegationStep {
  agent: string
  purpose: "plan" | "execute" | "verify"
}

export class Delegator {
  delegate(task: { risk_level: string }, decision: RoutingDecision): DelegationStep[] {
    if (task.risk_level === "high") {
      return [
        { agent: "architect", purpose: "plan" },
        { agent: decision.agent, purpose: "execute" },
        { agent: "reviewer", purpose: "verify" }
      ]
    }
    return [{ agent: decision.agent, purpose: "execute" }]
  }
}