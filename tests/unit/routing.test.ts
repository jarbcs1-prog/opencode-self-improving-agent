import { describe, it, expect } from "vitest"
import { ModelRouter } from "../../src/routing/router"
import { AgentRegistry } from "../../src/routing/registry"
import { DEFAULT_PROFILES } from "../../src/routing/profiles"
import { TaskRequest } from "../../src/routing/schemas"

describe("Model Router", () => {
  it("should select best agent based on capabilities", () => {
    const registry = new AgentRegistry()
    DEFAULT_PROFILES.forEach(p => registry.register(p))

    const router = new ModelRouter(registry)

    const task: TaskRequest = {
      id: "test-1",
      description: "Implement authentication system",
      required_capabilities: ["coding", "testing"],
      risk_level: "medium",
      context_size: 10000,
      budget_limit: 1.0,
      verification_required: true
    }

    const decision = router.route(task)

    expect(decision.agent).toBe("worker")
    expect(decision.model).toBe("llama-local")
    expect(decision.confidence).toBeGreaterThan(0)
  })

  it("should prefer architect for high-risk planning tasks", () => {
    const registry = new AgentRegistry()
    DEFAULT_PROFILES.forEach(p => registry.register(p))

    const router = new ModelRouter(registry)

    const task: TaskRequest = {
      id: "test-2",
      description: "Design system architecture",
      required_capabilities: ["system_design", "planning"],
      risk_level: "high",
      context_size: 50000,
      budget_limit: 2.0,
      verification_required: true
    }

    const decision = router.route(task)

    expect(decision.agent).toBe("architect")
  })
})