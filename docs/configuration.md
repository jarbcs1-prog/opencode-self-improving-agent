# Configuration Reference

Complete configuration options for the OpenCode Self-Improving Agent plugin.

## Configuration File

Location: `.opencode/self-improvement/config.yaml`

## Schema

```yaml
system:
  autonomy_level: "supervised"  # "supervised" | "autonomous"

routing:
  preferred_local_models: true
  fallback_enabled: true

verification:
  required_for:
    - code_changes
    - filesystem_mutations
    - configuration_changes

reflection:
  enabled: true
  llm_enhanced: false

memory:
  backend: "filesystem"
  retention_days: 90

execution:
  sandbox: "git-worktree"  # "git-worktree" | "none"
  max_concurrent_experiments: 3

evaluation:
  baseline_runs: 3
  comparison_threshold: 0.05
```

## Options

### system.autonomy_level

| Value | Description |
|-------|-------------|
| `supervised` | Human approval required for promotions (default) |
| `autonomous` | Automatic promotion after evaluation passes |

### routing.preferred_local_models

When `true`, the router prefers local models (llama.cpp) for cost efficiency when capabilities match.

### routing.fallback_enabled

When `true`, the router will fall back to alternative agents if the primary choice fails.

### verification.required_for

Array of task types that require verification gate:
- `code_changes` - Any source code modification
- `filesystem_mutations` - File creation/deletion/modification
- `configuration_changes` - Config file modifications
- `dependency_changes` - Package.json, Cargo.toml, etc.

### reflection.enabled

Enable/disable reflection engine.

### reflection.llm_enhanced

When `true`, uses LLM for enhanced reflection analysis (requires API key).

### memory.backend

Storage backend for persistent state. Currently only `filesystem` supported.

### memory.retention_days

Days to retain journal, trajectories, and experiments before cleanup.

### execution.sandbox

Isolation mechanism for experiments:
- `git-worktree` - Git worktrees (default, recommended)
- `none` - No isolation (not recommended)

### execution.max_concurrent_experiments

Maximum number of simultaneous experiment worktrees.

### evaluation.baseline_runs

Number of baseline runs to average for stable comparison.

### evaluation.comparison_threshold

Minimum improvement ratio (0.05 = 5%) required for promotion.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENCODE_PLUGIN_CONFIG` | Path to config file | `.opencode/self-improvement/config.yaml` |
| `OPENCODE_SELF_IMPROVEMENT_DIR` | Base directory for plugin state | `.opencode/self-improvement` |
| `OPENCODE_EXPERIMENTS_DIR` | Directory for experiment worktrees | `.experiments` |

## Example: Production Configuration

```yaml
system:
  autonomy_level: "supervised"

routing:
  preferred_local_models: true
  fallback_enabled: true

verification:
  required_for:
    - code_changes
    - filesystem_mutations
    - configuration_changes
    - dependency_changes

reflection:
  enabled: true
  llm_enhanced: true

memory:
  backend: "filesystem"
  retention_days: 180

execution:
  sandbox: "git-worktree"
  max_concurrent_experiments: 5

evaluation:
  baseline_runs: 5
  comparison_threshold: 0.03
```