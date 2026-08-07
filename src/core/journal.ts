// Journal - Persistent evidence layer
import fs from "node:fs/promises"
import path from "node:path"
import { SystemEvent } from "./events"

export class Journal {
  constructor(private root: string) {}

  async append(event: SystemEvent) {
    const dir = path.join(this.root, ".opencode", "self-improvement")

    await fs.mkdir(dir, { recursive: true })

    await fs.appendFile(
      path.join(dir, "journal.jsonl"),
      JSON.stringify(event) + "\n",
      "utf8"
    )
  }
}