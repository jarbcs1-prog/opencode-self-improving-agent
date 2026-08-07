// Learning Cycle - Wire all learning components together
import { Storage } from "../core/storage"
import { buildTrajectory } from "./trajectory"
import { detectPatterns } from "./patterns"
import { createProposals } from "./proposals"
import { SystemEvent } from "../core/events"
import { Trajectory } from "./trajectory"

export async function learningCycle(ctx: { directory: string }) {
  const storage = new Storage(ctx.directory)

  const events = await storage.readJsonLines<SystemEvent>("journal.jsonl")
  const trajectory = buildTrajectory(events)

  await storage.appendJson("trajectories.jsonl", trajectory)

  const trajectories = await storage.readJsonLines<Trajectory>("trajectories.jsonl")
  const patterns = detectPatterns(trajectories)
  const proposals = createProposals(patterns)

  for (const proposal of proposals) {
    await storage.appendJson("improvement-proposals.jsonl", proposal)
  }
}