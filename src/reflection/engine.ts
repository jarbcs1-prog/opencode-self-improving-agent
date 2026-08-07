// Reflection Engine - First generation is deterministic
import { SystemEvent } from "../core/events"

export function reflect(events: SystemEvent[]) {
  const failures = events.filter(e => e.type.includes("failed"))

  return {
    friction: failures.map(e => e.payload),
    elegance: ["Events captured through adapter layer"],
    unseen_layer: failures.length
      ? ["Repeated failure candidates require evaluation"]
      : [],
    improvement_candidates: failures.length
      ? ["Create regression test", "Improve verification boundary"]
      : []
  }
}