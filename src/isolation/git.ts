// Git Operations - Isolated git commands
import { exec } from "node:child_process"
import { promisify } from "node:util"

const run = promisify(exec)

export async function git(args: string, cwd: string) {
  const result = await run(`git ${args}`, { cwd })
  return result.stdout.trim()
}