// Router - The actual decision point
import { AgentRegistry } from "./registry"
import { scoreAgent } from "./scoring"
import { TaskRequest, RoutingDecision, AgentProfile } from "./schemas"
import { DEFAULT_PROFILES } from "./profiles"

export { RoutingDecision } from "./schemas"

export class ModelRouter {
  constructor(private registry: AgentRegistry) {}

  route(task: TaskRequest): RoutingDecision {
    const candidates: [number, AgentProfile][] = []

    for (const agent of this.registry.available()) {
      const score = scoreAgent(task, agent)
      candidates.push([score, agent])
    }

    if (candidates.length === 0) {
      const fallbackProfile = DEFAULT_PROFILES[0]
      if (!fallbackProfile) {
        throw new Error("No default profiles available")
      }
      return {
        agent: fallbackProfile.name,
        model: fallbackProfile.model,
        score: 0,
        reason: "No agents registered, using default",
        confidence: 0,
        fallback: null
      }
    }

    candidates.sort((a, b) => b[0] - a[0])

    const first = candidates[0]
    if (!first) {
      throw new Error("Unexpected empty candidates after sort")
    }
    const winner = first[1]
    const fallback = candidates[1]?.[1]?.name ?? null

    return {
      agent: winner.name,
      model: winner.model,
      score: first[0],
      reason: `Selected ${winner.name} (score: ${first[0]})`,
      confidence: Math.min(first[0] / 100, 1.0),
      fallback
    }
  }
}