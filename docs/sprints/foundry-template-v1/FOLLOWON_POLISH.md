# Post-v1.2.0 Polish: Name Inference, Enrichment Sections, Hero Prompt Removal, Build CTA

Four changes. Two files deleted, two files modified. No architectural shifts.

---

## Change 1: Remove Hero Prompts Entirely

The Signal Watch template replaces all three hero prompts. Remove every trace.

**Delete file:** `src/config/hero-prompts.ts`

```bash
git rm src/config/hero-prompts.ts
```

**Modify `src/components/Foundry/FoundryPane.tsx`:**
- Remove import: `import { getRandomHeroPrompt } from '../../config/hero-prompts'`
- Remove the `injectRandomHeroPrompt` function entirely
- Remove the "🎲 Load Architectural Prompt" button from the UI

The ONLY loading options should be "📋 Load Example" and "📝 Blank Template." Nothing else.

**Check for orphaned references:**
```bash
grep -r "hero-prompts" src/ --include="*.ts" --include="*.tsx"
grep -r "hero.prompt" src/ --include="*.ts" --include="*.tsx"
grep -r "getRandomHeroPrompt" src/ --include="*.ts" --include="*.tsx"
grep -r "HeroPrompt" src/ --include="*.ts" --include="*.tsx"
grep -r "HERO_PROMPTS" src/ --include="*.ts" --include="*.tsx"
```

If `src/config/index.ts` re-exports hero-prompts, clean that up too.

---

## Change 2: Infer App Name from Template Input

**Problem:** Manifesto title says "Untitled App" because `extractAppName()` only matches "I want to build a..." patterns. The template starts with `## Section 1:`.

**Modify `src/components/Foundry/FoundryPane.tsx` — the `extractAppName()` helper:**

Replace the current implementation with a smarter version that tries these strategies in order:

1. **Template Section 1 extraction:** If input contains `## Section 1:`, grab the first substantive line after the header (skip blank lines, skip lines starting with `>`, `**`, `|`, or triple backticks). That line is usually something like "Competitive intelligence monitoring for the AI industry." Extract the first 3-6 meaningful words, title-case them. For the Signal Watch template, this should yield something like "AI Competitive Intelligence Monitor" or "Competitive Intelligence Monitoring."

2. **Freeform "build a..." patterns:** Keep the existing regex patterns as fallback for non-template input.

3. **Kebab-case slug from content:** If neither strategy works, take the first 3-4 meaningful words from the input (skip stop words: the, a, an, I, want, to, build, create, make, my, for, that, which, is, it), kebab-case them, title-case for display. `competitive-intelligence-monitor` → "Competitive Intelligence Monitor." Anything is better than "Untitled App."

4. **Absolute last resort:** If the input is somehow empty of meaningful words, use "New Autonomaton" instead of "Untitled App."

**Test:**
- Load Signal Watch template → Compile → Title should reference the domain, NOT say "Untitled App"
- Type "I want to build a task manager" → Should extract "Task Manager" (existing behavior)
- Type random words → Should generate a slug-based name, not "Untitled App"

---

## Change 3: Surface Enrichment Sections (5-9) in Manifesto Output

**Problem:** The Signal Watch template includes Sections 5-9 (Views, Voice, Seed Data, Knowledge, Theme) but the `output_requirements` prompt block only defines 5 output sections. The model has nowhere to put enrichment content.

**Modify `src/config/prompts.schema.ts` — the `output_requirements` block:**

Find the pipeline block with `id: "output_requirements"`. APPEND to the END of its `content` string (do NOT replace the existing 5 sections):

```
If the user input includes enrichment sections from a Requirements Template (Sections 5-9), also generate these additional sections AFTER the first 5:

## 6. UI Blueprint
Map the views from the input to pipeline stages and zones. Include layout structure and interaction patterns. If no views section provided, skip entirely.

## 7. Voice Configuration
Output voice presets as declarative YAML config. Each preset: tone rules, format constraints, sample output. If no voice section provided, skip entirely.

## 8. Seed Data Specification
Define initial entities, demo content, and first-run experience. If no seed data provided, skip entirely.

## 9. Knowledge Manifest
List knowledge files and their analytical roles. Format as file manifest with descriptions. If no knowledge section provided, skip entirely.

## 10. Theme Tokens
Output theme config: mood, accent color, typography, data density. If no theme section provided, skip entirely.

## 11. Build It

This is a Sovereign Manifesto — a complete architectural contract for a working autonomaton.

To build it:

1. Open Claude Code (or Cursor, Windsurf, or any agentic IDE)
2. Drop this HTML file into the project directory
3. Prompt: "Read the Sovereign Manifesto and build Phase 1. Use the zones, routing, and pipeline specs exactly as written."
4. Review what it builds. Approve or redirect.
5. Repeat for Phases 2-4.

The build plan derives from the 9 Autonomaton claims:
- Phase 1: Structural Skeleton (Pipeline, Zones, Routing, Telemetry)
- Phase 2: Intelligence Layer (Cognitive Router, Model Abstraction, Jidoka)
- Phase 3: Self-Improvement Loop (Skill Flywheel, The Ratchet)
- Phase 4: Recipe Polish (Views, Theme, Seed Data, Voice, Knowledge)

Each phase has a checkpoint: self-audit against that phase's claims before proceeding.

Only generate sections 6-11 if the user input contains structured template sections. For freeform (non-template) input, generate ONLY sections 1-5 as before.
```

**IMPORTANT:** Do NOT modify the `system_persona`, `architectural_context`, or `template_recognition` blocks. Only extend `output_requirements`.

**Test:**
- Load Signal Watch template → Compile → Manifesto should include sections 6-11 (UI Blueprint through Build It)
- Type freeform text → Compile → Should produce ONLY sections 1-5. No empty enrichment sections.

---

## Change 4: Style the "Build It" Section in the Blueprint HTML

**Modify `src/utils/blueprint-generator.ts`:**

The `generateBlueprintHTML()` function wraps the PRD output in a `<pre class="prd-raw">` block. The "Build It" section will appear inside that pre block as plain monospace text — which is fine, but ideally it should stand out visually.

Add a post-processing step: after the PRD is inserted into the HTML template, scan for `## 11. Build It` in the prd-raw content. If found, inject a styled callout AFTER the `</pre>` closing tag and BEFORE the `</section>` closing tag:

```html
<div style="margin-top: 2rem; padding: 2rem; border: 2px solid var(--grove-amber); background: rgba(212, 98, 26, 0.08); text-align: center;">
  <h3 style="font-family: 'Instrument Serif', serif; font-size: 24px; color: var(--grove-amber); margin-bottom: 12px;">Build This Autonomaton</h3>
  <p style="font-family: 'Fragment Mono', monospace; font-size: 13px; color: var(--grove-text-mid); max-width: 600px; margin: 0 auto 16px; line-height: 1.6;">
    Drop this file into any agentic IDE. Prompt: <em>"Read the Sovereign Manifesto and build Phase 1."</em> Review. Repeat for Phases 2–4.
  </p>
  <p style="font-family: 'Fragment Mono', monospace; font-size: 11px; color: var(--grove-text-dim);">
    Works with Claude Code · Cursor · Windsurf · Any agent that reads files
  </p>
</div>
```

If `## 11. Build It` is NOT in the PRD (freeform input), don't inject anything. Freeform Manifestos keep the existing layout.

---

## Files Changed

| File | Change | Risk |
|------|--------|------|
| `src/config/hero-prompts.ts` | **DELETE** | None — removing dead code |
| `src/components/Foundry/FoundryPane.tsx` | Remove hero imports/button, improve `extractAppName()` | Low |
| `src/config/prompts.schema.ts` | Extend `output_requirements` content string | Low |
| `src/utils/blueprint-generator.ts` | Add styled CTA block for "Build It" section | Low |
| `src/config/index.ts` | Remove hero-prompts re-export if present | Low |

## Build & Commit

```bash
npm run build
npm run lint
npm run dev    # Manual: Load template → Compile → Verify name, enrichment sections, CTA block
git add -A
git commit -m "fix: app name inference, enrichment sections, hero prompt removal, build CTA"
```
