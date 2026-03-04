# Sprint: Grove Autonomaton Pattern Playground

**Sprint ID:** `autonomaton-demo-v1`
**Status:** Ready for Execution
**Created:** 2026-03-04

---

## Quick Links

| Artifact | Purpose |
|----------|---------|
| [SPEC.md](./SPEC.md) | Goals, acceptance criteria, attention anchor |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Component structure, state design, data flows |
| [DECISIONS.md](./DECISIONS.md) | Architectural decisions (ADRs) |
| [SPRINTS.md](./SPRINTS.md) | Epic/story breakdown with build gates |
| [EXECUTION_PROMPT.md](./EXECUTION_PROMPT.md) | Self-contained handoff for execution |
| [DEVLOG.md](./DEVLOG.md) | Execution tracking and notes |

---

## Sprint Summary

**Goal:** Build a browser-based demo application that proves the 9 claims of the Grove Autonomaton Pattern through direct user interaction.

**Key Deliverables:**
1. Single-page React application with Vite + Tailwind
2. Five-stage pipeline visualization (hero element)
3. Live-editable configuration files with immediate effect
4. Zone governance (Green/Yellow/Red) with approval flows
5. Skill Flywheel with pattern learning
6. Cost dashboard with ratchet visualization
7. Full telemetry audit trail
8. 3-step guided tutorial

**Technical Stack:** React 18 + TypeScript + Vite + Tailwind CSS (minimal deps)

**Scope:** Single session implementation, no backend, browser-only

---

## The 9 Claims to Prove

1. Five-Stage Pipeline Is Invariant
2. Cognitive Router Dispatches to Tiers
3. Declarative Configuration Defines Behavior
4. Sovereignty Guardrails Enforce Zone Boundaries
5. Skill Flywheel Turns Through Telemetry
6. The Ratchet — Downward Migration of Compute
7. Transparency by Construction
8. Model Independence / Cognitive Agnosticism
9. Digital Jidoka — Fail-Fast / Fail-Loud

---

## Execution Entry Point

To begin execution, read `EXECUTION_PROMPT.md` which contains:
- Full context and constraints
- Epic-by-epic implementation guide
- Code samples and patterns
- Verification steps

---

## Success Criteria

A developer opens the demo and within 3 minutes:
- Completes the 3-step tutorial
- Watches the Skill Flywheel turn
- Sees cost evaporate as patterns cache
- Understands: "This is how it should work"
