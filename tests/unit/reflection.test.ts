import { describe, it, expect } from "vitest"
import { reflect } from "../../src/reflection/engine"
import { SystemEvent } from "../../src/core/events"

describe("Reflection Engine", () => {
  it("should detect friction from failed events", () => {
    const events: SystemEvent[] = [
      {
        id: "1",
        timestamp: new Date().toISOString(),
        type: "tool.failed",
        source: "opencode",
        payload: { tool: "bash", error: "command not found" }
      },
      {
        id: "2",
        timestamp: new Date().toISOString(),
        type: "task.failed",
        source: "opencode",
        payload: { task: "build project" }
      }
    ]

    const reflection = reflect(events)

    expect(reflection.friction).toHaveLength(2)
    expect(reflection.improvement_candidates).toContain("Create regression test")
    expect(reflection.improvement_candidates).toContain("Improve verification boundary")
  })

  it("should return empty friction for successful events", () => {
    const events: SystemEvent[] = [
      {
        id: "1",
        timestamp: new Date().toISOString(),
        type: "tool.completed",
        source: "opencode",
        payload: { tool: "bash", success: true }
      }
    ]

    const reflection = reflect(events)

    expect(reflection.friction).toHaveLength(0)
    expect(reflection.improvement_candidates).toHaveLength(0)
    expect(reflection.elegance).toContain("Events captured through adapter layer")
  })
})