// Default Agent Profiles - Replaces hardcoded agent personas
import { AgentProfile } from "./schemas"

export { AgentProfile } from "./schemas"

export const DEFAULT_PROFILES: AgentProfile[] = [
  {
    name: "architect",
    capabilities: ["system_design", "planning", "tradeoff_analysis"],
    model: "opencode-zen",
    cost_multiplier: 1.0,
    reliability_score: 0.95,
    max_context: 200000,
    tools: []
  },
  {
    name: "worker",
    capabilities: ["coding", "testing", "refactoring"],
    model: "llama-local",
    cost_multiplier: 0.1,
    reliability_score: 0.80,
    max_context: 32000,
    tools: []
  },
  {
    name: "reviewer",
    capabilities: ["verification", "bug_detection", "security"],
    model: "opencode-zen",
    cost_multiplier: 1.2,
    reliability_score: 0.97,
    max_context: 200000,
    tools: []
  }
]