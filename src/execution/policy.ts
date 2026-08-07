// Sandbox Policy - Permission boundaries for execution
export interface SandboxPolicy {
  allow_read: string[]
  allow_write: string[]
  allow_exec: string[]
  deny: string[]
  max_duration_ms: number
  max_memory_mb: number
}

export const DEFAULT_SANDBOX_POLICY: SandboxPolicy = {
  allow_read: ["**"],
  allow_write: [".experiments/**", ".opencode/self-improvement/**"],
  allow_exec: ["npm test", "npm run build", "node", "pnpm", "git"],
  deny: ["src/**", "plugins/**", "skills/**", "config/**"],
  max_duration_ms: 300000,
  max_memory_mb: 1024
}