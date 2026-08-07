// Event Bus - The shared bloodstream connecting all subsystems
import { SystemEvent } from "./events"

type Listener = (event: SystemEvent) => Promise<void>

export class EventBus {
  private listeners: Listener[] = []

  subscribe(listener: Listener) {
    this.listeners.push(listener)
  }

  async publish(event: SystemEvent) {
    for (const listener of this.listeners) {
      await listener(event)
    }
  }
}