import { describe, it, expect } from "vitest"
import { buildTrajectory } from "../../src/learning/trajectory"
import { detectPatterns } from "../../src/learning/patterns"
import { createProposals } from "../../src/learning/proposals"
import { SystemEvent } from "../../src/core/events"

describe("Learning Pipeline", () => {
  it("should build trajectory from events", () => {
    const events: SystemEvent[] = [
      {
        id: "1",
        timestamp: "2026-01-01T00:00:00Z",
        type: "task.completed",
        source: "opencode",
        payload: { task: "test" }
      },
      {
        id: "2",
        timestamp: "2026-01-01T00:01:00Z",
        type: "tool.completed",
        source: "opencode",
        payload: { tool: "bash" }
      }
    ]

    const trajectory = buildTrajectory(events)

    expect(trajectory.success).toBe(true)
    expect(trajectory.failures).toBe(0)
    expect(trajectory.tools).toContain("bash")
  })

  it("should detect failure-loop pattern", () => {
    const trajectories = [
      {
        id: "1",
        started: "2026-01-01T00:00:00Z",
        ended: "2026-01-01T00:01:00Z",
        events: [],
        success: false,
        failures: 2,
        tools: ["bash"]
      },
      {
        id: "2",
        started: "2026-01-01T00:02:00Z",
        ended: "2026-01-01T00:03:00Z",
        events: [],
        success: false,
        failures: 1,
        tools: ["bash"]
      }
    ]

    const patterns = detectPatterns(trajectories)

    expect(patterns).toHaveLength(1)
    expect(patterns[0].type).toBe("failure-loop")
  })

  it("should create guardrail proposal from failure-loop", () => {
    const patterns = [{
      type: "failure-loop" as const,
      evidence: ["exp-1: 2 failures", "exp-2: 1 failures"]
    }]

    const proposals = createProposals(patterns)

    expect(proposals).toHaveLength(1)
    expect(proposals[0].category).toBe("guardrail")
    expect(proposals[0].reason).toContain("Repeated failure detected")
  })
})