// OpenCode Adapter - Translates OpenCode events to internal SystemEvent format
import { EventBus } from "../core/event-bus"
import { SystemEventType } from "../core/events"

export function createOpenCodeAdapter(bus: EventBus) {
  return {
    async event(input: any) {
      const event = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        source: "opencode" as const,
        type: normalize(input.event.type),
        payload: input.event
      }

      await bus.publish(event)
    }
  }
}

function normalize(type: string): SystemEventType {
  switch (type) {
    case "session.created": return "session.started"
    case "session.compacted": return "session.compacted"
    case "session.idle": return "session.idle"
    case "tool.execute.before": return "tool.started"
    case "tool.execute.after": return "tool.completed"
    default: return "session.idle"
  }
}