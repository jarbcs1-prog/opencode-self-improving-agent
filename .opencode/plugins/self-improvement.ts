// OpenCode Plugin Entry Point
import type { Plugin } from "@opencode-ai/plugin"
import { EventBus } from "../../src/core/event-bus"
import { Journal } from "../../src/core/journal"
import { createOpenCodeAdapter } from "../../src/adapter/opencode"

export const SelfImprovementPlugin: Plugin = async function(ctx) {
  const bus = new EventBus()
  const journal = new Journal(ctx.directory)
  const adapter = createOpenCodeAdapter(bus)

  bus.subscribe(async event => {
    await journal.append(event)
  })

  console.log("[self-improvement] initialized")

  return {
    event: adapter.event
  }
}