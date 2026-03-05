# Feature: Transparent Provenance (v0.9.4)

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | Done |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-05T12:15:00Z |
| **Next Action** | Ready for commit |
| **Attention Anchor** | All features implemented and build verified |

## Pattern Check (Abbreviated)

| Requirement | Existing Pattern | Extension Approach |
|-------------|------------------|-------------------|
| Clickable provenance links | `blueprint-generator.ts` | Extend HTML generation |
| X-Ray tooltips | `TelemetryStream.tsx` | Add group-hover tooltips |
| Copy as test | `TelemetryStream.tsx` | Add button with clipboard API |
| Config-driven halt messages | `DiagnosticCard.tsx` | Extend halt display |

**Existing patterns extended:** Yes, all work extends canonical components.
**New patterns proposed:** None required.

## Canonical Source Audit

| Capability Needed | Canonical Home | Recommendation |
|-------------------|----------------|----------------|
| Telemetry display | `TelemetryStream.tsx` | EXTEND |
| HTML blueprint export | `blueprint-generator.ts` | EXTEND |
| Pipeline halt display | `DiagnosticCard.tsx` | EXTEND |
| Routing config | `routing.ts` | READ (for tooltip data) |
| Zones config | `zones.ts` | READ (for tooltip data) |

## Goal

Transform the deterministic ledger into a discovery engine by:
1. Making provenance hashes clickable links to the open-source repository
2. Adding X-Ray tooltips showing exact config rules that drove routing decisions
3. Adding "Copy as Test" to prove pipeline determinism
4. Improving halt diagnostics with config-driven fix suggestions

## Non-Goals

- Full test framework integration (just copy-to-clipboard)
- Real-time config editing from tooltips
- New UI components (extending existing only)

## Acceptance Criteria

- [x] Blueprint HTML hash links to GitHub source
- [x] Prompt schema version links to source file
- [x] TierBadge shows routing config on hover
- [x] ZoneBadge shows zone schema on hover
- [x] Hash row has [TEST] button that copies Jest test to clipboard
- [x] DiagnosticCard shows config file reference for unmapped intents

## Attention Anchor

**We are building:** Transparent provenance features for the audit ledger
**Success looks like:** Users can trace any routing decision back to its config source
**We are NOT:** Building new UI components or test frameworks
**Current phase:** Implementation
**Next action:** Update blueprint-generator.ts with clickable links
