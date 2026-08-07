// Lifecycle - Controls promotion or destruction
import { git } from "./git"
import { Experiment } from "./types"

export async function promote(experiment: Experiment, root: string) {
  await git(["checkout", "master"], root)
  await git(["merge", experiment.branch], root)

  experiment.status = "accepted"
  experiment.completed = new Date().toISOString()

  return experiment
}

export async function reject(experiment: Experiment, root: string) {
  await git(["worktree", "remove", experiment.worktree, "--force"], root)
  await git(["branch", "-D", experiment.branch], root)

  experiment.status = "rejected"
  experiment.completed = new Date().toISOString()

  return experiment
}