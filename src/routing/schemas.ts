// Routing Schemas - Core data models for routing
export interface TaskRequest {
  id: string
  description: string
  required_capabilities: string[]
  risk_level: "low" | "medium" | "high"
  context_size: number
  budget_limit: number
  verification_required: boolean
}

export interface AgentProfile {
  name: string
  capabilities: string[]
  model: string
  cost_multiplier: number
  reliability_score: number
  max_context: number
  tools: string[]
}

export interface RoutingDecision {
  agent: string
  model: string
  score: number
  reason: string
  confidence: number
  fallback: string | null
}