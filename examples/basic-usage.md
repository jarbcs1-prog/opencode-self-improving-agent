# Basic Usage Example

This example demonstrates how to use the plugin programmatically.

```typescript
import {
  EventBus,
  Journal,
  Storage,
  reflect,
  buildTrajectory,
  detectPatterns,
  createProposals,
  ModelRouter,
  AgentRegistry,
  DEFAULT_PROFILES,
  learningCycle
} from "opencode-self-improving-agent"

// 1. Initialize core components
const bus = new EventBus()
const journal = new Journal("/path/to/project")
const storage = new Storage("/path/to/project")

// 2. Subscribe to events for journaling
bus.subscribe(async (event) => {
  await journal.append(event)
})

// 3. Simulate OpenCode events
const events = [
  { id: "1", timestamp: new Date().toISOString(), type: "session.started", source: "opencode", payload: {} },
  { id: "2", timestamp: new Date().toISOString(), type: "tool.started", source: "opencode", payload: { tool: "bash" } },
  { id: "3", timestamp: new Date().toISOString(), type: "tool.completed", source: "opencode", payload: { tool: "bash", success: true } },
  { id: "4", timestamp: new Date().toISOString(), type: "task.completed", source: "opencode", payload: { task: "implement feature" } }
]

for (const event of events) {
  await bus.publish(event)
}

// 4. Run reflection on task completion
const reflection = reflect(events)
console.log("Reflection:", reflection)

// 5. Run learning cycle
await learningCycle({ directory: "/path/to/project" })

// 6. Use routing for task delegation
const registry = new AgentRegistry()
DEFAULT_PROFILES.forEach(p => registry.register(p))

const router = new ModelRouter(registry)

const task = {
  id: "task-1",
  description: "Refactor authentication module",
  required_capabilities: ["coding", "refactoring"],
  risk_level: "medium",
  context_size: 15000,
  budget_limit: 1.0,
  verification_required: true
}

const decision = router.route(task)
console.log("Routing Decision:", decision)
```