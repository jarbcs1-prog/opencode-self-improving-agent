// Workspace - Creates disposable development environments
import { git } from "./git"

export async function createWorktree(root: string, experimentId: string) {
  const branch = `experiment/${experimentId}`
  const path = `${root}/.experiments/${experimentId}`

  await git(["worktree", "add", "-b", branch, path], root)

  return { branch, path }
}