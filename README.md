# OpenCode Self-Improving Orchestration Plugin

> **Disclaimer:** This plugin is not built by the OpenCode team and is not affiliated with OpenCode in any way. It is an independent community project.

An adaptive control layer that enables continuous self-evaluation, workflow improvement, task-boundary reflection, orchestration awareness, model delegation, evaluation-driven improvement, safe execution and persistent project intelligence for OpenCode.

## Overview

This plugin transforms OpenCode from a tool that executes tasks into a system that learns from every execution. It implements a cognitive runtime with seven orthogonal control loops:

1. **OpenCode Adapter Layer** - Native integration with OpenCode lifecycle
2. **Execution State/Context Management** - Persistent memory via filesystem
3. **Reflection Engine** - Converts actions into improvement signals
4. **Skill Engineering Layer** - Skills as capability packages with promotion criteria
5. **Evaluation Harness** - Baseline → Change → Compare → Decide
6. **Safe Execution Isolation** - Git worktrees for sandboxed experiments
7. **Model Routing/Agent Delegation** - Capability-based routing, not model-name routing

## Architecture

```
OpenCode → Adapter → Event Bus → Journal + Reflection
                    ↓
              Learning Pipeline (Trajectory → Patterns → Proposals)
                    ↓
              Evaluation Harness (Baseline → Experiment → Compare)
                    ↓
              Safe Execution (Git Worktrees) → Promote/Reject
                    ↓
              Routing Memory → Improved Future Decisions
```

## Installation

```bash
# Install as OpenCode plugin
mkdir -p .opencode/plugins
cp -r dist/* .opencode/plugins/self-improvement/
# Or install globally
npm install -g opencode-self-improving-agent
```

## Configuration

Create `.opencode/self-improvement/config.yaml`:

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

reflection:
  enabled: true
  llm_enhanced: false

memory:
  backend: "filesystem"
  retention_days: 90

execution:
  sandbox: "git-worktree"
  max_concurrent_experiments: 3

evaluation:
  baseline_runs: 3
  comparison_threshold: 0.05
```

## How It Works

### 1. Event Observation
Every OpenCode event (session start, tool execution, task completion) is captured and normalized to a canonical `SystemEvent` format, then appended to `journal.jsonl`.

### 2. Reflection
On task completion/failure, the reflection engine analyzes events for:
- **Friction**: What created resistance
- **Elegance**: What became simpler/reusable
- **Honesty**: Assumptions that were wrong
- **Unseen Layer**: Hidden dependencies discovered
- **Improvement Candidates**: Artifacts to modify

### 3. Learning Pipeline
- **Trajectories**: Group events into complete runs
- **Patterns**: Detect failure loops, successful paths, missing verification
- **Proposals**: Generate improvement proposals (guardrails, skills, workflows, evaluations)

### 4. Evaluation Harness
For each proposal:
1. Create baseline by running tests on current code
2. Create isolated git worktree for experiment
3. Apply candidate change in worktree
4. Run evaluation in worktree
5. Compare baseline vs candidate (deterministic comparator)
6. Promote if better, reject if not

### 5. Routing & Delegation
Tasks are routed based on capability requirements, not model names:
- **Architect**: System design, planning (opencode-zen)
- **Worker**: Coding, testing, refactoring (local llama.cpp)
- **Reviewer**: Verification, security (opencode-zen)

Delegation chains: `architect → worker → reviewer` for high-risk tasks.

### 6. Persistent Memory
All state survives context loss, model changes, session restarts:
```
.opencode/self-improvement/
├── journal.jsonl
├── trajectories.jsonl
├── improvement-proposals.jsonl
├── experiments/
├── evaluations/
├── decisions.jsonl
└── promoted/
    ├── guardrails/
    ├── skills/
    └── workflows/
```

## Usage

The plugin works automatically once installed. No code changes required.

To inspect learning state:
```bash
cat .opencode/self-improvement/journal.jsonl
cat .opencode/self-improvement/improvement-proposals.jsonl
cat .opencode/self-improving-agent/promoted/guardrails/*.md
```

## Extension Points

### Custom Agent Profiles
```typescript
import { AgentRegistry, AgentProfile } from "opencode-self-improving-agent"

const registry = new AgentRegistry()
registry.register({
  name: "security-auditor",
  capabilities: ["security_audit", "vulnerability_scanning"],
  model: "opencode-zen",
  cost_multiplier: 1.5,
  reliability_score: 0.98,
  max_context: 200000,
  tools: ["semgrep", "bandit"]
})
```

### Custom Evaluation Cases
```typescript
import { EvaluationCase } from "opencode-self-improving-agent"

const customTest: EvaluationCase = {
  id: "security-scan",
  name: "Security Vulnerability Scan",
  command: "semgrep --config=auto src/",
  expectedExitCode: 0,
  timeoutMs: 120000
}
```

### Custom Reflection Analyzer
```typescript
import { reflect } from "opencode-self-improving-agent"

const customReflection = (events: SystemEvent[]) => {
  const base = reflect(events)
  // Add LLM-enhanced analysis
  return { ...base, llm_analysis: "..." }
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

## Principles

1. **Skills are capabilities** — The plugin decides when/why/how/if they improve
2. **No hidden conversational memory** — State as inspectable artifacts (files, logs, schemas, events)
3. **Every action produces evidence** — Answer: What? Why? Did it work? What should change?
4. **Observation before modification** — Self-observing before self-modifying
5. **Evaluation before promotion** — Baseline → Change → Evaluate → Compare → Accept/Reject
6. **Isolation for safety** — Git worktrees, no direct writes to canonical code
7. **Models as resources** — Capability-based routing, not model-name routing

## License

MIT