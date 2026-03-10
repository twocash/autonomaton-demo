# Fix: App Name Inference + Enrichment Sections in Manifesto

Two bugs from the v1.2.0 smoke test. Both are contained changes — no architectural shifts.

---

## Bug 1: "Untitled App" — App Name Not Inferred from Template Input

**Problem:** When compiling from the structured template, the Manifesto title says "Sovereign Blueprint: Untitled App" because `extractAppName()` in `FoundryPane.tsx` only matches patterns like "I want to build a..." The template doesn't start that way — it starts with `## Section 1: Domain Problem Statement`.

**Fix:** Make `extractAppName()` smarter. It should try these strategies in order:

1. **Check if user typed a name in the App Name field** — if `appName.trim()` is non-empty, use it (this already works).

2. **Extract from template Section 1** — If the input contains `## Section 1:`, scan the text between Section 1 and Section 2 for the domain description. Use the LLM-free heuristic: look for the first non-header, non-empty line after the section header. That line usually starts with "Competitive intelligence monitoring for the AI industry" or similar. Extract the first noun phrase or the first 3-5 meaningful words and convert to title case.

3. **Extract from freeform text** — The existing regex patterns for "build a..." / "create a..." (keep these as fallback).

4. **Generate a kebab-case slug** — If all else fails, generate something from the input rather than "Untitled App." Take the first 3-4 meaningful words from the input (skip stop words like "the", "a", "an", "I", "want", "to"), kebab-case them, and use that. `competitive-intelligence-monitor` is infinitely better than "Untitled App." Even `section-domain-problem` would be more useful.

**Where to change:** `src/components/Foundry/FoundryPane.tsx` — the `extractAppName()` helper function at the bottom of the file.

**Test:** 
- Load the Signal Watch template → Compile → Title should NOT say "Untitled App." It should say something like "Signal Watch" or "AI Competitive Intelligence Monitor" or "competitive-intelligence-monitor" — anything derived from the actual content.
- Type "I want to build a task manager" → Compile → Should still extract "task manager" (existing behavior preserved).
- Type gibberish → Compile → Should generate a kebab-case slug from whatever words are there, not "Untitled App."

---

## Bug 2: Enrichment Sections (5-9) Not Surfacing in Manifesto

**Problem:** The Signal Watch template includes Sections 5-9 (Views & Interaction, Voice & Personality, Seed Data, Knowledge Layer, Theme). The `template_recognition` prompt block in `prompts.schema.ts` tells the model to map these sections, but the `output_requirements` block only defines 5 output sections (Pipeline, Zones, Routing, Audit Ledger, Anti-Patterns). The model has no slot to put the enrichment content.

**Fix:** Update the `output_requirements` block in `src/config/prompts.schema.ts` to include enrichment sections when template input is detected. 

Find the `output_requirements` pipeline block (id: `"output_requirements"`). After the existing 5 sections, add conditional enrichment sections. Modify the content string to append:

```
If the user input includes enrichment sections (Sections 5-9 from a Requirements Template), also generate these additional sections:

## 6. UI Blueprint
Map the views defined in the input to pipeline stages and zones. Include the layout wireframe and interaction patterns. If no views section is provided, skip this section entirely.

## 7. Voice & Personality Configuration
Output the voice presets as a declarative config (YAML or JSON). Each preset should define tone, format rules, and a sample output. If no voice section is provided, skip this section entirely.

## 8. Seed Data Specification
Define the initial entities, demo content, and first-run experience based on the seed data section. If no seed data is provided, skip this section entirely.

## 9. Knowledge Manifest
List the knowledge files and their roles in shaping analysis. Format as a file manifest with descriptions. If no knowledge section is provided, skip this section entirely.

## 10. Theme Tokens
Output the theme configuration as a declarative config: mood, accent color, typography, data density. If no theme section is provided, skip this section entirely.

Only generate sections 6-10 if the corresponding enrichment content is present in the user input. For freeform (non-template) input, generate ONLY sections 1-5 as before.
```

**Where to change:** `src/config/prompts.schema.ts` — the `output_requirements` block's `content` string. Append to the existing content. Do NOT replace the existing 5 sections — they must remain unchanged for freeform input.

**Important:** Do NOT modify the `system_persona` or `architectural_context` blocks. Do NOT modify the `template_recognition` block added in v1.2.0. Only extend `output_requirements`.

**Test:**
- Load Signal Watch template (has all 10 sections) → Compile → Manifesto should now include sections for UI Blueprint, Voice presets, Seed Data, Knowledge, and Theme IN ADDITION to the original 5.
- Type freeform "I want to build a task tracker" → Compile → Should produce ONLY the original 5 sections. No empty enrichment sections.

---

## Files Changed

| File | Change | Risk |
|------|--------|------|
| `src/components/Foundry/FoundryPane.tsx` | Improve `extractAppName()` | Low — helper function only |
| `src/config/prompts.schema.ts` | Extend `output_requirements` content | Low — append to existing string |

## Build Gates

```bash
npm run build    # Must pass
npm run lint     # Must pass
npm run dev      # Manual: compile template, verify name + enrichment sections appear
```

## Commit

```bash
git add src/components/Foundry/FoundryPane.tsx src/config/prompts.schema.ts
git commit -m "fix: infer app name from template input, surface enrichment sections in Manifesto"
```
