// Scoring - Where the intelligence starts
import { TaskRequest, AgentProfile } from "./schemas"

export function scoreAgent(task: TaskRequest, agent: AgentProfile): number {
  let score = 0

  const taskCapabilities = new Set(task.required_capabilities)
  const agentCapabilities = new Set(agent.capabilities)
  let capabilityMatch = 0
  for (const cap of taskCapabilities) {
    if (agentCapabilities.has(cap)) capabilityMatch++
  }
  score += capabilityMatch * 10

  if (task.context_size <= agent.max_context) score += 5

  score += agent.reliability_score * 20
  score -= agent.cost_multiplier * 5

  if (task.risk_level === "high") score += agent.reliability_score * 20

  return score
}