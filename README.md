# Grove Autonomaton Pattern — Reference Implementation

> *"Design is philosophy expressed through constraint."*

Most AI agent architectures are built to do things. This one is built to prove something.

The Grove Autonomaton Pattern is a set of architectural commitments that make AI systems self-improving, governable, and sovereign by construction. Not through compliance layers bolted on afterward. Through structural design.

This repository is the reference implementation — working software that proves the pattern is viable. It runs entirely in the browser with no install required. You can open it now at **[the-grove.ai/autonomaton](https://the-grove.ai/autonomaton)**, bookmark it, or clone and run it locally. Bring your own API key when you're ready to run live inference.

---

## What this proves

Nine architectural claims, each demonstrable in under five minutes:

1. **The five-stage pipeline is invariant.** Every interaction traverses Telemetry → Recognition → Compilation → Approval → Execution — regardless of surface, complexity, or model.
2. **The Cognitive Router rightsizes compute on every call.** Four tiers (Tier 0 cache through Tier 3 apex) with distinct cost and sovereignty profiles. The system dispatches the minimum viable intelligence for each task.
3. **Declarative configuration defines all behavior.** Edit `routing.config` in the UI and behavior changes immediately. No code deployment. No restart.
4. **Sovereignty guardrails are structural, not aspirational.** Green executes autonomously. Yellow proposes and waits. Red surfaces information only. The zones are a schema, not a setting.
5. **The Skill Flywheel turns through telemetry.** Repeated patterns surface as candidate skills. One approval enables unlimited future executions. The system learns how you work.
6. **The Ratchet bends the cost curve downward.** As patterns migrate to cached skills, compute cost drops. More use equals lower cost. The architecture inverts the normal dynamic.
7. **Transparency comes free with the architecture.** Every decision traces to a declarative source. The audit trail is a byproduct of operation, not a separate system.
8. **Model independence is a sovereignty guarantee.** Swap Anthropic for OpenAI for Gemini — the pipeline doesn't care. Intelligence lives in structure, not in any specific model.
9. **Digital Jidoka surfaces failure honestly.** When the pipeline degrades, it stops and tells you why. No confident output from an uncertain system.

---

## Self-healing vs. self-evolving

Most systems that claim to "learn" mean one of two things: they get better at predicting, or someone manually retrains them. Neither is what the Autonomaton pattern means.

**Self-healing** is Jidoka. The system detects its own failures, stops, surfaces diagnostic context, and proposes a fix. The pipeline doesn't degrade silently — it pulls the andon cord. This demo shows it: trigger a failure and watch the system surface exactly what broke and why.

**Self-evolving** is the Flywheel, and it's a different claim entirely. The mechanism:

1. Every interaction generates structured telemetry — intent, tier, zone, cost, outcome.
2. The system watches for recurrence. The same normalized pattern appearing 3+ times becomes a candidate skill.
3. The system proposes the skill: *"You always research the company before meetings. Want me to do that automatically?"*
4. One Yellow-zone approval converts the pattern into a named skill.
5. The skill migrates to Tier 0 — it's now a cached, free, instantaneous part of how the system works.
6. In production, you can configure the system to handle unroutable intents by dispatching them to Tier 3 inference — which drafts a new capability spec, proposes it for approval, and builds it when approved. The self-authoring loop is a configuration choice, not a hardcoded behavior. You decide what the system is allowed to attempt on its own.

The demo shows steps 1–5. Step 6 — the system authoring net-new capabilities in response to gaps — requires a real deployment pipeline and is where the full pattern goes beyond what a browser demo can contain. The Foundry is the closest proxy: describe what you need, get back the spec and the agentic coding directives that govern building it. The pattern's self-authorship, partially externalized.

The structural insight behind all of it: because behavior lives in declarative config and not in code, the system can propose changes to its own governance without touching the engine. The intelligence compounds. The architecture stays auditable. Those two things are usually in tension. Here they're the same mechanism.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The guided tutorial walks you through the pattern in three steps.

No API key required in demo mode.

---

## Operating modes

**Demo mode** (default) — Fully simulated responses. No API key, no network calls, no backend. Runs entirely in your browser. Every architectural claim still holds.

**Interactive mode** — Real inference against your model of choice. Keys are held in browser memory only and never persisted. Switch providers mid-session without reloading.

**Foundry mode** — Describe your application. The Foundry streams a complete architectural specification in real time — routing config, zones schema, audit ledger structure, anti-patterns, and agentic coding directives written specifically for AI coding assistants.

The output is a Sovereign Manifesto: a single HTML document that is simultaneously a human-readable architecture spec and a machine-readable governance contract. Paste it into Claude Code or Cursor and your coding assistant will know which operations require human approval, which patterns belong in config versus code, and which behaviors are architecturally forbidden. The pattern propagates forward into every line of code the AI writes.

Describe an app. Get back the blueprint that governs how it gets built — by humans and AI alike.

---

## Cognitive providers

This release ships with adapters for Anthropic, OpenAI, and Google. The CognitiveAdapter is a thin factory — adding a new provider means implementing one function. Route through OpenRouter for access to the full model landscape. Point it at a local Ollama instance for fully sovereign inference. Swap providers per tier so cheap calls go local and apex calls go cloud.

The pattern doesn't care what's behind each tier. It validates outputs against structure. When a better or cheaper model becomes viable for a task, it's a config update, not a rewrite.

---

## Engineering toolkit

This repository is a demo and an engineering system. Three tools work together:

**The Foundry** generates the architectural contract. Describe your application in the Foundry tab. It streams a complete Sovereign Manifesto — routing config, zones schema, audit ledger structure, anti-patterns, and agentic coding directives — as a single HTML document. That document is simultaneously a human-readable architecture spec, a machine-readable governance contract, and the source of truth for how the application gets built.

**The Foundation Loop** provides the engineering discipline. It's a sprint methodology purpose-built for Autonomaton-patterned systems. Six gate phases (Contract Detection → Pattern Check → Canonical Source Audit → Pipeline Mapping → Zone Classification → Provenance Planning) run before any code gets written. Eight build phases produce the sprint artifacts. The Evolution Harvest runs continuously throughout, scanning for self-healing, self-fixing, and self-authoring opportunities.

The Foundation Loop detects its own context. When it finds a `CLAUDE.md` in the project root, it reads the canonical component registry as its contract. When it finds a Sovereign Manifesto, it reads the Manifesto as the binding architectural contract. The Foundry generates the spec. The Foundation Loop knows how to build from it. Engineers can extend both in any direction for their own domains and use cases.

**The Evolution Harvest** ensures the software you build is the software that improves itself. During every coding session, the Foundation Loop watches for three categories of opportunity: Jidoka (the system could detect this failure automatically), Kaizen (this manual fix could be automated), and Flywheel (this repeated pattern could become a cached skill). Evolution candidates get logged to the DEVLOG and triaged at session boundaries. The engineering methodology embodies the pattern it governs — if the process doesn't surface self-improvement opportunities during development, the resulting software won't surface them during operation.

There's a property of this approach that nobody designed. It emerged from the architectural commitment to declaring behavior in config instead of code. Because zone boundaries, routing rules, escalation triggers, and anti-patterns all live in declarative schemas, those schemas are simultaneously the governance contract *and* the test specification. Every zone entry is a governance test. Every routing rule is a classification assertion. Every anti-pattern is a regression test. The Sovereign Manifesto doesn't describe what to test — it *is* the test suite, expressed as architecture. The test coverage comes free with the contract. That's what happens when transparency is structural rather than bolted on.

### Toolkit source files

| Tool | Location | Purpose |
|------|----------|---------|
| Foundry compiler | [`services/foundry-compiler.ts`](src/services/foundry-compiler.ts) | Tier 3 streaming PRD generator |
| Prompt pipeline | [`config/prompts.schema.ts`](src/config/prompts.schema.ts) | Declarative prompt engineering |
| Blueprint generator | [`utils/blueprint-generator.ts`](src/utils/blueprint-generator.ts) | Sovereign Manifesto HTML export |
| Pipeline orchestrator | [`services/pipeline-orchestrator.ts`](src/services/pipeline-orchestrator.ts) | The five-stage invariant in code |
| Cognitive router | [`services/cognitive-router.ts`](src/services/cognitive-router.ts) | Intent classification + skill cache |
| Cognitive adapter | [`services/CognitiveAdapter.ts`](src/services/CognitiveAdapter.ts) | Provider-agnostic LLM factory |
| Routing config | [`config/routing.ts`](src/config/routing.ts) | Intent → Tier → Zone mapping |
| Zone schema | [`config/zones.ts`](src/config/zones.ts) | Green/Yellow/Red governance |
| Provenance hashing | [`utils/provenance.ts`](src/utils/provenance.ts) | Deterministic audit trail |

### Sprint documentation

Implementation planning for this repository lives in `docs/sprints/autonomaton-demo-v1/`:

- [SPEC.md](docs/sprints/autonomaton-demo-v1/SPEC.md) — Goals and acceptance criteria
- [ARCHITECTURE.md](docs/sprints/autonomaton-demo-v1/ARCHITECTURE.md) — Component structure and data flows
- [DECISIONS.md](docs/sprints/autonomaton-demo-v1/DECISIONS.md) — Architectural decisions
- [SPRINTS.md](docs/sprints/autonomaton-demo-v1/SPRINTS.md) — Implementation breakdown

These artifacts were produced using the Foundation Loop methodology. They serve as both project documentation and a reference example of the methodology in practice.

---

## The pattern document

This repository proves the pattern works. The [Grove Autonomaton Pattern Brief](https://the-grove.ai) explains why it matters — the CS lineage, the governance architecture, the distributed vision, and the civilizational stakes of getting this right.

Read the brief. Then come back and edit `routing.config`.

The pattern is part of a larger initiative: [The Grove Foundation](https://the-grove.ai) — cognitive sovereignty for the AI era. The same architectural play the PC revolution made against mainframes, now applied to the $650B centralized AI infrastructure buildout.

---

## Discovery

The Autonomaton Pattern is one component of a larger architectural thesis. These resources trace the lineage.

| Resource | What it covers |
|----------|---------------|
| [the-grove.ai/autonomaton](https://the-grove.ai/autonomaton) | Live interactive demo — all 9 claims provable in 3 minutes |
| [The Grove Autonomaton Pattern Brief](https://the-grove.ai) | Full architectural specification: CS lineage, governance model, distributed vision |
| [The Grove Foundation](https://the-grove.ai) | Cognitive sovereignty initiative — the "why" behind the pattern |
| [Sovereign Manifesto sample](src/components/Foundry/FoundryPane.tsx) | The Foundry's output format — architecture spec + governance contract + coding directives |
| [Foundation Loop methodology](docs/sprints/) | Engineering discipline layer — sprint artifacts from this repository |
| CC BY 4.0 | The pattern is open because the thesis requires it |

**CS lineage:** Clark & Chalmers' Extended Mind thesis (1998), Toyota's Jidoka-Kaizen discipline, IBM's Autonomic Computing (2001), and Computational Reflection. The Autonomaton Pattern synthesizes these into a single architectural commitment: software that identifies its own issues, proposes its own fixes, and authors its own evolution — inside zones you control.

**Where this is going:** The Autonomaton is the individual-scale expression. DEX (declarative governance) and Trellis (distributed knowledge networks) are the larger follow-on architectures. Same pattern, different scale.

---

## License

CC BY 4.0 — The Grove Foundation.

The pattern is open because the thesis requires it. Distributed cognition that depends on a single vendor's implementation isn't distributed. This architecture must be replicable, inspectable, and independently operable for the network thesis to hold.

Build your own. Change it. Improve it. That's the point.

---

## Tech stack

React 18 + TypeScript, Vite, Tailwind CSS. No external state management. No backend. No infrastructure to stand up.

The architecture is the point. The stack is incidental.

---

*The Grove Autonomaton Pattern — [the-grove.ai](https://the-grove.ai) • CC BY 4.0*
