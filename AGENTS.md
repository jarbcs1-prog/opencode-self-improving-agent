# OpenCode Self-Improving Agent Plugin - AGENTS.md

## Project Overview
An OpenCode plugin providing adaptive self-evaluation, workflow improvement, and persistent project intelligence. Main entry: `src/index.ts` → `src/core/index.ts` (exports all public APIs).

## Key Commands
```bash
npm run build        # TypeScript compile (tsc)
npm run dev          # Watch mode (tsc --watch)
npm run test         # Run tests (vitest run)
npm run test:watch   # Watch tests
npm run lint         # ESLint on src/
npm run format       # Prettier on src/**/*.ts
```

## Architecture
- **Core**: Event bus, journal, storage, reflection engine (`src/core/`)
- **Routing**: Model router, agent registry, profiles, scoring (`src/routing/`)
- **Learning**: Trajectory, patterns, proposals, promotion, cycle (`src/learning/`)
- **Evaluation**: Runner, comparator, baseline, decision (`src/evaluation/`)
- **Isolation**: Git worktrees, experiments, lifecycle (`src/isolation/`)
- **Execution**: Sandbox policy, executor (`src/execution/`)
- **Delegation**: Planner (`src/delegation/`)
- **Config**: Schema + defaults (`src/config/schema.ts`)

## Test Structure
- Unit tests in `tests/unit/` using Vitest
- Run single test: `npx vitest run tests/unit/routing.test.ts`

## Configuration
Plugin config at `.opencode/opencode-self-improving-agent/config.yaml` (see `docs/configuration.md`). Key settings:
- `system.autonomy_level`: "supervised" (default) | "autonomous"
- `execution.sandbox`: "git-worktree" (default) | "none"
- `verification.required_for`: ["code_changes", "filesystem_mutations", "configuration_changes"]
- `evaluation.comparison_threshold`: 0.05 (5% improvement required)

## Extension Points (see `docs/extension-points.md`)
1. Custom Agent Profiles via `AgentRegistry.register()`
2. Custom Evaluation Cases via `EvaluationCase[]`
3. Custom Reflection Analyzers wrapping `reflect()`
4. Custom Pattern Detectors for `learning/cycle.ts`
5. Custom Proposal Generators for `ImprovementProposal[]`
6. Custom Sandbox Policies for `SandboxPolicy`
7. Custom Storage Backends extending `Storage`
8. Hooks: `onExperimentCreated`, `onExperimentPromoted`, `onExperimentRejected`, `onReflectionGenerated`, `onRoutingDecision`

## TypeScript Config (Strict)
- `strict: true`, `noUnusedLocals/Parameters: true`, `exactOptionalPropertyTypes: true`
- `noImplicitOverride: true`, `noUncheckedIndexedAccess: true`
- Output to `dist/` with declarations + source maps

## Key Exports (from `src/core/index.ts`)
- `EventBus`, `Journal`, `Storage`, `reflect`, `buildTrajectory`, `detectPatterns`, `createProposals`, `evaluatePromotion`, `runEvaluation`, `createBaseline`, `compare`, `decide`, `createExperiment`, `promote`, `reject`, `createWorktree`, `ModelRouter`, `AgentRegistry`, `scoreAgent`, `DEFAULT_PROFILES`, `Delegator`, `RoutingMemory`, `SandboxExecutor`, `PluginConfig`, `learningCycle`

## Environment Variables
- `OPENCODE_PLUGIN_CONFIG` - Config file path (default: `.opencode/opencode-self-improving-agent/config.yaml`)
- `OPENCODE_SELF_IMPROVEMENT_DIR` - Plugin state base dir
- `OPENCODE_EXPERIMENTS_DIR` - Experiment worktrees dir (default: `.experiments`)

## Gotchas
- No `vitest.config.ts` — uses Vitest defaults (tests in `tests/unit/`)
- Uses `@opencode-ai/plugin` as peer dependency
- Git worktree isolation required for experiments (`execution.sandbox: "git-worktree"`)
- Reflection defaults to `llm_enhanced: false` — enable for deeper analysis
- Memory backend is filesystem-only currently