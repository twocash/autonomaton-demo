# Grove Autonomaton — Pattern Playground

A browser-based demonstration application that proves the core claims of the **Grove Autonomaton Pattern** through direct user interaction.

> *"Software that identifies its own issues, proposes its own fixes, and authors its own evolution — inside zones you control."*

## What This Proves

This demo proves 9 architectural claims from the Grove Autonomaton Pattern Brief:

1. **Five-Stage Pipeline Is Invariant** — Every interaction traverses Telemetry → Recognition → Compilation → Approval → Execution
2. **Cognitive Router Dispatches to Tiers** — Four tiers of intelligence with distinct cost and sovereignty profiles
3. **Declarative Configuration Defines Behavior** — Edit config files, behavior changes immediately (no deploy)
4. **Sovereignty Guardrails Enforce Zones** — Green auto-executes, Yellow pauses for approval, Red surfaces info only
5. **Skill Flywheel Turns Through Telemetry** — Repeated patterns become learned skills
6. **The Ratchet — Downward Migration** — Cost decreases as skills accumulate
7. **Transparency by Construction** — Full audit trail, reconstructable decisions
8. **Model Independence** — Swap the cognitive backend, architecture survives
9. **Digital Jidoka — Fail Fast** — Pipeline halts on failure with diagnostic context

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 and follow the 3-step guided tutorial.

## Operating Modes

**Demo Mode** (default): All responses simulated, no API key required. Runs entirely in your browser.

**Interactive Mode**: Bring your own API key for real LLM calls. Keys are stored in memory only, never persisted.

## Sprint Documentation

See `docs/sprints/autonomaton-demo-v1/` for full implementation planning:

- [SPEC.md](docs/sprints/autonomaton-demo-v1/SPEC.md) — Goals and acceptance criteria
- [ARCHITECTURE.md](docs/sprints/autonomaton-demo-v1/ARCHITECTURE.md) — Component structure and data flows
- [DECISIONS.md](docs/sprints/autonomaton-demo-v1/DECISIONS.md) — Architectural decisions
- [SPRINTS.md](docs/sprints/autonomaton-demo-v1/SPRINTS.md) — Implementation breakdown

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- No external state management (useReducer)
- No backend required

## License

CC BY 4.0 — The Grove Foundation

---

*The Grove Autonomaton Pattern • [thegrovefoundation.org](https://thegrovefoundation.org)*
