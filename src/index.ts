import type { PluginModule, PluginInput, Hooks } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import * as core from "./core"
import { z } from "zod"

const server = async (_input: PluginInput): Promise<Hooks> => {
  return {
    tool: {
      "self-improvement:reflect": tool({
        description: "Run reflection on recent events",
        args: {
          events: z.array(z.object({}))
        },
        async execute({ events }) {
          const result = core.reflect(events as unknown as core.SystemEvent[])
          return JSON.stringify(result, null, 2)
        }
      }),
      "self-improvement:route": tool({
        description: "Route a task to the best agent/model",
        args: {
          description: z.string(),
          required_capabilities: z.array(z.string()),
          risk_level: z.enum(["low", "medium", "high"]),
          context_size: z.number(),
          budget_limit: z.number(),
          verification_required: z.boolean()
        },
        async execute(task) {
          const registry = new core.AgentRegistry()
          core.DEFAULT_PROFILES.forEach(p => registry.register(p))
          const router = new core.ModelRouter(registry)
          const decision = router.route(task as core.TaskRequest)
          return JSON.stringify(decision, null, 2)
        }
      }),
      "self-improvement:run-evaluation": tool({
        description: "Run evaluation on a workflow",
        args: {
          proposal_id: z.string(),
          command: z.string(),
          expected_exit_code: z.number().optional(),
          timeout_ms: z.number().optional()
        },
        async execute({ proposal_id, command, expected_exit_code, timeout_ms }) {
          const test: core.EvaluationCase = {
            id: crypto.randomUUID(),
            name: "Plugin Evaluation",
            command,
            expectedExitCode: expected_exit_code ?? 0,
            timeoutMs: timeout_ms ?? 120000
          }
          const result = await core.runEvaluation(proposal_id, test)
          return JSON.stringify(result, null, 2)
        }
      }),
      "self-improvement:create-experiment": tool({
        description: "Create a new experiment worktree",
        args: {
          name: z.string(),
          description: z.string()
        },
        async execute({ name, description }) {
          const experiment = await core.createExperiment(name, description)
          return JSON.stringify(experiment, null, 2)
        }
      })
    }
  }
}

export const SelfImprovementPlugin: PluginModule = {
  id: "self-improvement",
  server
}

// Default export for OpenCode plugin loading
export default server

// Re-export all core APIs for direct imports
export * from "./core"