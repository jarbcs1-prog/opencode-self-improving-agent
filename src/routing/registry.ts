// Agent Registry - Runtime inventory
import { AgentProfile } from "./schemas"

export class AgentRegistry {
  private agents: Map<string, AgentProfile> = new Map()

  register(profile: AgentProfile) {
    this.agents.set(profile.name, profile)
  }

  available(): AgentProfile[] {
    return Array.from(this.agents.values())
  }

  find(name: string): AgentProfile | undefined {
    return this.agents.get(name)
  }
}