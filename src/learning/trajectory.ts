// Trajectory Model - System reasons about runs, not isolated events
import { SystemEvent } from "../core/events"

export interface Trajectory {
  id: string
  started: string
  ended: string | undefined
  events: SystemEvent[]
  success: boolean
  failures: number
  tools: string[]
}

export function buildTrajectory(events: SystemEvent[]): Trajectory {
  const failures = events.filter(e => e.type.endsWith("failed"))

  return {
    id: crypto.randomUUID(),
    started: events[0]?.timestamp ?? new Date().toISOString(),
    ended: events.at(-1)?.timestamp,
    events,
    success: failures.length === 0,
    failures: failures.length,
    tools: [
      ...new Set(
        events
          .filter(e => e.type.startsWith("tool"))
          .map(e => String(e.payload.tool))
      )
    ]
  }
}