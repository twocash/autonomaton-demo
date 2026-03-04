# Grove Autonomaton Pattern Playground — Sprint Specification

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 8: Execution |
| **Status** | ✅ Planning Complete — Ready for Execution |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-04T13:20:00Z |
| **Next Action** | Execute Epic 1: Project Scaffolding |
| **Attention Anchor** | Browser-based demo proving 9 Autonomaton claims through user action |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** A browser-based demo that proves the Grove Autonomaton pattern through direct user experience — not documentation, but felt proof.
- **Success looks like:** Developer completes 3-step tutorial, watches tier migration happen, sees cost evaporate, edits config and behavior changes instantly, exports audit log.
- **We are NOT:** Building production infrastructure, a backend, a database, or anything requiring external dependencies in Demo Mode.
- **Current phase:** Execution
- **Next action:** Execute Epic 1: Project Scaffolding (initialize Vite + React + Tailwind)

---

## Pattern Check

**Existing pattern to extend:** None — this is a greenfield proof-of-concept
**Canonical home for this feature:** `/src` — React + Tailwind single-page application
**Domain contract:** None — standalone demo repository

---

## Goal

Build a minimal, visually compelling web application that **proves every core claim** in the Grove Autonomaton Pattern Brief through direct user interaction. The demo must:

1. Run entirely in the browser with zero external dependencies (Demo Mode)
2. Support real LLM calls with user-provided API keys (Interactive Mode)
3. Be completable in a single implementation session
4. Convince a CTO that "we should be doing this" within 3 minutes

**Tagline:** "Software that identifies its own issues, proposes its own fixes, and authors its own evolution — inside zones you control."

---

## Non-Goals

- ❌ Production-grade error handling
- ❌ Backend server or database
- ❌ Persistent storage (no localStorage, no cookies)
- ❌ Multiple pages or routing
- ❌ Mobile-first responsive design (desktop-focused demo)
- ❌ Full LLM integration testing (simulated responses are sufficient for proof)
- ❌ Supporting every LLM provider (Anthropic + OpenAI sufficient)

---

## The 9 Claims to Prove

Each claim maps to a demonstrable behavior. If the demo doesn't prove it, the claim is unsubstantiated.

| # | Claim | Proof Point |
|---|-------|-------------|
| 1 | **Five-Stage Pipeline Is Invariant** | Every action visibly traverses Telemetry → Recognition → Compilation → Approval → Execution |
| 2 | **Cognitive Router Dispatches to Tiers** | Router selects tier (0-3), shows rationale, cost, sovereignty profile. Tier decreases over time. |
| 3 | **Declarative Config Defines Behavior** | Edit `routing.config` → behavior changes immediately. No reload. Visual ripple proves it. |
| 4 | **Sovereignty Guardrails Enforce Zones** | Green auto-executes. Yellow pauses for approval. Red surfaces info only. |
| 5 | **Skill Flywheel Turns Through Telemetry** | 3+ repeated patterns surface proposal. Approved patterns become cached skills. |
| 6 | **The Ratchet — Downward Migration** | Dashboard shows cost trending down, % local increasing, skills accumulating. Cost evaporation animation. |
| 7 | **Transparency by Construction** | Telemetry panel shows every decision. Click interaction → highlights JSON block. Export audit log. |
| 8 | **Model Independence** | Swap model labels per tier. Routing, governance, skills survive unchanged. |
| 9 | **Digital Jidoka — Fail Fast** | Trigger failure → pipeline halts at exact stage, diagnostic card proposes fix. |

---

## Acceptance Criteria

### Core Functionality
- [ ] Five-stage pipeline visualization is the hero UI element
- [ ] Pipeline stages light up in sequence for every interaction
- [ ] Cognitive Router displays: tier selected, rationale, cost, sovereignty
- [ ] Config files (`routing.config`, `zones.schema`) visible and editable in UI
- [ ] Config changes take effect immediately with visual ripple animation
- [ ] Green zone actions auto-execute with brief notification
- [ ] Yellow zone actions pause with Approve/Reject proposal card
- [ ] Red zone actions display information only, no action buttons
- [ ] Skill Flywheel triggers after 3 repeated patterns
- [ ] Approved skills route to Tier 0 on subsequent matches
- [ ] Cost evaporation animation when pattern migrates to Tier 0
- [ ] Dashboard tracks: total cost, average tier, % local, skills count
- [ ] Line chart shows cost-per-interaction trending downward
- [ ] Telemetry stream displays structured JSON for every interaction
- [ ] Click past interaction → highlights corresponding telemetry entry
- [ ] Export Audit Log button downloads full telemetry as JSON
- [ ] Model Configuration panel with dropdown per tier (1, 2, 3)
- [ ] Failure simulation halts pipeline at failed stage with diagnostic card

### Operating Modes
- [ ] Demo Mode: All responses simulated with realistic latency and cost
- [ ] Interactive Mode: Real LLM calls using user-provided API key
- [ ] Mode toggle in UI header
- [ ] API keys stored in memory only, never persisted
- [ ] Clear security notice about key handling
- [ ] Telemetry tagged with `mode: "demo"` or `mode: "interactive"`

### Guided Tutorial
- [ ] Step 1: "Draft an email" → Yellow zone approval demonstration
- [ ] Step 2: Edit config to change zone → behavior changes immediately
- [ ] Step 3: "Summarize notes" 3x → Skill Flywheel triggers
- [ ] Tutorial completion unlocks free exploration mode

### Visual Design
- [ ] Clean, professional aesthetic (Stripe docs meets Linear app)
- [ ] Color-coded zones throughout (green/yellow/red)
- [ ] Monospace fonts for telemetry/config, sans-serif for UI
- [ ] Cost numbers prominent and visible
- [ ] Satisfying animations for ratchet/migration moments

---

## Technical Constraints

**Stack:** React + Tailwind CSS (Vite for build)
**State:** React state only (useState/useReducer) — no external state management
**Persistence:** None — all state in memory
**API Calls:** Direct browser-to-API (Interactive Mode only)
**Deployment:** Single artifact, any static host, or local dev server

---

## Sample Domain: Personal Productivity

| Intent | Default Tier | Default Zone | Description |
|--------|-------------|--------------|-------------|
| `capture_idea` | 1 | green | Quick thought capture |
| `summarize_notes` | 1 | green | Summarize recent ideas |
| `research_topic` | 2 | yellow | Deep-dive research |
| `draft_email` | 2 | yellow | Draft email from context |
| `propose_skill` | 2 | yellow | Propose new workflow |
| `analyze_data` | 3 | yellow | Complex analysis |
| `deploy_change` | 3 | red | System change |
| `delete_data` | 3 | red | Destructive operation |

---

## Success Definition

A developer opens the demo and within 3 minutes:

1. Types "Draft an email" → watches pipeline halt at Approval (Yellow zone)
2. Edits `routing.config` → changes `draft_email` to Green → types again → auto-executes
3. Types "Summarize notes" 3x → Skill Flywheel proposes → approves
4. Types "Summarize notes" again → Tier 0, cached, free, with animation
5. Sees dashboard cost trending down
6. Opens telemetry, clicks interaction, sees JSON highlight
7. Swaps model label → routing/governance/skills unchanged
8. Triggers failure → pipeline halts, diagnostic appears

**Their takeaway:** "This is obvious. This is how it should work. Why isn't everyone doing this?"

---

## References

- Grove Autonomaton Pattern Brief (3-page, March 2026)
- Grove Autonomaton Pattern Release, Draft 1.3 (25-page, February 2026)
- Trellis Architecture: Kernel Codex
- Trellis Architecture: First Order Directives
