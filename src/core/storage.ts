// Storage - Simple append/read abstraction for JSONL files
import fs from "node:fs/promises"
import path from "node:path"

export class Storage {
  constructor(private root: string) {}

  private file(name: string) {
    return path.join(this.root, ".opencode", "self-improvement", name)
  }

  async readJsonLines<T>(name: string): Promise<T[]> {
    try {
      const content = await fs.readFile(this.file(name), "utf8")
      return content
        .split("\n")
        .filter(Boolean)
        .map(line => JSON.parse(line))
    } catch {
      return []
    }
  }

  async appendJson(name: string, value: unknown) {
    const file = this.file(name)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.appendFile(file, JSON.stringify(value) + "\n", "utf8")
  }
}