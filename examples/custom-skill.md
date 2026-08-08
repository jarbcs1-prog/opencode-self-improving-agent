# Custom Skill Development

This guide shows how to create and promote custom skills through the plugin's evaluation system.

## 1. Define Skill as Capability Package

```typescript
interface Skill {
  name: string
  version: string
  domain: string
  knowledge: string          // Domain knowledge
  procedure: string          // Step-by-step procedure
  evaluation: string         // How to verify skill works
  failure_history: string[]  // Known failure modes
}
```

## 2. Skill Creation via Improvement Proposal

The system automatically generates skill proposals when it detects successful trajectories:

```typescript
// Automatic proposal generation (internal)
const patterns = detectPatterns(trajectories)
const proposals = createProposals(patterns)
// Returns proposal with category: "skill" for successful-path patterns
```

## 3. Manual Skill Registration

```typescript
import { AgentRegistry, AgentProfile } from "opencode-self-improving-agent"

const registry = new AgentRegistry()

// Register a custom agent with specialized skills
registry.register({
  name: "database-expert",
  capabilities: ["sql_optimization", "schema_design", "migration_planning"],
  model: "mimo-v2.5-free",
  cost_multiplier: 1.2,
  reliability_score: 0.94,
  max_context: 100000,
  tools: ["psql", "mysql", "redis-cli"]
})
```

## 4. Skill Evaluation

Skills are evaluated through the Evaluation Harness:

```typescript
import { EvaluationCase, runEvaluation, createBaseline, compare, decide } from "opencode-self-improving-agent"

const testCase: EvaluationCase = {
  id: "sql-optimization-test",
  name: "SQL Query Optimization",
  command: "npm run test:sql-optimization",
  expectedExitCode: 0,
  timeoutMs: 120000
}

// Run baseline
const baselineRun = await runEvaluation("proposal-123", testCase)
const baseline = createBaseline(baselineRun)

// Apply skill in experiment worktree
// ... (handled by isolation layer)

// Run candidate evaluation
const candidateRun = await runEvaluation("proposal-123", testCase)

// Compare and decide
const comparison = compare(baseline, candidateRun)
const decision = decide(comparison)

if (decision.action === "promote") {
  console.log("Skill promoted!")
} else {
  console.log("Skill rejected:", decision.reason)
}
```

## 5. Skill Lifecycle

```
Discovered (via proposal)
    ↓
Created in experiment worktree
    ↓
Evaluated against benchmarks
    ↓
Promoted if metrics meet threshold
    ↓
Registered in skill registry
    ↓
Monitored for regression
    ↓
Retired if superseded
```

## 6. Configuration for Custom Skills

Add to `.opencode/opencode-self-improving-agent/config.yaml`:

```yaml
skills:
  custom_registry: true
  promotion_threshold:
    success_rate: 0.85
    max_regression: 0.05
  domains:
    - database
    - security
    - performance
```

## 7. Observing Skill Performance

```typescript
import { RoutingMemory } from "opencode-self-improving-agent"

const memory = new RoutingMemory()

// Record outcomes
memory.recordOutcome({
  task_id: "task-456",
  chosen_agent: "database-expert",
  expected_score: 85,
  actual_result: true,
  verification_score: 0.92,
  cost: 0.08,
  lesson: "Local expert sufficient for schema migrations"
})

// Query performance
const perf = memory.getPerformance("database-expert")
console.log(`Success rate: ${perf.success_rate * 100}%`)
console.log(`Avg cost: $${perf.avg_cost}`)
```