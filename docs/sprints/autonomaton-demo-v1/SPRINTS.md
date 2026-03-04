# Grove Autonomaton Pattern Playground — Sprint Breakdown

## Sprint Overview

**Total Epics:** 8
**Estimated Implementation Order:** Sequential (each builds on previous)

---

## Epic 1: Project Scaffolding & Core Infrastructure

### Attention Checkpoint
Before starting this epic, verify:
- [ ] Working directory is `/c/github/grove-autonomaton-example`
- [ ] Node.js and npm available
- [ ] SPEC.md read and understood

### Story 1.1: Initialize Vite + React + TypeScript Project

**Task:**
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Acceptance:**
- [ ] `npm run dev` starts dev server
- [ ] TypeScript compiles without errors
- [ ] Tailwind CSS working

### Story 1.2: Configure Tailwind and Base Styles

**Task:**
- Configure `tailwind.config.js` with content paths
- Add Tailwind directives to `index.css`
- Define color tokens for zones: green-500, yellow-500, red-500
- Set up font families: sans-serif for UI, monospace for telemetry

**Files:**
- `tailwind.config.js`
- `src/index.css`

### Story 1.3: Create State Management Foundation

**Task:**
- Create `src/state/types.ts` with all TypeScript interfaces
- Create `src/state/reducer.ts` with action types and reducer
- Create `src/state/context.tsx` with AppProvider
- Wire up in `App.tsx`

**Files:**
- `src/state/types.ts`
- `src/state/reducer.ts`
- `src/state/actions.ts`
- `src/state/context.tsx`
- `src/App.tsx`

### Story 1.4: Create Default Configurations

**Task:**
- Create `src/config/default-routing.ts` with full intent config
- Create `src/config/default-zones.ts` with zone schema
- Create `src/config/simulated-responses.ts` with canned responses
- Create `src/config/tier-config.ts` with latency/cost values

**Files:**
- `src/config/default-routing.ts`
- `src/config/default-zones.ts`
- `src/config/simulated-responses.ts`
- `src/config/tier-config.ts`

### Build Gate
```bash
npm run build && npm run dev
# Verify: App loads, no console errors
```

---

## Epic 2: Pipeline Visualization (Hero Element)

### Attention Checkpoint
Before starting this epic, verify:
- [ ] Epic 1 complete and passing
- [ ] State management wired up
- [ ] SPEC.md: "Pipeline is the hero element"

### Story 2.1: Create Pipeline Stage Component

**Task:**
- Create `PipelineStage.tsx` component
- Props: name, icon, state (idle/active/complete/error)
- Styling: gray (idle), blue pulse (active), green (complete), red (error)
- Smooth transitions between states

**Files:**
- `src/components/Pipeline/PipelineStage.tsx`

### Story 2.2: Create Pipeline Connector Component

**Task:**
- Create `PipelineConnector.tsx`
- Arrow/line between stages
- Animates when flow progresses

**Files:**
- `src/components/Pipeline/PipelineConnector.tsx`

### Story 2.3: Create Pipeline Visualization Container

**Task:**
- Create `PipelineVisualization.tsx`
- Horizontal layout with 5 stages + connectors
- Reads pipeline state from context
- Always visible below header

**Files:**
- `src/components/Pipeline/PipelineVisualization.tsx`
- `src/components/Pipeline/index.ts`

### Story 2.4: Wire Pipeline State to Reducer

**Task:**
- Add pipeline state actions: `SET_PIPELINE_STAGE`, `RESET_PIPELINE`, `HALT_PIPELINE`
- Implement stage progression logic
- Add `advancePipeline()` helper

**Files:**
- `src/state/reducer.ts` (update)
- `src/state/actions.ts` (update)

### Build Gate
```bash
npm run build
# Verify: Pipeline visible, stages can be toggled via dev tools
```

---

## Epic 3: Interaction Pane & Input Handling

### Attention Checkpoint
Before starting this epic, verify:
- [ ] Pipeline visualization complete
- [ ] State management handles interactions
- [ ] Re-read SPEC.md: "Interaction Flow"

### Story 3.1: Create Input Area Component

**Task:**
- Create `InputArea.tsx` with text input and submit button
- Keyboard: Enter to submit
- Clear input on submit
- Dispatch `SUBMIT_INPUT` action

**Files:**
- `src/components/Interaction/InputArea.tsx`

### Story 3.2: Create Interaction Card Component

**Task:**
- Create `InteractionCard.tsx`
- Display: user input, tier badge, zone badge, cost, response
- Zone color coding (border or background)
- Click to highlight telemetry entry

**Files:**
- `src/components/Interaction/InteractionCard.tsx`

### Story 3.3: Create Badge Components

**Task:**
- Create `TierBadge.tsx` - shows tier number with label
- Create `ZoneBadge.tsx` - color-coded zone indicator
- Create `CostDisplay.tsx` - formatted cost with sovereignty label

**Files:**
- `src/components/shared/TierBadge.tsx`
- `src/components/shared/ZoneBadge.tsx`
- `src/components/shared/CostDisplay.tsx`

### Story 3.4: Create Interaction List and Pane

**Task:**
- Create `InteractionList.tsx` - scrollable list of interactions
- Create `InteractionPane.tsx` - container with list + input area
- Most recent interaction at bottom (chat-like)

**Files:**
- `src/components/Interaction/InteractionList.tsx`
- `src/components/Interaction/InteractionPane.tsx`
- `src/components/Interaction/index.ts`

### Build Gate
```bash
npm run build
# Verify: Can type input, submit, see placeholder interaction cards
```

---

## Epic 4: Cognitive Router & Execution Engine

### Attention Checkpoint
Before starting this epic, verify:
- [ ] Interaction submission working
- [ ] Pipeline stages can progress
- [ ] Re-read SPEC.md: "Claim 2: Cognitive Router"

### Story 4.1: Create Intent Classifier (Demo Mode)

**Task:**
- Create `src/services/cognitive-router.ts`
- `classifyIntent(input: string, routingConfig)` → intent, confidence
- Keyword matching against config keywords
- Returns highest-confidence match or 'unknown'

**Files:**
- `src/services/cognitive-router.ts`

### Story 4.2: Create Skill Matcher

**Task:**
- Create `src/services/skill-matcher.ts`
- `matchSkill(intent: string, skills: Skill[])` → Skill | null
- If match found, tier becomes 0

**Files:**
- `src/services/skill-matcher.ts`

### Story 4.3: Create Response Generator (Demo Mode)

**Task:**
- Create `src/services/response-generator.ts`
- `generateResponse(intent, tier, mode, input)` → Promise<response>
- Demo mode: return canned response after tier-based delay
- Interactive mode: placeholder for API call

**Files:**
- `src/services/response-generator.ts`

### Story 4.4: Create Pipeline Orchestrator

**Task:**
- Create `src/services/pipeline-orchestrator.ts`
- Coordinates full interaction lifecycle
- Progresses pipeline stages with appropriate delays
- Handles zone-based approval logic
- Integrates router, skill-matcher, response-generator

**Files:**
- `src/services/pipeline-orchestrator.ts`

### Story 4.5: Wire Orchestrator to State

**Task:**
- Connect orchestrator to reducer actions
- Dispatch stage changes as pipeline progresses
- Update interaction state through lifecycle

**Files:**
- `src/state/reducer.ts` (update)
- `src/App.tsx` (update)

### Build Gate
```bash
npm run build
# Verify: Full pipeline executes for Green zone intent
# Type "capture an idea" → watch pipeline → see response
```

---

## Epic 5: Zone Governance & Approval Flow

### Attention Checkpoint
Before starting this epic, verify:
- [ ] Pipeline executes for simple intents
- [ ] Router classifies intents correctly
- [ ] Re-read SPEC.md: "Claim 4: Sovereignty Guardrails"

### Story 5.1: Create Approval Card Component

**Task:**
- Create `ApprovalCard.tsx`
- Shows: intent description, tier, zone, proposed action
- Buttons: Approve (green), Reject (red)
- Slides up from interaction card

**Files:**
- `src/components/Interaction/ApprovalCard.tsx`

### Story 5.2: Implement Zone-Based Approval Logic

**Task:**
- Update orchestrator for zone handling:
  - Green: auto-approve, brief flash, continue
  - Yellow: pause, show approval card, wait for action
  - Red: show info-only card, no action buttons
- Add `pendingApproval` to state

**Files:**
- `src/services/pipeline-orchestrator.ts` (update)
- `src/state/reducer.ts` (update)

### Story 5.3: Create Red Zone Info Card

**Task:**
- Create variant of ApprovalCard for Red zone
- Shows information only
- Message: "This action is reserved for human decision"
- No action buttons

**Files:**
- `src/components/Interaction/ApprovalCard.tsx` (update)

### Story 5.4: Wire Approval Actions to State

**Task:**
- Add `APPROVE_INTERACTION`, `REJECT_INTERACTION` actions
- Resume pipeline on approve
- Mark rejected in telemetry

**Files:**
- `src/state/actions.ts` (update)
- `src/state/reducer.ts` (update)

### Build Gate
```bash
npm run build
# Verify: "draft an email" pauses with approval card
# Verify: "deploy a change" shows info-only (red zone)
# Verify: "capture idea" auto-executes (green zone)
```

---

## Epic 6: Config Editor & "No Deploy" Proof

### Attention Checkpoint
Before starting this epic, verify:
- [ ] Zone governance working
- [ ] All three zones behave correctly
- [ ] Re-read SPEC.md: "Claim 3: Declarative Config"

### Story 6.1: Create Config Editor Component

**Task:**
- Create `ConfigEditor.tsx`
- Monospace textarea for editing
- Syntax highlighting (basic: keywords in color)
- Live validation as user types

**Files:**
- `src/components/Config/ConfigEditor.tsx`

### Story 6.2: Create Config Tabs

**Task:**
- Create `ConfigTabs.tsx`
- Tabs: routing.config | zones.schema
- Switch between config files

**Files:**
- `src/components/Config/ConfigTabs.tsx`

### Story 6.3: Create Validation Status Component

**Task:**
- Create `ValidationStatus.tsx`
- Shows: ✓ Valid (green) or ✗ Invalid with error (red)
- Updates as user edits

**Files:**
- `src/components/Config/ValidationStatus.tsx`

### Story 6.4: Implement Config Parsing and Validation

**Task:**
- Create `src/utils/config-parser.ts`
- Parse YAML-like text to JS object
- Validate against expected schema
- Return errors if invalid

**Files:**
- `src/utils/config-parser.ts`

### Story 6.5: Create Config Ripple Animation

**Task:**
- Create CSS animation: ripple from editor to interaction pane
- Trigger on successful config save
- Duration: 600ms
- Visual proof of "no deploy"

**Files:**
- `src/components/shared/animations.ts`
- `src/index.css` (update)

### Story 6.6: Wire Config Changes to State

**Task:**
- Add `UPDATE_ROUTING_CONFIG`, `UPDATE_ZONES_SCHEMA` actions
- Changes take effect immediately
- Trigger ripple animation on save

**Files:**
- `src/state/reducer.ts` (update)
- `src/components/Config/ConfigEditor.tsx` (update)

### Build Gate
```bash
npm run build
# Verify: Edit draft_email from yellow to green
# Verify: "Draft an email" now auto-executes
# Verify: Ripple animation fires on save
```

---

## Epic 7: Skill Flywheel & Ratchet Visualization

### Attention Checkpoint
Before starting this epic, verify:
- [ ] Config editing works
- [ ] Zone changes take effect immediately
- [ ] Re-read SPEC.md: "Claim 5: Skill Flywheel" + "Claim 6: The Ratchet"

### Story 7.1: Implement Pattern Counter

**Task:**
- Add pattern counting to state
- Track: intent name → { count, lastSeen }
- Increment on each interaction
- Check threshold (3)

**Files:**
- `src/state/reducer.ts` (update)
- `src/state/types.ts` (update)

### Story 7.2: Create Skill Proposal Modal

**Task:**
- Create `SkillProposalModal.tsx`
- Message: "I noticed you [pattern] frequently. Want me to do this automatically?"
- Buttons: Yes, teach me / No thanks
- Shows pattern details

**Files:**
- `src/components/Skills/SkillProposalModal.tsx`

### Story 7.3: Create Skills Library Component

**Task:**
- Create `SkillsLibrary.tsx`
- List of learned skills
- Each shows: pattern, times fired, cumulative savings

**Files:**
- `src/components/Skills/SkillsLibrary.tsx`
- `src/components/Skills/SkillCard.tsx`
- `src/components/Skills/index.ts`

### Story 7.4: Wire Skill Learning to State

**Task:**
- Add `PROPOSE_SKILL`, `APPROVE_SKILL`, `REJECT_SKILL` actions
- On approve: add to skills array
- Future matches route to Tier 0

**Files:**
- `src/state/reducer.ts` (update)
- `src/state/actions.ts` (update)

### Story 7.5: Create Cost Evaporation Animation

**Task:**
- Animation when Tier 0 skill fires:
  - Cloud icon → local icon morph
  - Cost strikes through
  - "Cached" badge slides in
- Duration: 800ms

**Files:**
- `src/components/shared/animations.ts` (update)
- `src/components/Interaction/InteractionCard.tsx` (update)

### Story 7.6: Create Dashboard with Metrics

**Task:**
- Create `Dashboard.tsx`
- Metrics: Total Cost, Avg Tier, % Local, Skills Count
- Create `MetricCard.tsx` for each metric
- Update on every interaction

**Files:**
- `src/components/Dashboard/Dashboard.tsx`
- `src/components/Dashboard/MetricCard.tsx`
- `src/components/Dashboard/index.ts`

### Story 7.7: Create Cost Trend Chart

**Task:**
- Create `CostTrendChart.tsx`
- Simple SVG line chart
- X: interaction number, Y: cost
- Shows downward trend as skills accumulate

**Files:**
- `src/components/Dashboard/CostTrendChart.tsx`

### Build Gate
```bash
npm run build
# Verify: "Summarize notes" 3x triggers proposal
# Verify: Approve → skill appears in library
# Verify: 4th "summarize notes" routes to Tier 0
# Verify: Cost evaporation animation plays
# Verify: Dashboard metrics update
```

---

## Epic 8: Telemetry, Tutorial & Polish

### Attention Checkpoint
Before starting this epic, verify:
- [ ] Skill flywheel working
- [ ] Dashboard updating
- [ ] Re-read SPEC.md: "Claim 7: Transparency" + "Tutorial"

### Story 8.1: Create Telemetry Stream Component

**Task:**
- Create `TelemetryStream.tsx`
- Monospace display of JSON entries
- Auto-scroll to newest
- Click entry → highlight corresponding interaction

**Files:**
- `src/components/Telemetry/TelemetryStream.tsx`
- `src/components/Telemetry/TelemetryEntry.tsx`
- `src/components/Telemetry/index.ts`

### Story 8.2: Create Export Audit Log Button

**Task:**
- Create `ExportButton.tsx`
- Downloads full telemetry as JSON file
- Filename: `autonomaton-audit-{timestamp}.json`

**Files:**
- `src/components/Telemetry/ExportButton.tsx`
- `src/utils/export.ts`

### Story 8.3: Implement Click-to-Highlight Correlation

**Task:**
- Click interaction card → highlight telemetry entry
- Click telemetry entry → highlight interaction card
- Proves reconstructability

**Files:**
- `src/state/reducer.ts` (update: selectedTelemetryId)
- `src/components/Interaction/InteractionCard.tsx` (update)
- `src/components/Telemetry/TelemetryEntry.tsx` (update)

### Story 8.4: Create Tutorial Overlay

**Task:**
- Create `TutorialOverlay.tsx`
- 3 steps with prompts and progress indicator
- Step 1: Zone governance
- Step 2: Config editing
- Step 3: Skill flywheel
- Completion unlocks free exploration

**Files:**
- `src/components/Tutorial/TutorialOverlay.tsx`
- `src/components/Tutorial/TutorialStep.tsx`
- `src/components/Tutorial/index.ts`

### Story 8.5: Create Model Config Panel

**Task:**
- Create `ModelConfigPanel.tsx`
- Dropdowns per tier (1, 2, 3)
- API key input (for Interactive Mode)
- Security notice about key handling

**Files:**
- `src/components/Header/ModelConfigPanel.tsx`

### Story 8.6: Create Mode Toggle

**Task:**
- Create `ModeToggle.tsx`
- Toggle: Demo / Interactive
- Switching to Demo clears API keys
- Telemetry tagged with mode

**Files:**
- `src/components/Header/ModeToggle.tsx`
- `src/components/Header/Header.tsx`
- `src/components/Header/index.ts`

### Story 8.7: Implement Diagnostic Card (Jidoka)

**Task:**
- Create `DiagnosticCard.tsx`
- Shows: failed stage, error, expected behavior, proposed fix
- Pipeline halts visually
- Trigger via malformed input or toggle

**Files:**
- `src/components/Interaction/DiagnosticCard.tsx`
- `src/services/pipeline-orchestrator.ts` (update)

### Story 8.8: Final Layout Assembly

**Task:**
- Create final `App.tsx` layout
- Header → Pipeline → Dashboard → Main (split pane) → Telemetry
- Responsive sizing
- Polish spacing and typography

**Files:**
- `src/App.tsx` (finalize)

### Story 8.9: Add Footer and Branding

**Task:**
- Footer: "The Grove Autonomaton Pattern • CC BY 4.0 • thegrovefoundation.org"
- Tagline in header
- Clean, professional aesthetic

**Files:**
- `src/components/Footer.tsx`
- `src/App.tsx` (update)

### Build Gate
```bash
npm run build
# Full tutorial walkthrough:
# 1. "Draft an email" → Yellow zone approval
# 2. Edit config → behavior changes
# 3. "Summarize notes" 3x → Skill Flywheel
# Verify: All 9 claims demonstrable
```

---

## Final Verification Checklist

### Claim Verification Matrix

| Claim | Verification Step | Pass? |
|-------|-------------------|-------|
| 1. Five-Stage Pipeline | Watch any interaction traverse all 5 stages | [ ] |
| 2. Cognitive Router | See tier selection, cost, sovereignty for each | [ ] |
| 3. Declarative Config | Edit config → behavior changes immediately | [ ] |
| 4. Sovereignty Guardrails | Green auto-executes, Yellow pauses, Red info-only | [ ] |
| 5. Skill Flywheel | 3x repeat → proposal → approve → skill library | [ ] |
| 6. The Ratchet | Skill fires at Tier 0, cost evaporation animation | [ ] |
| 7. Transparency | Click interaction → telemetry highlights, export works | [ ] |
| 8. Model Independence | Swap model label → routing/skills unchanged | [ ] |
| 9. Digital Jidoka | Trigger failure → pipeline halts, diagnostic card | [ ] |

### Tutorial Completion Test

1. [ ] Fresh load shows tutorial overlay
2. [ ] Step 1: "Draft an email" demonstrates Yellow zone
3. [ ] Step 2: Config edit demonstrates no-deploy
4. [ ] Step 3: 3x "Summarize notes" triggers flywheel
5. [ ] Tutorial completion unlocks free exploration
6. [ ] Dashboard populated with tutorial telemetry

### Visual Polish Check

- [ ] Pipeline is prominent hero element
- [ ] Zones color-coded consistently
- [ ] Monospace for telemetry/config
- [ ] Sans-serif for UI elements
- [ ] Animations feel satisfying
- [ ] Professional aesthetic (Stripe/Linear quality)

---

## Commit Sequence

```
feat: scaffold vite + react + tailwind project
feat: add state management with useReducer
feat: add default configurations
feat: implement pipeline visualization
feat: add interaction pane and input handling
feat: implement cognitive router and execution
feat: add zone governance and approval flow
feat: implement config editor with validation
feat: add config ripple animation
feat: implement skill flywheel and pattern detection
feat: add cost evaporation animation
feat: implement dashboard with metrics
feat: add telemetry stream and export
feat: implement tutorial overlay
feat: add mode toggle and model config
feat: implement diagnostic card (jidoka)
feat: final layout assembly and polish
docs: add README with setup instructions
```
