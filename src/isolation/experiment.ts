// Experiment Coordinator
import { createWorktree } from "./workspace"
import { Experiment } from "./types"

export async function createExperiment(root: string, proposalId: string): Promise<Experiment> {
  const id = crypto.randomUUID()
  const workspace = await createWorktree(root, id)

  return {
    id,
    proposalId,
    branch: workspace.branch,
    worktree: workspace.path,
    status: "created",
    created: new Date().toISOString()
  }
}

export { Experiment, ExperimentStatus } from "./types"