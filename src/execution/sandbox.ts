// Sandbox Execution - Isolated execution environment
import { SandboxPolicy, DEFAULT_SANDBOX_POLICY } from "./policy"

export interface SandboxResult {
  success: boolean
  stdout: string
  stderr: string
  exit_code: number
  duration_ms: number
}

export class SandboxExecutor {
  constructor(private policy: SandboxPolicy = DEFAULT_SANDBOX_POLICY) {}

  async execute(command: string, cwd: string): Promise<SandboxResult> {
    // Validate command against policy
    if (!this.isAllowed(command)) {
      return {
        success: false,
        stdout: "",
        stderr: `Command not allowed by policy: ${command}`,
        exit_code: -1,
        duration_ms: 0
      }
    }

    // In production, this would use a proper sandbox (firejail, gvisor, etc.)
    // For now, we execute with timeout in the worktree
    const { exec } = await import("node:child_process")
    const { promisify } = await import("node:util")
    const execute = promisify(exec)

    const start = Date.now()
    try {
      const result = await execute(command, { cwd, timeout: this.policy.max_duration_ms })
      return {
        success: true,
        stdout: result.stdout,
        stderr: result.stderr,
        exit_code: 0,
        duration_ms: Date.now() - start
      }
    } catch (error: unknown) {
      const execError = error as { stdout?: string; stderr?: string; code?: number; message?: string };
      return {
        success: false,
        stdout: execError.stdout || "",
        stderr: execError.stderr || execError.message || "Unknown error",
        exit_code: execError.code || -1,
        duration_ms: Date.now() - start
      }
    }
  }

  private isAllowed(command: string): boolean {
    // Check deny list first
    for (const pattern of this.policy.deny) {
      if (this.matchPattern(command, pattern)) return false
    }
    // Check allow list
    for (const pattern of this.policy.allow_exec) {
      if (this.matchPattern(command, pattern)) return true
    }
    return false
  }

  private matchPattern(command: string, pattern: string): boolean {
    const regex = pattern.replace(/\*/g, ".*")
    return new RegExp(`^${regex}$`).test(command)
  }
}

export { SandboxPolicy, DEFAULT_SANDBOX_POLICY } from "./policy"