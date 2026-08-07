// Configuration Schema
export interface PluginConfig {
  system: {
    autonomy_level: "supervised" | "autonomous"
  }
  routing: {
    preferred_local_models: boolean
    fallback_enabled: boolean
  }
  verification: {
    required_for: string[]
  }
  reflection: {
    enabled: boolean
    llm_enhanced: boolean
  }
  memory: {
    backend: "filesystem"
    retention_days: number
  }
  execution: {
    sandbox: "git-worktree" | "none"
    max_concurrent_experiments: number
  }
  evaluation: {
    baseline_runs: number
    comparison_threshold: number
  }
}

export const DEFAULT_CONFIG: PluginConfig = {
  system: { autonomy_level: "supervised" },
  routing: { preferred_local_models: true, fallback_enabled: true },
  verification: { required_for: ["code_changes", "filesystem_mutations", "configuration_changes"] },
  reflection: { enabled: true, llm_enhanced: false },
  memory: { backend: "filesystem", retention_days: 90 },
  execution: { sandbox: "git-worktree", max_concurrent_experiments: 3 },
  evaluation: { baseline_runs: 3, comparison_threshold: 0.05 }
}