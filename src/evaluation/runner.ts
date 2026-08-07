// Runner - Execution engine using host environment
import { exec } from "node:child_process"
import { promisify } from "node:util"
import { EvaluationCase, EvaluationRun } from "./types"

const execute = promisify(exec)

export async function runEvaluation(
  proposalId: string,
  test: EvaluationCase
): Promise<EvaluationRun> {
  const started = Date.now()

  try {
    const result = await execute(test.command, { timeout: test.timeoutMs })

    return {
      id: crypto.randomUUID(),
      proposalId,
      started: new Date().toISOString(),
      ended: new Date().toISOString(),
      status: "passed",
      exitCode: 0,
      output: result.stdout,
      errors: result.stderr,
      metrics: { durationMs: Date.now() - started }
    }
  } catch (error: unknown) {
    const execError = error as { code?: number; stdout?: string; stderr?: string; message?: string };
    return {
      id: crypto.randomUUID(),
      proposalId,
      started: new Date().toISOString(),
      ended: new Date().toISOString(),
      status: "failed",
      exitCode: execError.code ?? -1,
      output: execError.stdout || "",
      errors: (execError.stderr ?? execError.message) || "Unknown error",
      metrics: { durationMs: Date.now() - started, testsFailed: 1 }
    }
  }
}