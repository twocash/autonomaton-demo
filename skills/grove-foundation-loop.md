---
name: grove-foundation-loop
description: The engineering discipline layer for the Grove Autonomaton Pattern. Guides agentic coding sessions through the five-stage invariant pipeline, zone governance, cognitive routing, provenance planning, and the seven architectural principles. Use when planning sprints, refactoring code, adding features, building from a Foundry-generated Sovereign Manifesto, or executing any multi-phase development work. Triggers on phrases like "Foundation Loop", "sprint", "refactor", "add feature", "Autonomaton", "pipeline compliance", "zone classification", "sovereign manifesto implementation", "evolution harvest", "provenance", or when development work requires structured planning with documentation, testing, and execution handoff.
---

# Grove Foundation Loop — The Autonomaton Engineering Discipline

> *"Design is philosophy expressed through constraint."*

The engineering discipline layer for the [Grove Autonomaton Pattern](https://the-grove.ai/autonomaton). Guides development through the five-stage invariant pipeline, zone governance, cognitive routing, provenance planning, and the seven architectural principles — whether building the [reference implementation](https://github.com/twocash/grove-autonomaton-pattern) or implementing a Foundry-generated Sovereign Manifesto. Extensible to any domain, any stack, any scale.

Produces 9 planning artifacts, embeds automated testing as continuous process, enables clean handoff to execution agents, includes session continuity for multi-sprint initiatives, and harvests evolution opportunities throughout every coding session.

**The Foundation Loop is itself an Autonomaton.** It observes the coding session (telemetry), classifies work (recognition), assembles context (compilation), gates decisions (approval), and produces artifacts (execution). The methodology embodies the pattern it governs.

---

## Canonical References

Every section traces to source documentation. These links serve triple duty: provenance for the methodology, discovery for engineers encountering the pattern, and immediate access to working code.

| Resource | URL | Purpose |
|----------|-----|---------|
| Autonomaton Playground | [the-grove.ai/autonomaton](https://the-grove.ai/autonomaton) | Live demo — proves the 9 claims |
| Pattern Document | [the-grove.ai](https://the-grove.ai) | Full architectural specification |
| GitHub Repository | [github.com/twocash/grove-autonomaton-pattern](https://github.com/twocash/grove-autonomaton-pattern) | Reference implementation source |
| Pipeline Orchestrator | [pipeline-orchestrator.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/pipeline-orchestrator.ts) | The five-stage invariant in code |
| Cognitive Router | [cognitive-router.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/cognitive-router.ts) | Intent classification engine |
| Cognitive Adapter | [CognitiveAdapter.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/CognitiveAdapter.ts) | Provider-agnostic LLM factory |
| Routing Config | [routing.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/config/routing.ts) | Intent → Tier → Zone mapping |
| Zone Schema | [zones.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/config/zones.ts) | Green/Yellow/Red governance |
| Provenance Hashing | [provenance.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/utils/provenance.ts) | Deterministic audit trail |
| Prompt Pipeline | [prompts.schema.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/config/prompts.schema.ts) | Declarative prompt engineering |
| The Grove Foundation | [the-grove.ai](https://the-grove.ai) | Cognitive sovereignty initiative |
| License | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Open because the thesis requires it |

---

## Core Principles

The Foundation Loop implements eight architectural principles. Every gate, every artifact, every decision traces back to one or more of these.

| Principle | Implementation |
|-----------|---------------|
| **Pipeline Invariant** | Every feature maps to one or more of the 5 stages: Telemetry → Recognition → Compilation → Approval → Execution |
| **Declarative Governance** | Behavior lives in config files, not imperative code. If a domain expert can't change it via config, you've violated the architecture |
| **Zone Sovereignty** | Every capability is explicitly Green/Yellow/Red classified before implementation |
| **Cognitive Agnosticism** | The cognitive layer is a swappable dependency. Intelligence lives in structure, not in any specific model |
| **Feed-First Telemetry** | Every action produces structured, auditable traces as a byproduct of operation |
| **Provenance as Infrastructure** | A fact without a root is a weed. Every decision traces to source. Every action produces a hashable audit record |
| **Digital Jidoka** | Fail fast, fail loud, propose the fix. No confident output from an uncertain pipeline |
| **Transparency by Construction** | Governance is a structural consequence of the architecture, not a compliance layer bolted on afterward |

> **The Autonomaton Invariant:** The five-stage pipeline is the structural constant. Surfaces, models, skills, and capabilities change. The pipeline doesn't. If your code doesn't know which stage it serves, it doesn't belong in the architecture.

---

## The Five Agentic Coding Directives

These are hard gates. Every Sovereign Manifesto generated by the Foundry includes them. The Foundation Loop makes them mandatory for all Autonomaton-patterned development.

1. **Honor the Pipeline** — Every user interaction flows through all 5 stages: Telemetry → Recognition → Compilation → Approval → Execution. Do not bypass.
2. **No Hardcoded Cognition** — Never make direct LLM calls outside the adapter layer. All cognitive routing goes through the [Cognitive Router](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/cognitive-router.ts).
3. **Config Before Code** — Update `zones.schema` and `routing.config` before writing execution code. Behavior lives in config.
4. **Default to Yellow** — When uncertain about a new capability's risk level, default to Yellow Zone (human approval required). Earn Green through demonstrated reliability.
5. **The Litmus Test** — If a non-technical domain expert can't change the behavior via a config file, you've violated the architecture.

**Anti-Pattern Table:**

| Violation | What It Looks Like | Correct Approach |
|-----------|-------------------|-----------------|
| Pipeline bypass | Direct API call from UI component | Route through [pipeline-orchestrator](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/pipeline-orchestrator.ts) |
| Hardcoded cognition | `await anthropic.messages.create()` in a component | Use [CognitiveAdapter](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/CognitiveAdapter.ts) factory |
| Code before config | Writing handler logic before updating routing.config | Define intent in [routing config](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/config/routing.ts), then implement handler |
| Defaulting to Green | New untested capability auto-executes | Start in Yellow, earn Green through demonstrated reliability |
| Config-hostile | Behavior requires code change to modify | Externalize to declarative config |
| Silent failure | Error caught and swallowed without telemetry | Surface via [Digital Jidoka](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/components/Diagnostic/DiagnosticCard.tsx) with diagnostic context |
| Provenance gap | Action executes without producing an audit trace | Every pipeline stage must produce a structured [telemetry entry](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/state/types.ts) |

---

## Tier Selection

Right-size methodology to task complexity. The Foundation Loop's own Cognitive Router.

| Tier | Duration | When to Use | Artifacts |
|------|----------|-------------|-----------|
| **Quick Fix** | < 1 hour | Bug fixes, typos, config tweaks, single-file changes | DEVLOG only |
| **Feature** | 1-4 hours | Contained feature work, new intent, new component | SPEC + DEVLOG |
| **Sprint** | 1-3 days | Refactoring, new systems, multi-file changes, architectural work | Full 9 artifacts |

**Quick Fix** still runs Gate 4 (Pipeline Mapping) and Gate 5 (Zone Classification). Even small changes need to know which pipeline stage they serve and which zone they belong to.

---

## Context Detection

The Foundation Loop detects its operating mode from project artifacts. No manual mode selection required.

**Mode A: Reference Implementation Development**
- Detected by: `CLAUDE.md` in project root with canonical component registry
- Contract source: `CLAUDE.md` + existing sprint artifacts in `docs/sprints/`
- Context: Building or extending the [Autonomaton Pattern Playground](https://github.com/twocash/grove-autonomaton-pattern) itself

**Mode B: Sovereign Manifesto Implementation**
- Detected by: A `sovereign-manifesto-*.html` file in the project (Foundry output)
- Contract source: The Manifesto HTML — it contains zones, routing, anti-patterns, agentic coding directives, and audit ledger schema
- Context: Building a new Autonomaton from a Foundry-generated architectural blueprint

**Mode C: Greenfield**
- Detected by: Neither `CLAUDE.md` nor Sovereign Manifesto present
- Contract source: The seven principles above + this skill
- Context: Starting from scratch. The Loop guides toward pattern compliance incrementally

> The Foundry doesn't just generate a spec. It generates a spec that the Foundation Loop already knows how to support — and that engineers can extend in innumerable ways for their own domains, surfaces, and use cases.

---

## Gate Phases (Mandatory Pre-Planning)

Six gates run before any artifact production. All six are mandatory for Sprint-tier work. Quick Fix requires G4 + G5. Feature requires G2 through G6.

### Gate 1: Contract Detection

Scan the project root. Identify the governing contract.

- `CLAUDE.md` present → **Mode A**. Read the canonical component registry.
- `sovereign-manifesto-*.html` present → **Mode B**. Read the Manifesto as the binding contract.
- Neither → **Mode C**. Start from principles. Document the initial architecture in SPEC.md.

This gate runs automatically. The Loop reads context and routes — exactly how the [Cognitive Router](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/cognitive-router.ts) works in the pattern itself.

### Gate 2: Pattern Check

**This phase gates all other work. Do not proceed without completing it.**

Before creating ANY sprint artifacts, map requirements to existing patterns.

**Mode A:** Read `CLAUDE.md` for the canonical component registry. For each requirement, answer: does an existing component handle this need?

**Mode B:** Read the Sovereign Manifesto. For each requirement, answer: does the zone schema, routing config, or anti-patterns section already address this?

**Mode C:** Review any existing codebase. Document what exists, what's hardcoded that should be declarative, what's missing.

For each requirement, complete:

```markdown
## Patterns Extended

| Requirement | Existing Pattern? | Extension Approach |
|-------------|-------------------|-------------------|
| [Describe need] | [Pattern name or "None"] | [How to extend, or why new] |
```

**Warning signs — stop and reconsider if your plan involves:**

- Creating a new state management system when the reducer pattern exists
- Making direct LLM API calls outside the Cognitive Adapter
- Creating a new config file format instead of extending routing.config or zones.schema
- Writing `if (intent === 'foo')` conditionals instead of declarative routing
- Building telemetry/monitoring parallel to existing TelemetryStream
- Creating a new React Context or Provider when state belongs in the central reducer

### Gate 3: Canonical Source Audit

Features have canonical homes. Other surfaces invoke them, not recreate them.

**The Principle:** Every time we copy instead of invoke, we create two places to update, two places to test, and two places that will drift apart.

Before writing SPEC.md, complete:

```markdown
## Canonical Source Audit

| Capability Needed | Canonical Home | Current Approach | Recommendation |
|-------------------|----------------|------------------|----------------|
| [What we need] | [Where it lives or "None"] | [Existing duplication?] | [PORT/EXTEND/CREATE] |
```

**Decision framework:**

| Situation | Action |
|-----------|--------|
| Canonical exists, we're duplicating | **PORT** — Delete duplicate, invoke canonical |
| Canonical exists, needs variant | **EXTEND** — Add variant prop to canonical |
| Canonical exists, not reusable | **REFACTOR** — Make canonical reusable first |
| No canonical exists | **CREATE** — Build it right, in the right place |

**Mode A canonical homes** (reference implementation):

| Capability | Canonical Home |
|------------|----------------|
| Audit logging | [TelemetryStream.tsx](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/components/Telemetry/TelemetryStream.tsx) |
| State management | [state/reducer.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/state/reducer.ts) |
| Config editing | [ConfigEditor.tsx](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/components/Config/ConfigEditor.tsx) |
| Pipeline visualization | [PipelineVisualization.tsx](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/components/Pipeline/PipelineVisualization.tsx) |
| Intent classification | [cognitive-router.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/cognitive-router.ts) |
| LLM execution | [CognitiveAdapter.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/CognitiveAdapter.ts) |
| Pipeline lifecycle | [pipeline-orchestrator.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/pipeline-orchestrator.ts) |
| Zone governance | [zones.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/config/zones.ts) |
| Cognitive routing | [routing.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/config/routing.ts) |
| Provenance hashing | [provenance.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/utils/provenance.ts) |

```markdown
### No Duplication Certification

I confirm this sprint does not create parallel implementations of existing capabilities.
```

### Gate 4: Pipeline Mapping

**The killer gate. If you can't explain which pipeline stage your code serves, you haven't thought about it enough.**

The five-stage pipeline is the structural constant of every Autonomaton. It doesn't change when models improve, surfaces change, or capabilities change. Every feature maps to one or more stages.

Before writing SPEC.md, complete:

```markdown
## Pipeline Mapping

| Feature/Capability | Pipeline Stage | Justification |
|--------------------|---------------|---------------|
| [What we're building] | [Telemetry/Recognition/Compilation/Approval/Execution] | [Why it belongs here] |

### Stage Coverage Check

- [ ] Telemetry: Does this feature generate structured telemetry?
- [ ] Recognition: Does the Cognitive Router know about this intent?
- [ ] Compilation: Does this feature use the skill cache / context assembly?
- [ ] Approval: Is this feature zone-classified?
- [ ] Execution: Does execution produce auditable traces?
```

> See: [Pipeline Orchestrator](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/services/pipeline-orchestrator.ts) — every interaction in the reference implementation traverses this exact sequence.

### Gate 5: Zone Classification

Every new capability gets explicitly zone-classified before implementation. No exceptions.

```markdown
## Zone Classification

| Capability | Zone | Rationale | Flywheel Eligible? |
|------------|------|-----------|-------------------|
| [Action name] | Green/Yellow/Red | [Why this zone] | Yes/No |

### Governance Verification

- [ ] All new capabilities have explicit zone classification
- [ ] No Red Zone capabilities are auto-executing
- [ ] Yellow Zone capabilities have approval UI
- [ ] Green Zone capabilities have telemetry logging
- [ ] Zone boundaries are in config, not hardcoded
- [ ] Red Zone capabilities are marked flywheel_eligible: false
```

> See: [zones.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/config/zones.ts) — the `flywheel_eligible` property is the governance lock that prevents destructive operations from ever becoming automated skills.

### Gate 6: Provenance Planning

**This is the gate CTOs need to see.** Every pipeline built with the Foundation Loop produces an inherent audit trail — not because you added compliance tooling, but because provenance is a structural consequence of the architecture.

The EU AI Act (August 2026), Colorado AI Act (June 2026), and SEC governance mandates all require traceability, explainability, and audit trails. Systems built with the Foundation Loop produce these as a byproduct of operation. Governance as a design property, not a compliance cost.

Before implementation, complete:

```markdown
## Provenance Plan

| Pipeline Stage | What Gets Traced | Trace Format | Storage |
|---------------|-----------------|--------------|---------|
| Telemetry | [Input capture, source metadata] | [Structured JSON] | [Telemetry log] |
| Recognition | [Intent, confidence, tier selection] | [Routing decision record] | [Telemetry log] |
| Compilation | [Context assembled, skills matched] | [Compilation manifest] | [Telemetry log] |
| Approval | [Zone check, human decision, timestamp] | [Approval record] | [Telemetry log] |
| Execution | [Model used, tokens, cost, response hash] | [Execution receipt] | [Telemetry log] |

### Provenance Verification

- [ ] Every pipeline stage produces a structured trace entry
- [ ] Every entry includes: timestamp, intent, tier, zone, model, cost, hash
- [ ] An auditor can reconstruct any decision from telemetry alone
- [ ] Provenance hashes are deterministic (same input → same hash)
- [ ] Config changes are version-controlled with rationale
- [ ] Skill approvals are logged with human identity and timestamp
- [ ] No "confident output from uncertain pipeline" — uncertainty is surfaced
```

> See: [provenance.ts](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/utils/provenance.ts) — deterministic hash generation linking intent → model → outcome.

---

## Domain Contracts

Some projects have additional binding requirements beyond the base Foundation Loop. When building from Foundry output, the Sovereign Manifesto IS the domain contract.

**When a Sovereign Manifesto is present:**

1. The Manifesto HTML is the binding architectural contract
2. Its zone schema defines governance boundaries
3. Its routing config defines cognitive tier mapping
4. Its anti-patterns section defines architectural violations
5. Its agentic coding directives are binding
6. Its audit ledger schema defines the provenance format
7. **Its declarations map 1:1 to your test suite.** Every zone entry is a governance test. Every routing rule is a classification assertion. Every anti-pattern is a regression test. The Manifesto doesn't describe what to test — it IS the test spec, expressed as config.

Every SPEC.md must include:

```markdown
## Domain Contract

**Contract source:** [Sovereign Manifesto filename or "CLAUDE.md (internal)" or "None (greenfield)"]
**Zone schema:** [Green/Yellow/Red summary from contract]
**Routing tiers:** [Tier mapping summary from contract]
**Provenance format:** [Audit ledger schema from contract]
**Anti-patterns:** [Key violations to avoid from contract]
**Test derivation:** [Number of zone tests + routing tests + anti-pattern regression tests derived from contract]
```

---

## Build Phases (Artifact Production)

Eight phases produce the 9 sprint artifacts. Gate outputs feed directly into SPEC.md.

### Build 1: Repository Audit

Analyze current state: files, architecture, patterns, technical debt.

**Autonomaton check:** Identify what's hardcoded that should be declarative. Flag any pipeline bypasses, zone violations, or provenance gaps.

→ Output: `REPO_AUDIT.md`

### Build 2: Specification

Define goals, non-goals, acceptance criteria. Include all Gate outputs (Pattern Check, Canonical Audit, Pipeline Mapping, Zone Classification, Provenance Plan, Domain Contract).

**Autonomaton check:** Are acceptance criteria testable against the pipeline? Can zone governance be verified without code changes?

→ Output: `SPEC.md`

### Build 3: Architecture

Design target state: data structures, file organization, API contracts, pipeline stage mappings.

**Autonomaton check:** Is domain logic in configuration? Is the engine cognitively agnostic? Does the architecture produce provenance as a byproduct?

→ Output: `ARCHITECTURE.md`

### Build 4: Migration Planning

Plan path: files to create/modify/delete, execution order, rollback plan.

**Autonomaton check:** Does each migration step preserve pipeline integrity? Are zone boundaries maintained throughout?

→ Output: `MIGRATION_MAP.md`

### Build 5: Decisions

Document architectural choices using ADR format with rejected alternatives.

**Autonomaton check:** Do decisions preserve cognitive agnosticism? Do they maintain provenance chains? Document the zone-classification rationale for each decision.

→ Output: `DECISIONS.md`

### Build 6: Story Breakdown

Create executable plan: epics, stories, commit sequence, build gates.

**MANDATORY:** Every epic MUST include:
- Which pipeline stage(s) the work serves
- Zone classification for new capabilities
- Test tasks derived from the governing contract (Manifesto or CLAUDE.md)
- Build gate commands

**When a Sovereign Manifesto is present:** derive the test scaffold directly from its declarations. Every zone entry, routing rule, escalation trigger, and anti-pattern should have a corresponding test. The contract IS the test spec.

```markdown
## Epic N: {Feature}

### Story N.1: Implement {feature}
**Pipeline Stage:** [Which of the 5 stages]
**Zone:** [Green/Yellow/Red]
**Task:** ...
**Tests derived from contract:**
- Zone: [zone declaration] → test that governance behaves correctly
- Routing: [routing rule] → test that intent classifies to correct tier
- Anti-pattern: [anti-pattern] → regression test ensuring config-driven behavior
- Provenance: [audit entry] → test that trace is produced with correct schema
- Pipeline: Does the interaction traverse all 5 stages?

### Build Gate
```bash
npm run build
npm test
```
```

→ Output: `SPRINTS.md`

### Build 7: Execution Prompt

Create self-contained handoff with context, code samples, verification commands. Include all Gate outputs for context reconstruction.

**Include:** The Autonomaton Compliance Matrix as the final verification checklist.

→ Output: `EXECUTION_PROMPT.md`

### Build 8: Execution

Hand off `EXECUTION_PROMPT.md`, track progress in `DEVLOG.md`. Run the Evolution Harvest continuously during implementation.

→ Output: `DEVLOG.md` (updated throughout execution)

---

## The Evolution Harvest

**The Foundation Loop doesn't just guide development of Autonomaton-patterned systems — it performs the pattern during engineering.**

Every coding session generates a telemetry stream of decisions, fixes, workarounds, and capability gaps. The Evolution Harvest captures these as structured proposals. This is the mechanism that ensures self-evolution is designed in from the first sprint, not bolted on at the end.

The Evolution Harvest runs continuously throughout all phases. The DEVLOG is the harvest log.

### Category 1: Jidoka Opportunities (Self-Identifying)

Moments where the software fails silently or degrades without surfacing diagnostic context.

**Scan triggers:**
- Error caught and swallowed without telemetry entry
- Fallback logic that hides the failure from the user
- Missing confidence thresholds on classification decisions
- No diagnostic context attached to error states
- Pipeline stages that can produce "confident output from uncertain pipeline"

```markdown
### Evolution Candidate: Jidoka

**Observed:** [What the code does now]
**Gap:** [What diagnostic information is missing]
**Proposed:** [Digital Jidoka subsystem that would detect and surface this]
**Implementation:** [Which pipeline stage, what telemetry entry, what halt condition]
**Priority:** [Critical/High/Medium — based on user impact of silent failure]
```

### Category 2: Kaizen Opportunities (Self-Fixing)

Repetitive manual corrections that the system could propose automatically.

**Scan triggers:**
- Developer manually editing routing.config to fix misclassification
- Same bug fixed more than once across sessions
- Threshold values tuned by hand rather than learned from telemetry
- Zone boundaries that needed human override repeatedly
- Config patterns that get copy-pasted across intents

```markdown
### Evolution Candidate: Kaizen

**Pattern:** [The repetitive manual fix observed]
**Frequency:** [How often this correction has been made]
**Proposed:** [Automated detection + fix-proposal mechanism]
**Implementation:** [Which config file, what threshold, what trigger condition]
**Zone:** [Yellow — all Kaizen proposals require human approval]
```

### Category 3: Flywheel Opportunities (Self-Authoring)

Capability gaps the system could fill by learning from its own telemetry.

**Scan triggers:**
- Ad-hoc queries that don't match any defined intent (repeated)
- Users consistently requesting capabilities the routing config doesn't cover
- Patterns in telemetry that suggest a new skill could be extracted
- Features that work but aren't captured as reusable skills
- Successful interactions that could be cached at a lower tier

```markdown
### Evolution Candidate: Flywheel

**Observed Pattern:** [What users keep doing that isn't captured]
**Proposed Skill:** [Name and description]
**Tier Migration:** [Current tier → Target tier after skill extraction]
**Implementation:** [routing.config entry, skill definition, cache strategy]
**Flywheel Stage:** [Which of the 6 stages: Observe/Detect/Propose/Approve/Execute/Refine]
```

### Triage Gate

At session end (or during DEVLOG updates), evolution candidates get triaged:

| Category | Action | Who Decides |
|----------|--------|-------------|
| Jidoka (Critical) | Add to current sprint as hotfix | Engineer (Green Zone) |
| Jidoka (High/Medium) | Add to next sprint backlog | Engineer (Yellow Zone) |
| Kaizen | Surface as proposal in next sprint SPEC | Loop proposes, human approves |
| Flywheel | Log as skill candidate for pattern detection | System proposes via Flywheel, human approves |

**Why this matters:** If the engineering methodology doesn't surface evolution opportunities during development, the resulting software won't surface them during operation. The discipline creates the capability. The Foundation Loop that watches for self-healing moments produces software that watches for self-healing moments.

---

## Autonomaton Compliance Matrix

Ship-gate checklist. Before any sprint merges, verify:

```markdown
## Autonomaton Compliance Matrix

| # | Claim | Sprint Impact | Verified |
|---|-------|--------------|----------|
| 1 | Pipeline Invariant — every interaction traverses all 5 stages | [Advances/Preserves/N/A] | [ ] |
| 2 | Cognitive Router dispatches to tiers via declarative config | [Advances/Preserves/N/A] | [ ] |
| 3 | Declarative config defines all behavior — no hardcoded domain logic | [Advances/Preserves/N/A] | [ ] |
| 4 | Zone governance enforces Green/Yellow/Red boundaries | [Advances/Preserves/N/A] | [ ] |
| 5 | Skill Flywheel turns through telemetry — patterns become skills | [Advances/Preserves/N/A] | [ ] |
| 6 | The Ratchet — architecture enables downward tier migration | [Advances/Preserves/N/A] | [ ] |
| 7 | Transparency by construction — governance is structural | [Advances/Preserves/N/A] | [ ] |
| 8 | Model independence — cognitive layer is swappable | [Advances/Preserves/N/A] | [ ] |
| 9 | Digital Jidoka — fail fast, fail loud, propose the fix | [Advances/Preserves/N/A] | [ ] |
| 10 | Provenance — every decision traceable, every action auditable | [Advances/Preserves/N/A] | [ ] |
```

### The Quality Gate

*"Design is philosophy expressed through constraint."*

Does this sprint express a philosophical position through structural constraint? If not, it's not done.

---

## Testing Philosophy

Testing is a continuous process, not a terminal phase.

```
Code Change → Tests Run → Results → Unified View
                                        ↓
                              Pass ✅ Ship / Fail 🚫 Block
```

### The Manifesto IS the Test Spec

The Sovereign Manifesto's declarations map 1:1 to unit tests. This is not a metaphor — it's a structural property. Every declaration in the zone schema, routing config, and anti-patterns section is a testable assertion waiting to be written.

**Zone schema → governance tests:**

```yaml
# From the Manifesto's zone schema:
zones:
  green:
    - parse_known_format
    - write_structured_json
  yellow:
    - add_parsing_rule
    - modify_field_mappings
  red:
    - delete_source_data
    - modify_tier_routing
```

```typescript
// Each line IS a test case:
test('parse_known_format executes autonomously (Green)', async () => {
  const result = await pipeline.execute('parse_known_format');
  expect(result.zone).toBe('green');
  expect(result.status).toBe('completed'); // No approval gate
});

test('add_parsing_rule requires human approval (Yellow)', async () => {
  const result = await pipeline.execute('add_parsing_rule');
  expect(result.zone).toBe('yellow');
  expect(result.status).toBe('pending_approval');
});

test('delete_source_data is blocked (Red)', async () => {
  const result = await pipeline.execute('delete_source_data');
  expect(result.zone).toBe('red');
  expect(result.status).toBe('info_only');
});
```

**Routing config → classification tests:**

```yaml
# From the Manifesto's routing config:
routing:
  tier_0:
    - regex_pattern_match
  tier_1:
    - fuzzy_format_detect
  tier_3:
    - unknown_format_analysis
escalation_triggers:
  - confidence_below: 0.7
```

```typescript
test('regex_pattern_match routes to Tier 0 (free, local)', async () => {
  const decision = classifyIntent('parse invoice with known format', config);
  expect(decision.tier).toBe(0);
  expect(decision.cost).toBe(0);
});

test('confidence below 0.7 escalates to higher tier', async () => {
  const decision = classifyIntent('ambiguous input', config);
  expect(decision.confidence).toBeLessThan(0.7);
  expect(decision.tier).toBeGreaterThanOrEqual(2);
});
```

**Anti-patterns → regression tests:**

```typescript
// From the Manifesto: "MUST be declarative, not hardcoded"
test('format detection uses config, not hardcoded conditionals', () => {
  // If this test requires code changes to add a new format,
  // the architecture is violated. Adding a format should be
  // a config-only operation.
  const formats = loadFormats('formats.config');
  expect(formats).toContainKey('invoice');
  // Adding 'receipt' should require only a config change:
  formats.receipt = { indicators: ['Receipt'], parser: 'receipt_v1' };
  expect(classifyFormat('Receipt #123', formats)).toBe('receipt');
});
```

**The implication:** When a Sovereign Manifesto is present, the Foundation Loop should generate a test scaffold as part of Build 6 (Story Breakdown). Every zone declaration, routing rule, escalation trigger, and anti-pattern becomes a named test. The test suite is derived from the contract, not invented by the developer.

**Pattern-native tests for Autonomaton systems:**

- **Pipeline compliance:** Does every interaction traverse all 5 stages?
- **Zone governance:** Do Green actions auto-execute, Yellow pause, Red block?
- **Config mutation:** Does editing routing.config change behavior without code changes?
- **Skill Flywheel:** Does pattern repetition trigger skill proposals?
- **Telemetry integrity:** Does every interaction produce a structured audit entry?
- **Provenance:** Can an auditor reconstruct any decision from telemetry alone? Are provenance hashes deterministic?
- **Manifesto compliance:** Does every declaration in the contract have a corresponding passing test?

**Test philosophy: Behavior over implementation.**

```typescript
// WRONG — testing implementation details
expect(element).toHaveClass('translate-x-0');
expect(state.isOpen).toBe(true);

// RIGHT — testing user-visible behavior
await expect(pipeline).toBeVisible();
await expect(page.getByText('Approval Required')).toBeVisible();
```

> See: [TelemetryStream "Copy as Jest Test"](https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/components/Telemetry/TelemetryStream.tsx) — the reference implementation generates deterministic test stubs directly from telemetry entries.

---

## Sprint Artifact Location

**All Foundation Loop artifacts MUST be written directly to the project repository.**

```
{project-root}/docs/sprints/
├── ROADMAP.md                    ← Multi-sprint master plan
├── CONTINUATION_PROMPT.md        ← Initiative-level session handoff
└── {sprint-name}/
    ├── INDEX.md                  ← Sprint navigation
    ├── REPO_AUDIT.md
    ├── SPEC.md
    ├── ARCHITECTURE.md
    ├── MIGRATION_MAP.md
    ├── DECISIONS.md
    ├── SPRINTS.md
    ├── EXECUTION_PROMPT.md
    ├── DEVLOG.md
    └── CONTINUATION_PROMPT.md    ← Sprint-level handoff
```

**Anti-Pattern:**
```
❌ /home/claude/sprints/...
❌ /mnt/user-data/outputs/...
❌ Holding artifacts in conversation memory only
```

**Correct Pattern:**
```
✅ {project-root}/docs/sprints/{sprint-name}/...
✅ Write files as they are created, not at the end
✅ Confirm file creation with directory listing
```

---

## Session Continuity

### DEVLOG as Session Memory

The DEVLOG.md file serves as session-level memory and evolution harvest log:

- Record what was attempted (even if it failed)
- Document blockers and their resolutions
- Track build gate results
- Note decisions made during execution
- **Log evolution candidates as they're spotted (Jidoka/Kaizen/Flywheel)**

Future sessions read the DEVLOG to understand what happened, not just what was planned.

### CONTINUATION_PROMPT for Session Handoff

**Problem:** LLM context windows are finite. Long development sessions accumulate context until quality degrades.

**Solution:** The CONTINUATION_PROMPT.md artifact captures everything needed to resume work in a fresh context window.

**When to create:**
1. After planning phase (once other artifacts exist)
2. Before context window fills (proactive, not reactive)
3. At natural breakpoints (between epics, after major decisions)
4. Before ending a session

**Contents:**
- Project location (absolute path)
- What was accomplished (summary)
- Key decisions made (critical context)
- Sprint status (done vs. pending)
- Next actions (clear instructions)
- Files to read first (ordered list)
- **Evolution candidates surfaced (pending triage)**

**Usage:**
```
1. Ensure CONTINUATION_PROMPT.md is current
2. Open fresh context window
3. Paste: "Read {path}/CONTINUATION_PROMPT.md and follow instructions"
4. New session reconstructs context from artifacts
5. Work continues without loss
```

---

## The 9 Artifacts

Every sprint produces these in `docs/sprints/{sprint-name}/`:

| Artifact | Purpose |
|----------|---------|
| `REPO_AUDIT.md` | Current state analysis — what exists, what's hardcoded, what's missing |
| `SPEC.md` | Goals, non-goals, acceptance criteria + all Gate outputs |
| `ARCHITECTURE.md` | Target state, schemas, data flows, pipeline mappings |
| `MIGRATION_MAP.md` | File-by-file change plan, execution order, rollback |
| `DECISIONS.md` | ADRs explaining "why" with rejected alternatives |
| `SPRINTS.md` | Epic/story breakdown with pipeline stages, zone classifications, and tests |
| `EXECUTION_PROMPT.md` | Self-contained handoff with Compliance Matrix |
| `DEVLOG.md` | Execution tracking + Evolution Harvest log |
| `CONTINUATION_PROMPT.md` | Session handoff for fresh context windows |

---

## Quick Reference

**Sprint naming:** `{domain}-{feature}-v{version}` (e.g., `foundry-streaming-v2`)

**Commit format:** `{type}: {description}` where type is feat|fix|refactor|test|docs|chore|ci

**Gate sequence:** G1 (Contract) → G2 (Pattern) → G3 (Canonical) → G4 (Pipeline) → G5 (Zone) → G6 (Provenance)

**Build sequence:** B1 (Audit) → B2 (Spec) → B3 (Architecture) → B4 (Migration) → B5 (Decisions) → B6 (Stories) → B7 (Handoff) → B8 (Execute)

**Continuous:** Evolution Harvest runs throughout all phases

**Build gates after each epic:**
```bash
npm run build    # Compiles
npm test         # Unit + integration
```

---

## Terminology

| Term | Definition |
|------|-----------|
| **Pipeline** | The five-stage invariant: Telemetry → Recognition → Compilation → Approval → Execution |
| **Cognitive Router** | Dispatch layer that selects tier, zone, and model for each interaction |
| **Zone** | Governance classification: Green (autonomous), Yellow (supervised), Red (human-only) |
| **Tier** | Compute level: 0 (cache), 1 (cheap), 2 (premium), 3 (apex) |
| **Skill** | A learned pattern promoted to Tier 0 via the Flywheel |
| **Flywheel** | Six-stage learning loop: Observe → Detect → Propose → Approve → Execute → Refine |
| **Ratchet** | Architecture's natural dynamic toward cheaper, more local, more sovereign compute |
| **Digital Jidoka** | Fail-fast mechanism: stop, surface diagnostic context, propose fix |
| **Andon Cord** | Manual or automatic pipeline halt trigger for quality control |
| **Sovereign Manifesto** | Foundry-generated HTML spec: business case + compliance shield + coding directives |
| **Cognitive Adapter** | Provider-agnostic factory for LLM execution |
| **Provenance Hash** | Deterministic signature linking intent → model → outcome for audit |
| **Audit Ledger** | Structured telemetry stream recording every pipeline decision |
| **Trace Entry** | Single record: timestamp, intent, tier, zone, model, cost, hash, feedback |
| **Pipeline Signature** | Deterministic hash of the prompt schema used to generate a Manifesto |
| **Foundation Loop** | This methodology — itself an Autonomaton: observes, detects, proposes, evolves |
| **Evolution Harvest** | Continuous scan for Jidoka, Kaizen, and Flywheel opportunities during coding |
| **Evolution Candidate** | Structured proposal for self-improvement surfaced by the Harvest |
| **Gate Phase** | Pre-planning checkpoint (G1-G6) that must pass before artifact production |
| **Build Phase** | Artifact production phase (B1-B8) producing sprint documentation |

---

## Key Principles

1. **Contract Detection First** — Identify the governing contract before any other work
2. **Pattern Check First** — Read the contract source before planning ANY work
3. **Canonical Source Audit** — Features have homes; other surfaces invoke, not recreate
4. **Pipeline Mapping** — Every feature knows which stage it serves
5. **Zone Classification** — Every capability has explicit governance before implementation
6. **Provenance by Design** — Every action produces an auditable trace as a structural consequence
7. **Config Before Code** — Declarative sovereignty: domain logic in config, engine logic in code
8. **Default to Yellow** — Earn Green through demonstrated reliability
9. **Testing as Process** — Tests run continuously, verify pipeline compliance and provenance
10. **Evolution Harvest** — Surface Jidoka, Kaizen, and Flywheel opportunities during every session
11. **Sprints are Replayable** — EXECUTION_PROMPT is self-contained
12. **Artifacts in Repo** — All sprint files written directly to project, not memory
13. **Session Continuity** — CONTINUATION_PROMPT enables fresh context windows to resume work

---

*The Grove Autonomaton Pattern — [the-grove.ai](https://the-grove.ai) • [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) • The pattern is open because the thesis requires it.*
