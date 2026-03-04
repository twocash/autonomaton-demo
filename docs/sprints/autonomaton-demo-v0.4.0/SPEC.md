# Grove Autonomaton v0.4.0 — "The Editorial Industrial Refactor"

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | ✅ All tasks implemented |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-04T17:30:00Z |
| **Next Action** | Commit and tag v0.4.0 |
| **Attention Anchor** | Transform visual identity to match deck aesthetic |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** Industrial manifesto aesthetic matching the Grove deck
- **Success looks like:** Near-black bg, zero rounded corners, amber accents, 3-font system
- **We are NOT:** Adding features — this is a visual identity overhaul
- **Current phase:** Implementation
- **Next action:** Font imports → Tailwind config → CSS base → Component refactor

---

## Goal

Transform the application's visual identity from a "standard SaaS tool" into an "industrial manifesto." The application must perfectly mirror the typography, strict geometry, and dark, high-contrast palette of the Grove Autonomaton Pattern deck.

---

## The Directives

### 1. Typography Trifecta

| Font | Semantic Role |
|------|---------------|
| **Instrument Serif** | Header title, dashboard metrics, CTAs |
| **Fragment Mono** | Config editor, telemetry, JSON, pipeline labels, tier labels |
| **DM Sans** | Standard UI, buttons, descriptions |

### 2. Kill the Curves

- Remove ALL `rounded`, `rounded-md`, `rounded-lg`, `rounded-full` classes
- Sharp 90-degree corners everywhere
- 1px solid borders using `#252525`

### 3. Grove Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `grove-bg` | #080808 | App root |
| `grove-bg2` | #0f0f0f | Panel backgrounds |
| `grove-bg3` | #161616 | Elevated cards |
| `grove-border` | #252525 | Standard borders |
| `grove-border-light` | #333333 | Hover borders |
| `grove-amber` | #D4621A | Primary active |
| `grove-amber-bright` | #F07030 | Hover active |
| `grove-text` | #E8E2D9 | Primary text |
| `grove-text-dim` | #7A736A | Muted text |
| `grove-text-mid` | #B0A898 | Secondary text |
| `grove-green` | #4CAF72 | Zone: Auto |
| `grove-yellow` | #D4A017 | Zone: Supervised |
| `grove-red` | #C0392B | Zone: Human-Only |

### 4. Manifesto Integration

Add `[ Read the Pattern Deck ]` link in header → opens `grove-autonomaton-deck.html`

---

## Acceptance Criteria

- [x] App background is near-pitch black (#080808)
- [x] Zero rounded corners anywhere
- [x] Pipeline and primary actions use Amber, not Blue
- [x] Config pane uses Fragment Mono
- [x] Header includes deck link styled with font-serif text-grove-amber
- [x] Three-font system correctly applied

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add Google Fonts preconnect + import |
| `tailwind.config.js` | Extend with grove colors + font families |
| `src/index.css` | Base styles, scrollbar theme |
| `src/App.tsx` | Remove rounded, apply grove colors |
| `src/components/Header/Header.tsx` | Font-serif title, deck link |
| `src/components/Pipeline/PipelineVisualization.tsx` | Amber active states |
| `src/components/Dashboard/Dashboard.tsx` | Font-serif metrics |
| `src/components/Config/ConfigEditor.tsx` | Font-mono styling |
| `src/components/Telemetry/TelemetryStream.tsx` | Font-mono styling |
| `src/components/Interaction/InteractionPane.tsx` | Remove rounded, grove colors |
| `src/components/Skills/SkillProposal.tsx` | Remove rounded |
