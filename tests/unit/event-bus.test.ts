import { describe, it, expect } from "vitest"
import { EventBus } from "../../src/core/event-bus"
import { SystemEvent } from "../../src/core/events"

describe("EventBus", () => {
  it("should publish events to subscribers", async () => {
    const bus = new EventBus()
    const received: SystemEvent[] = []

    bus.subscribe(async (event) => {
      received.push(event)
    })

    const event: SystemEvent = {
      id: "test-1",
      timestamp: new Date().toISOString(),
      type: "task.completed",
      source: "opencode",
      payload: { task: "test task" }
    }

    await bus.publish(event)

    expect(received).toHaveLength(1)
    expect(received[0]).toEqual(event)
  })

  it("should support multiple subscribers", async () => {
    const bus = new EventBus()
    const received1: SystemEvent[] = []
    const received2: SystemEvent[] = []

    bus.subscribe(async (event) => received1.push(event))
    bus.subscribe(async (event) => received2.push(event))

    const event: SystemEvent = {
      id: "test-2",
      timestamp: new Date().toISOString(),
      type: "tool.completed",
      source: "opencode",
      payload: { tool: "bash" }
    }

    await bus.publish(event)

    expect(received1).toHaveLength(1)
    expect(received2).toHaveLength(1)
  })
})