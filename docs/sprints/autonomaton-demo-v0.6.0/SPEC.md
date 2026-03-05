# Feature: v0.6.0 — "Inline Skill Flywheel"

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | All tasks implemented |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-04T20:30:00Z |
| **Next Action** | Commit and tag v0.6.0 |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** Inline skill flywheel proposal that attaches to the triggering interaction
- **Success looks like:** Proposal card renders under the 3rd interaction, uses grove-amber styling, no floating modal
- **We are NOT:** Changing skill logic, approval flow, or pattern detection thresholds
- **Current phase:** Planning

---

## Phase 0: Pattern Check

**Existing pattern to extend:** DiagnosticCard inline rendering in InteractionCard

| Requirement | Existing Pattern | Extension Approach |
|-------------|------------------|-------------------|
| Inline conversational card | DiagnosticCard renders when `status === 'halted'` | Same pattern — render when `skillProposal.active && intent matches` |
| Grove manifesto styling | DiagnosticCard: `border-t-2 border-grove-red bg-[#1a0a0a]` | Same structure with `border-grove-amber` |
| Conditional render in parent | `{interaction.status === 'halted' && <DiagnosticCard />}` | `{skillProposal.active && intent === interaction.intent && isLatest && <SkillProposalCard />}` |

**Warning signs checked:**
- [ ] Creating new React Context ❌ Not needed — use existing `useSkillProposal()`
- [ ] New config file system ❌ Not needed
- [ ] Duplicate infrastructure ❌ Not building — extending DiagnosticCard pattern

---

## Phase 0.5: Canonical Source Audit

| Capability Needed | Canonical Home | Recommendation |
|-------------------|----------------|----------------|
| Inline card styling | `DiagnosticCard.tsx` | PORT structure, swap red → amber |
| Skill proposal state | `useSkillProposal()` hook in context.ts | INVOKE — already exists |
| Dispatch actions | `useAppDispatch()` hook | INVOKE — already exists |
| InteractionCard props | `InteractionPane.tsx:267-275` | EXTEND — add `isLatestInteraction`, `skillProposal` |

---

## Goal

Relocate the Skill Flywheel proposal from a floating global modal into the inline conversational flow. It should append directly to the bottom of the interaction that triggered the threshold. Apply "Editorial Industrial" strict geometry and color palette, eradicating the purple toast UI.

---

## Non-Goals

- Changing skill detection logic or threshold (still 3 repetitions)
- Modifying APPROVE_SKILL / REJECT_SKILL actions
- Adding new state fields
- Changing the Skills Library display

---

## Acceptance Criteria

- [x] SkillProposal.tsx renamed to SkillProposalCard.tsx
- [x] `<SkillProposal />` removed from App.tsx global mount
- [x] SkillProposalCard renders inline inside InteractionCard (same pattern as DiagnosticCard)
- [x] Renders ONLY when: `skillProposal.active && skillProposal.intent === interaction.intent && isLatestInteraction`
- [x] Uses grove-amber styling (not tier-0 purple):
  - Container: `border-t-2 border-grove-amber bg-grove-bg2 p-5 mt-4`
  - Header: `font-mono text-grove-amber text-sm uppercase tracking-widest`
  - Action buttons: Grove manifesto styling
- [x] "Create Skill" button dispatches APPROVE_SKILL, card disappears
- [x] "Not Now" button dispatches REJECT_SKILL, card disappears
- [x] Build passes with no errors

---

## Implementation Plan

### Step 1: Rename & Refactor SkillProposalCard

**File:** `src/components/Skills/SkillProposal.tsx` → `SkillProposalCard.tsx`

1. Rename file
2. Strip fixed positioning, z-indexes, shadows
3. Apply DiagnosticCard structure with amber styling:
   ```
   Container: border-t-2 border-x border-b border-grove-amber bg-grove-bg2 p-5 mt-4
   Header: font-mono text-grove-amber text-sm uppercase tracking-widest flex items-center gap-2
   ```
4. Accept props: `pattern`, `intent`, `count`, `onApprove`, `onReject`
5. Update index.ts export

### Step 2: Update InteractionCard Props

**File:** `src/components/Interaction/InteractionPane.tsx`

1. Add `isLatestInteraction` and `skillProposal` to InteractionCardProps
2. Pass from parent map: `isLatestInteraction={index === state.interactions.length - 1}`
3. Import SkillProposalCard
4. Add conditional render below DiagnosticCard:
   ```tsx
   {skillProposal.active &&
    skillProposal.intent === interaction.intent &&
    isLatestInteraction && (
     <SkillProposalCard ... />
   )}
   ```

### Step 3: Global Cleanup

**File:** `src/App.tsx`

1. Remove `import { SkillProposal }`
2. Remove `<SkillProposal />` from render

---

## Files to Modify

| File | Action |
|------|--------|
| `src/components/Skills/SkillProposal.tsx` | Rename to SkillProposalCard.tsx, refactor styling |
| `src/components/Skills/index.ts` | Update export |
| `src/components/Interaction/InteractionPane.tsx` | Add inline render, pass props |
| `src/App.tsx` | Remove global SkillProposal mount |

---

## Styling Reference (from DiagnosticCard)

```tsx
// SkillProposalCard structure
<div className="border-t-2 border-x border-b border-grove-amber bg-grove-bg2 p-5 mt-4">
  {/* Header */}
  <div className="font-mono text-grove-amber text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
    <span>⚡</span>
    <span>Pattern Detected</span>
  </div>

  {/* Message */}
  <p className="font-sans text-grove-text text-sm mb-4">...</p>

  {/* Tier Migration Preview */}
  <div className="bg-grove-bg border border-grove-border p-3 font-mono text-xs text-grove-text-mid flex justify-between items-center">
    ...
  </div>

  {/* Action Buttons */}
  <div className="flex gap-3 mt-4">
    <button className="bg-grove-amber hover:bg-grove-amber-bright text-grove-bg font-mono text-xs uppercase px-4 py-2">
      Create Skill
    </button>
    <button className="border border-grove-border hover:border-grove-text text-grove-text-dim font-mono text-xs uppercase px-4 py-2">
      Not Now
    </button>
  </div>
</div>
```
