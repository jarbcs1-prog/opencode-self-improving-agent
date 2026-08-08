# Extension Points

Guide for extending the OpenCode Self-Improving Agent plugin.

## 1. Custom Agent Profiles

Register new agent profiles with specific capabilities:

```typescript
import { AgentRegistry, AgentProfile } from "opencode-self-improving-agent"

const registry = new AgentRegistry()

registry.register({
  name: "security-auditor",
  capabilities: ["security_audit", "vulnerability_scanning", "threat_modeling"],
  model: "big-pickle",
  cost_multiplier: 1.5,
  reliability_score: 0.98,
  max_context: 200000,
  tools: ["semgrep", "bandit", "osv-scanner"]
})

registry.register({
  name: "performance-engineer",
  capabilities: ["profiling", "optimization", "benchmarking"],
  model: "nemotron-3-ultra-free",
  cost_multiplier: 0.2,
  reliability_score: 0.85,
  max_context: 64000,
  tools: ["perf", "flamegraph", "hyperfine"]
})
```

## 2. Custom Evaluation Cases

Add domain-specific evaluation tests:

```typescript
import { EvaluationCase } from "opencode-self-improving-agent"

const customEvaluations: EvaluationCase[] = [
  {
    id: "security-scan",
    name: "Security Vulnerability Scan",
    command: "semgrep --config=auto --json=results.json src/",
    expectedExitCode: 0,
    timeoutMs: 180000
  },
  {
    id: "performance-benchmark",
    name: "Performance Regression Test",
    command: "hyperfine --warmup 3 'npm run benchmark'",
    expectedExitCode: 0,
    timeoutMs: 300000
  },
  {
    id: "type-check",
    name: "TypeScript Type Checking",
    command: "tsc --noEmit",
    expectedExitCode: 0,
    timeoutMs: 120000
  }
]
```

## 3. Custom Reflection Analyzer

Enhance reflection with LLM-based analysis:

```typescript
import { reflect, SystemEvent } from "opencode-self-improving-agent"
import { generateText } from "ai"

async function enhancedReflection(events: SystemEvent[]) {
  const base = reflect(events)

  // Use LLM for deeper analysis
  const { text } = await generateText({
    model: yourModel,
    prompt: `Analyze these events for friction, elegance, honesty and unseen layers:
${JSON.stringify(events, null, 2)}

Base reflection: ${JSON.stringify(base, null, 2)}

Provide additional insights in JSON format.`
  })

  return {
    ...base,
    llm_analysis: text
  }
}
```

## 4. Custom Pattern Detectors

Add domain-specific pattern detection:

```typescript
import { Trajectory, Pattern } from "opencode-self-improving-agent"

function detectSecurityPatterns(trajectories: Trajectory[]): Pattern[] {
  const patterns: Pattern[] = []

  // Detect security-related failures
  const securityFailures = trajectories.filter(t =>
    !t.success && t.events.some(e =>
      e.payload.error?.includes("security") ||
      e.payload.error?.includes("vulnerability") ||
      e.payload.error?.includes("permission")
    )
  )

  if (securityFailures.length >= 2) {
    patterns.push({
      type: "security-failure-loop",
      evidence: securityFailures.map(f => `${f.id}: security failure`)
    })
  }

  return patterns
}

// Register with learning pipeline
// (Modify learning/cycle.ts to include custom detectors)
```

## 5. Custom Proposal Generators

Generate specialized improvement proposals:

```typescript
import { Pattern, ImprovementProposal } from "opencode-self-improving-agent"

function createSecurityProposals(patterns: Pattern[]): ImprovementProposal[] {
  return patterns
    .filter(p => p.type === "security-failure-loop")
    .map(pattern => ({
      id: crypto.randomUUID(),
      category: "skill" as const,
      reason: "Security failure pattern detected. Create security audit skill.",
      evidence: pattern.evidence
    }))
}
```

## 6. Custom Sandbox Policies

Define execution policies for specific environments:

```typescript
import { SandboxPolicy } from "opencode-self-improving-agent"

const productionPolicy: SandboxPolicy = {
  allow_read: ["**"],
  allow_write: [".experiments/**", ".opencode/opencode-self-improving-agent/**"],
  allow_exec: [
    "npm test",
    "npm run build",
    "npm run lint",
    "tsc --noEmit",
    "cargo test",
    "go test ./..."
  ],
  deny: [
    "src/**",
    "plugins/**",
    "skills/**",
    "config/**",
    ".github/**",
    "docker-compose.yml"
  ],
  max_duration_ms: 600000,
  max_memory_mb: 2048
}
```

## 7. Custom Storage Backends

Implement alternative storage (database, cloud, etc.):

```typescript
import { Storage } from "opencode-self-improving-agent"

class DatabaseStorage extends Storage {
  constructor(private pool: Pool) {
    super("") // root not used
  }

  async readJsonLines<T>(name: string): Promise<T[]> {
    const result = await this.pool.query(
      `SELECT data FROM plugin_events WHERE name = $1 ORDER BY created_at`,
      [name]
    )
    return result.rows.map(r => r.data)
  }

  async appendJson(name: string, value: unknown) {
    await this.pool.query(
      `INSERT INTO plugin_events (name, data) VALUES ($1, $2)`,
      [name, value]
    )
  }
}
```

## 8. Hooks System

Register callbacks for plugin lifecycle events:

```typescript
import { SelfImprovementPlugin } from "opencode-self-improving-agent"

const plugin = SelfImprovementPlugin

// In your OpenCode config
export default {
  plugins: [
    {
      ...plugin,
      hooks: {
        onExperimentCreated: (experiment) => console.log("Experiment:", experiment.id),
        onExperimentPromoted: (experiment) => console.log("Promoted:", experiment.id),
        onExperimentRejected: (experiment) => console.log("Rejected:", experiment.id),
        onReflectionGenerated: (reflection) => console.log("Reflection:", reflection),
        onRoutingDecision: (decision) => console.log("Routed to:", decision.agent)
      }
    }
  ]
}
```