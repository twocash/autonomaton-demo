/**
 * Foundry Templates — Requirements Template Payloads
 *
 * Pre-written structured requirements templates for the Foundry.
 * These solve the cold-start problem by giving users a complete example
 * (Signal Watch) and a blank skeleton to fill in.
 *
 * v1.0: foundry-template-v1 sprint — auto-paste feature.
 */

export interface FoundryTemplate {
  id: string
  title: string
  description: string
  templateText: string
  isPreFilled: boolean
}

// =============================================================================
// SIGNAL WATCH PRE-FILLED TEMPLATE
// =============================================================================

const signalWatchTemplateText = `# Autonomaton Foundry — Requirements Template v1.0

> **Note:** This is the Signal Watch example — a complete requirements template demonstrating all 10 sections. Use this as reference for your own domain.

---

## Section 1: Domain Problem Statement [REQUIRED]

Competitive intelligence monitoring for the AI industry. Tracks companies, technologies, and market shifts. Used by strategists and executives to detect score-shifting events before they hit mainstream analysis. Supports investment timing, partnership evaluation, and strategic positioning decisions.

---

## Section 2: Entity Model [REQUIRED]

### 2.1 — Entity Definition

| Field | Description | Signal Watch |
|-------|-------------|--------------|
| **Entity name** | What do you call the things you track? | Subject |
| **Entity types** | What categories exist? | competitor, partner, market, technology, regulatory |
| **Entity tiers** | How do you prioritize? | primary, secondary, emerging |
| **Key attributes** | What data does each entity carry? | id, name, type, tier, baselineScore, keywords, aliases, sources, history |

Entity: WatchlistSubject
Types: competitor | partner | market | technology | regulatory
Tiers: primary | secondary | emerging
Attributes:
  - id: unique slug (e.g., "openai")
  - name: display name (e.g., "OpenAI")
  - type: one of the types above
  - tier: priority classification
  - baselineScore: 0.0-1.0 competitive position
  - keywords: array of matching terms (e.g., ["openai", "gpt", "chatgpt", "sam altman"])
  - aliases: alternative names
  - sources: configured data feeds
  - history: timestamped score changes with provenance

### 2.2 — Observation Definition

| Field | Description | Signal Watch |
|-------|-------------|--------------|
| **Observation name** | What do you call raw inputs? | Signal |
| **Source types** | Where do observations come from? | rss, api, webhook, manual |
| **Classification levels** | How do you triage? | routine, significant, critical |

Observation: ClassifiedSignal
Source types: rss | api | webhook | manual
Classification: routine | significant | critical
Key fields:
  - relevance: 0.0-1.0 (how relevant to watchlist)
  - novelty: 0.0-1.0 (how new is this information)
  - threatLevel: routine | significant | critical
  - subjects: array of matched entities with proposed score deltas
  - confidence: model's self-assessed accuracy

### 2.3 — Analysis Definition

| Field | Description | Signal Watch |
|-------|-------------|--------------|
| **Analysis name** | What do you call system output? | Briefing |
| **Analysis types** | What levels of urgency? | routine, significant, strategic |
| **Key components** | What does each analysis contain? | title, summary, highlights, recommendations, pendingAdjustments, research, zone |

Analysis: Briefing
Types: routine | significant | strategic
Components:
  - title: headline describing the finding
  - summary: 2-3 sentence overview
  - highlights: key facts with zone indicators
  - recommendations: prioritized action items (high/medium/low)
  - pendingAdjustments: proposed entity score changes (Yellow Zone — require approval)
  - research: web-sourced evidence section with cited URLs
  - zone: governance classification of the briefing itself

### 2.4 — Dimension Definition

| Field | Description | Signal Watch |
|-------|-------------|--------------|
| **Dimension name** | What are you measuring? | Competitive Position Score |
| **Scale** | What's the range? | 0.0-1.0 |
| **Delta thresholds** | What change magnitudes matter? | <0.05 routine, 0.05-0.15 significant, >=0.15 structural |

Dimension: Competitive Position Score
Scale: 0.0-1.0
Delta thresholds:
  - GREEN:  delta < 0.05 (routine, auto-process)
  - YELLOW: 0.05 ≤ delta < 0.15 (significant, human approves)
  - RED:    delta ≥ 0.15 (structural event, human decides everything)

---

## Section 3: Zone Governance [REQUIRED]

### 3.1 — Green Zone (Autonomous)

Green Zone allows:
  - Log briefings to archive
  - Update telemetry / write audit entries
  - Archive low-relevance signals
  - Fetch RSS/API feeds on schedule
  - Apply learned keyword filters
  - Execute cached skills (Tier 0)
  - Classify signals by keyword match (Tier 1)
  - Compile routine briefings with no score adjustments (Tier 1)
  - Quick relevance scoring on new signals (Tier 1)

Green Zone forbids:
  - Updating baseline entity scores
  - Sending alerts
  - Recommending strategic actions

### 3.2 — Yellow Zone (Supervised)

Yellow Zone allows (with proposal):
  - Draft briefings with proposed score adjustments
  - Classify novel/unrecognized signals (Tier 2)
  - Multi-entity correlation analysis (Tier 2)
  - Ad-hoc user-requested scans with web research (Tier 2)
  - Analyze score-shifting events (Tier 3)
  - Historical pattern analysis (Tier 3)

Yellow Zone requires explicit approval for:
  - Updating baseline entity scores
  - Promoting a pattern to a cached skill
  - Modifying source reliability ratings
  - Adding new entities to the watchlist
  - Changing domain configuration

### 3.3 — Red Zone (Human Only)

Red Zone (human decision required for ALL actions):
  - Compile strategic briefings with tier-crossing implications
  - Surface strategic implications for human decision

Red Zone forbidden (NEVER auto-execute):
  - Suggest investment decisions
  - Recommend strategic pivots
  - Auto-execute anything when delta ≥ 0.15

Governance lock: Red Zone operations NEVER become skills.
The Skill Flywheel does not turn in Red.

---

## Section 4: Cognitive Routing [REQUIRED]

### Intent Map

Tier 0 / Green:
  - fetch_rss: Pull from configured feeds
  - apply_keyword_filters: Match signals to entities
  - execute_skills: Fire cached patterns
  - log_telemetry: Write audit entry
  - archive_low_relevance: Auto-archive noise

Tier 1 / Green:
  - classify_keyword_signals: Tag signals by keyword
  - compile_routine_briefing: Daily digest, no adjustments
  - quick_relevance: Fast triage scoring

Tier 2 / Yellow:
  - classify_novel_signals: Signals without keyword match
  - multi_subject_correlation: Cross-entity pattern detection
  - ad_hoc_scan: User-requested research (web search enabled)
  - brief_me_on: Subject-specific research briefing
  - update_baseline_scores: Change entity scores (requires approval)
  - promote_skill: Move pattern to Tier 0 (requires approval)

Tier 3 / Yellow:
  - analyze_score_shifting_events: Major event impact analysis
  - historical_patterns: Trend prediction from history

Tier 3 / Red:
  - strategic_briefing: Structural event with tier implications
  - surface_implications: Present strategic options
  - suggest_investment_decisions: FORBIDDEN
  - recommend_strategic_pivots: FORBIDDEN

Fallback:
  - ad_hoc_query: Tier 2 / Yellow (unmapped user input)

---

## Section 5: Views & Interaction [ENRICHMENT]

### 5.1 — View Registry

Dashboard (pipeline: telemetry, zone: green, priority: 1)
  Primary orientation surface.
  Shows: entity summary cards with scores and deltas, recent pipeline activity,
  system health (ratchet position, cost trend, skill count), tier distribution chart.

Briefing Inbox (pipeline: recognition + compilation, zone: green/yellow, priority: 2)
  Two-pane layout: list on left, detail on right.
  Shows: chronological briefing feed with zone indicators (green/yellow/red badges),
  drill-down to full briefing with highlights, research sources, recommendations.
  Yellow briefings show approval controls for pending score adjustments.
  Red briefings show "Red Zone Takeover" — full-screen with context for human decision.

Watchlist (pipeline: telemetry, zone: green, priority: 3)
  Entity management surface.
  Shows: all tracked entities with current scores, type badges, tier indicators.
  Drill-down shows: entity profile, observation timeline, score history chart,
  related briefings.

Config Editor (pipeline: compilation, zone: yellow, priority: 4)
  Governance surface — edit zones, routing, voice presets.
  Shows: YAML-style editable routing config (intent → tier/zone mapping),
  zones schema display, voice preset selector with live preview.
  Changes are Yellow Zone — require explicit save action.

Flywheel (pipeline: execution, zone: yellow, priority: 5)
  Self-improvement surface.
  Shows: skill proposals (patterns detected, approval status),
  ratchet chart (tier distribution over time),
  cost evaporation trend (savings from skill promotion).

Telemetry Stream (pipeline: telemetry, zone: green, priority: 6)
  Audit surface — every pipeline decision visible and exportable.
  Shows: real-time trace feed with zone/tier/intent indicators,
  filter controls (by zone, tier, entity, time range),
  drill-down to individual trace entries with full provenance.

### 5.2 — Layout

Overall layout:
┌──────────────────────────────────────────────────────────────┐
│ Header: Logo, version, API key config, mode indicator        │
├──────────────────────────────────────────────────────────────┤
│ Navigation: Tab bar (Dashboard | Briefings | Config | Flywheel) │
├──────────────────────────────────────────────────────────────┤
│ Pipeline Visualization: 5-stage horizontal flow with state   │
├──────────┬───────────────────────────────────┬───────────────┤
│ Signal   │ Main Content Area (2/3 width)     │ Watchlist     │
│ Feed     │ (view-dependent)                  │ Sidebar       │
│ (toggle) │                                   │ (1/3 width)   │
├──────────┴───────────────────────────────────┴───────────────┤
│ Command Bar: Ad-hoc query input with voice preset indicator  │
├──────────────────────────────────────────────────────────────┤
│ Telemetry Stream: Collapsible audit log                      │
└──────────────────────────────────────────────────────────────┘

Navigation: Tab bar
Primary views: Dashboard, Briefings
Secondary views: Config, Flywheel
Persistent elements: Pipeline viz, Command bar, Telemetry stream

### 5.3 — Interaction Patterns

Command Bar:
  - Primary input surface for ad-hoc queries
  - Supports natural language: "brief me on Anthropic" triggers Tier 2 research
  - Training mode: first use asks domain questions, then accepts entity names
  - Operational mode: processes scans against configured watchlist

Approval Flow:
  - Score adjustments appear as Yellow badges on briefings
  - Approve/Reject buttons with one-click action
  - Approval records human identity and timestamp in telemetry
  - Rejection feeds back to recognition (system learns what doesn't pass)

Entity Management:
  - Add entity: Yellow Zone — system researches via LLM, proposes profile, human approves
  - Remove entity: Red Zone — archived (never deleted), historical data preserved

Training Mode:
  - Phase 1: Domain configuration (industry + tracking preferences → LLM generates config)
  - Phase 2: Entity seeding (user names entities → LLM researches → human approves each)
  - Phase 3: Operational (training complete, full functionality unlocked)

Red Zone Takeover:
  - Critical briefings get full-screen treatment
  - All context visible: what happened, why it matters, what the options are
  - No auto-actions available — human decides everything

---

## Section 6: Voice & Personality [ENRICHMENT]

Three presets, switchable at any time:

Strategic Analyst (default):
  - Lead with insight — "so what?" first
  - No hedging (avoid "potentially", "possibly")
  - Active voice always
  - Strategic framing — tie to business impact
  Preview: "Anthropic's 50% price cut repositions Claude as the cost-performance
  leader. This is a market share play aimed directly at OpenAI's enterprise base."

Executive Brief:
  - Bottom Line Up Front (BLUF)
  - Three bullets maximum
  - Decision-ready — end with clear recommendation
  - Numbers first — lead with metrics
  Preview: "ACTION REQUIRED: Anthropic pricing now 50% below OpenAI.
  • Enterprise cost: -$2.4M/year at current volume
  • Migration risk: Low (API compatible)
  • Recommendation: Pilot Claude on Tier 2 workloads"

Operator Log:
  - Terse facts only, no interpretation
  - Timestamp everything
  - Numbered list format for findings
  - Zero narrative sentences
  Preview: "[2024-03-09T14:32Z] PRICE_CHANGE
  anthropic/claude-3.5-sonnet: -50% to $3/MTok
  source: official_blog | confidence: HIGH"

---

## Section 7: Seed Data [ENRICHMENT]

Default watchlist: 5 AI competitors
  - OpenAI (primary, score: 0.85, keywords: openai/gpt/chatgpt/sam altman/o1/o3)
  - Anthropic (primary, score: 0.80, keywords: anthropic/claude/dario amodei)
  - Google DeepMind (primary, score: 0.82, keywords: google/deepmind/gemini)
  - Meta AI (secondary, score: 0.72, keywords: meta ai/llama/yann lecun)
  - xAI (emerging, score: 0.65, keywords: xai/grok/elon musk ai)

Demo briefings: Pre-loaded for Demo Mode (no API key required)
  - 3 routine briefings (Green Zone)
  - 2 significant briefings with pending adjustments (Yellow Zone)
  - 1 structural event briefing (Red Zone)

Demo signals: Pre-classified signal feed showing the pipeline in action

---

## Section 8: Knowledge Layer [ENRICHMENT]

worldviews/contrarian-lens.md
  "What's the bear case? What would make the consensus wrong?"

worldviews/regulatory-lens.md
  "What are the compliance implications? Who regulates this?"

frameworks/scoring-criteria.md
  "How to evaluate competitive position: market share, technical capability,
  distribution strength, talent density, capital access."

context/competitive-landscape.md
  "Current state of the AI industry as of [date]. Key dynamics, recent shifts,
  structural trends."

---

## Section 9: Theme [ENRICHMENT]

Mood: industrial-dark
Accent: #D4621A
Typography: monospace-headers-sans-body (Fragment Mono + DM Sans)
Density: analytical

---

## Section 10: Build Plan [AUTO-GENERATED]

Auto-generated by the Foundry compiler from your requirements above.

The build plan derives from the 9 Autonomaton claims:
- Phase 1: Structural Skeleton (Pipeline, Zones, Routing, Telemetry)
- Phase 2: Intelligence Layer (Cognitive Router, Model Abstraction, Jidoka)
- Phase 3: Self-Improvement Loop (Skill Flywheel, The Ratchet)
- Phase 4: Recipe Polish (Views, Theme, Seed Data, Voice, Knowledge)
`

// =============================================================================
// BLANK TEMPLATE (SKELETON WITH PLACEHOLDERS)
// =============================================================================

const blankTemplateText = `# Autonomaton Foundry — Requirements Template v1.0

> **Purpose:** Paste this into the Foundry at the-grove.ai/autonomaton to generate a Sovereign Manifesto and full application.
>
> **How to use:** Replace the content in each section with your domain. Sections marked [REQUIRED] must be filled. Sections marked [ENRICHMENT] improve output quality but have sensible defaults.

---

## Section 1: Domain Problem Statement [REQUIRED]

**What domain is this autonomaton monitoring, managing, or processing?**

Describe the domain in 2-4 sentences. Name the core activity. Name who uses it. Name what decisions it supports.

[PASTE YOUR DOMAIN DESCRIPTION HERE]

---

## Section 2: Entity Model [REQUIRED]

**What are you watching, tracking, or processing?**

### 2.1 — Entity Definition

| Field | Description | Your Domain |
|-------|-------------|-------------|
| **Entity name** | What do you call the things you track? | |
| **Entity types** | What categories exist? | |
| **Entity tiers** | How do you prioritize? | |
| **Key attributes** | What data does each entity carry? | |

[DESCRIBE YOUR ENTITY MODEL HERE]

### 2.2 — Observation Definition

| Field | Description | Your Domain |
|-------|-------------|-------------|
| **Observation name** | What do you call raw inputs? | |
| **Source types** | Where do observations come from? | |
| **Classification levels** | How do you triage? | |

[DESCRIBE YOUR OBSERVATION MODEL HERE]

### 2.3 — Analysis Definition

| Field | Description | Your Domain |
|-------|-------------|-------------|
| **Analysis name** | What do you call system output? | |
| **Analysis types** | What levels of urgency? | |
| **Key components** | What does each analysis contain? | |

[DESCRIBE YOUR ANALYSIS MODEL HERE]

### 2.4 — Dimension Definition

| Field | Description | Your Domain |
|-------|-------------|-------------|
| **Dimension name** | What are you measuring? | |
| **Scale** | What's the range? | |
| **Delta thresholds** | What change magnitudes matter? | |

[DESCRIBE YOUR DIMENSION MODEL HERE]

---

## Section 3: Zone Governance [REQUIRED]

**What should the system do autonomously vs. with permission vs. never?**

### 3.1 — Green Zone (Autonomous)

Actions the system executes without asking. These earn autonomy through repeated safe execution.

[PASTE YOUR GREEN ZONE ACTIONS HERE]

### 3.2 — Yellow Zone (Supervised)

Actions the system proposes but a human approves. Where trust is building.

[PASTE YOUR YELLOW ZONE ACTIONS HERE]

### 3.3 — Red Zone (Human Only)

The system surfaces information. Humans decide. Some things stay manual by design.

[PASTE YOUR RED ZONE ACTIONS HERE]

---

## Section 4: Cognitive Routing [REQUIRED]

**What intents does your system handle, and at what tier?**

### Tier Reference

| Tier | Cost | Sovereignty | Use for |
|------|------|-------------|---------|
| 0 | Free | Local | Cached skills, deterministic rules, keyword matches |
| 1 | Low | Cloud (cheap) | Simple classification, routine compilation |
| 2 | Medium | Cloud (standard) | Complex analysis, novel classification, research |
| 3 | High | Cloud (apex) | Strategic analysis, historical pattern recognition |

### Intent Map

[PASTE YOUR INTENT MAP HERE]

---

## Section 5: Views & Interaction [ENRICHMENT]

**What does the user see and do?**

Define the views your application needs. If omitted, defaults generated from entity model.

[PASTE YOUR VIEWS HERE OR DELETE THIS SECTION FOR DEFAULTS]

---

## Section 6: Voice & Personality [ENRICHMENT]

**How does the system communicate?**

Voice presets control output style. If omitted, defaults to neutral analytical voice.

[PASTE YOUR VOICE PRESETS HERE OR "default"]

---

## Section 7: Seed Data [ENRICHMENT]

**What should the app look like on first load?**

Seed data makes the app alive immediately. If omitted, minimal placeholder data generated.

[PASTE YOUR SEED DATA HERE OR DELETE THIS SECTION FOR DEFAULTS]

---

## Section 8: Knowledge Layer [ENRICHMENT]

**What domain expertise should inform the system's analysis?**

Markdown files loaded as context during compilation.

[DESCRIBE YOUR KNOWLEDGE FILES HERE OR "none"]

---

## Section 9: Theme [ENRICHMENT]

| Setting | Options | Default |
|---------|---------|---------|
| **Mood** | industrial-dark, clean-light, editorial, warm | industrial-dark |
| **Accent color** | Any hex color | #D4621A |
| **Typography** | all-sans, monospace-headers-sans-body, serif-headers-sans-body | monospace-headers-sans-body |
| **Data density** | minimal, balanced, analytical, dense | analytical |

[PASTE YOUR THEME PREFERENCES HERE OR "default"]

---

## Section 10: Build Plan [AUTO-GENERATED]

Auto-generated by the Foundry compiler from your requirements above.
`

// =============================================================================
// EXPORTS
// =============================================================================

const signalWatchTemplate: FoundryTemplate = {
  id: 'signal-watch',
  title: 'Signal Watch — AI Competitive Intelligence',
  description: 'Complete example with all 10 sections pre-filled',
  templateText: signalWatchTemplateText,
  isPreFilled: true,
}

const blankTemplate: FoundryTemplate = {
  id: 'blank',
  title: 'Blank Template',
  description: 'Skeleton with section headers and placeholders',
  templateText: blankTemplateText,
  isPreFilled: false,
}

export const FOUNDRY_TEMPLATES: FoundryTemplate[] = [signalWatchTemplate, blankTemplate]

export function getSignalWatchTemplate(): FoundryTemplate {
  return FOUNDRY_TEMPLATES[0]
}

export function getBlankTemplate(): FoundryTemplate {
  return FOUNDRY_TEMPLATES[1]
}
