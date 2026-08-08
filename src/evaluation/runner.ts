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
  } catch (error: any) {
    return {
      id: crypto.randomUUID(),
      proposalId,
      started: new Date().toISOString(),
      ended: new Date().toISOString(),
      status: "failed",
      exitCode: error.code ?? -1,
      output: error.stdout,
      errors: error.stderr ?? error.message,
      metrics: { durationMs: Date.now() - started, testsFailed: 1 }
    }
  }
}