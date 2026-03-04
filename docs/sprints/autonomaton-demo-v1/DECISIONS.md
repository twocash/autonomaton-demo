# Grove Autonomaton Pattern Playground — Architectural Decisions

## ADR-001: Single-Page React Application

**Status:** Accepted

**Context:** The demo must prove architectural claims while remaining implementable in a single session. We need to choose between a multi-page app, a single-page app, or a static HTML artifact.

**Decision:** Build a single-page React application with Vite.

**Rationale:**
- React provides component composition that matches the UI complexity
- Vite offers fast development iteration
- Single page keeps all state in memory (no routing, no persistence)
- Can be deployed to any static host (GitHub Pages, Vercel, Netlify)
- Tailwind CSS provides rapid styling without custom CSS overhead

**Rejected Alternatives:**
- **Static HTML + vanilla JS:** Too much boilerplate for state management complexity
- **Next.js:** Overkill, adds SSR complexity we don't need
- **Vue/Svelte:** Less familiar ecosystem, React is more recognizable to target audience

---

## ADR-002: useReducer for State Management

**Status:** Accepted

**Context:** The app has substantial interconnected state (pipeline, interactions, skills, telemetry, config). We need predictable state updates without adding external dependencies.

**Decision:** Use React's built-in `useReducer` with Context for global state.

**Rationale:**
- Reducer pattern matches the action-based nature of the pipeline
- No external dependencies (Redux, Zustand, etc.)
- Single source of truth for all state
- Actions are explicit and traceable (mirrors the telemetry/audit concept)
- Context provides component access without prop drilling

**Rejected Alternatives:**
- **useState scattered across components:** Too fragmented for this complexity
- **Redux Toolkit:** Unnecessary dependency, learning curve for new contributors
- **Zustand/Jotai:** Good options but adds dependency we don't need

---

## ADR-003: YAML-Like Config as JavaScript Objects

**Status:** Accepted

**Context:** The Pattern Brief specifies YAML config files (`routing.config`, `zones.schema`). We need editable configs in the browser without backend file I/O.

**Decision:** Store configs as JavaScript objects, display/edit as YAML-like syntax in the UI.

**Rationale:**
- JavaScript objects are native, no parsing required at runtime
- UI displays formatted YAML-like representation
- User edits are validated and converted back to JS objects
- No dependency on YAML parser library
- Matches the "declarative configuration" thesis without actual file system

**Implementation:**
- `default-routing.ts` and `default-zones.ts` export typed objects
- `ConfigEditor` displays formatted representation
- Simple validation catches syntax errors before applying
- "No Deploy" ripple proves immediate effect

**Rejected Alternatives:**
- **Actual YAML files:** Requires file I/O, backend, breaks "runs in browser" constraint
- **JSON editing:** Less readable, YAML is more config-friendly
- **Form-based config editing:** Loses the "edit a config file" proof point

---

## ADR-004: Simulated LLM Responses in Demo Mode

**Status:** Accepted

**Context:** Demo Mode must work without any API keys or external dependencies. We need realistic-feeling responses with appropriate latency.

**Decision:** Implement tier-based simulated responses with configurable latency.

**Rationale:**
- Anyone can experience the full demo without credentials
- Simulated latency (200ms/800ms/1500ms per tier) feels authentic
- Canned responses per intent are contextually appropriate
- Cost tracking works identically (just simulated values)
- Proves the architecture without requiring real LLM integration

**Implementation:**
```typescript
const TIER_LATENCY = { 0: 50, 1: 200, 2: 800, 3: 1500 };
const TIER_COST = { 0: 0.00, 1: 0.001, 2: 0.01, 3: 0.10 };
```

**Rejected Alternatives:**
- **Always require API key:** Blocks most users from experiencing the demo
- **Instant responses:** Doesn't feel real, loses the "cost of cognition" proof
- **Random delays:** Less instructive than tier-based delays

---

## ADR-005: No Persistence (Memory-Only State)

**Status:** Accepted

**Context:** The demo could persist state to localStorage, but the Pattern Brief emphasizes sovereignty and zero external dependencies.

**Decision:** All state lives in React state only. Page refresh resets everything.

**Rationale:**
- Reinforces sovereignty thesis: "you don't need anyone's infrastructure"
- API keys are never written to disk
- Telemetry stays in browser memory (user controls it completely)
- Tutorial can be re-experienced by refreshing
- Simplifies implementation significantly

**Trade-offs:**
- Users lose progress on refresh (acceptable for a demo)
- Can't bookmark mid-demo state (not a use case)

**Rejected Alternatives:**
- **localStorage:** Persists API keys on disk, violates security model
- **sessionStorage:** Better but still writes to disk
- **IndexedDB:** Overkill for demo needs

---

## ADR-006: Intent Classification via Keyword Matching (Demo Mode)

**Status:** Accepted

**Context:** The Recognition stage must classify user input into intents. In Demo Mode, we can't call an LLM.

**Decision:** Use keyword matching for intent classification in Demo Mode.

**Rationale:**
- Fast, deterministic, no API required
- Good enough for demo purposes
- Each intent has associated keywords in `routing.config`
- Falls back to "unknown" intent if no match
- Interactive Mode can optionally use LLM for real classification

**Implementation:**
```typescript
intents: {
  draft_email: {
    tier: 2,
    zone: 'yellow',
    keywords: ['draft', 'email', 'write email', 'compose']
  }
}
```

**Rejected Alternatives:**
- **Always require LLM for classification:** Breaks Demo Mode
- **Regex patterns:** More complex, not more accurate for demo
- **Fuzzy matching library:** Adds dependency for marginal improvement

---

## ADR-007: Skill Flywheel Threshold of 3

**Status:** Accepted

**Context:** The Pattern Brief says "N+ times in N days" for skill detection. We need a demo-friendly threshold.

**Decision:** Trigger Skill Flywheel after 3 repetitions of the same intent pattern.

**Rationale:**
- 3 is the minimum to demonstrate "pattern detection"
- Achievable in the tutorial without tedium
- Higher thresholds would make demo feel slow
- Lower threshold (2) doesn't feel like a real pattern

**Implementation:**
- Pattern counter tracks `{ intentName, count, lastSeen }`
- At count >= 3, trigger SkillProposalModal
- User approves → skill added to library → future matches route to Tier 0

**Rejected Alternatives:**
- **Threshold of 2:** Too easy, doesn't feel like learning
- **Threshold of 5:** Tutorial would drag
- **Time-based decay:** Unnecessary complexity for demo

---

## ADR-008: Pipeline as Hero UI Element

**Status:** Accepted

**Context:** The demo must prove the five-stage pipeline invariant. The pipeline visualization must be prominent.

**Decision:** Pipeline visualization is the top-most, always-visible UI element after the header.

**Rationale:**
- Every interaction's progress is visible
- Reinforces "the pipeline is the invariant"
- User can't miss it during tutorial
- Stages light up in sequence, telling the story
- Halt states are immediately visible (Jidoka)

**Implementation:**
- Horizontal bar with 5 connected stages
- Each stage: icon + label + state indicator
- States: idle (gray), active (blue pulse), complete (green), error (red)
- Connectors animate as flow progresses

**Rejected Alternatives:**
- **Pipeline in sidebar:** Too hidden, loses hero status
- **Pipeline only on hover:** Violates "always visible" requirement
- **Vertical pipeline:** Takes too much vertical space

---

## ADR-009: Minimal External Dependencies

**Status:** Accepted

**Context:** The demo should be easily auditable, fast to load, and simple to maintain.

**Decision:** Limit dependencies to React, Tailwind, Vite, and TypeScript.

**Rationale:**
- No charting library: simple SVG line for cost trend
- No Monaco editor: styled textarea with basic validation
- No state library: useReducer is sufficient
- No animation library: CSS transitions and keyframes
- Audit: anyone can read the entire codebase quickly

**Dependencies (final list):**
```
react, react-dom       # Core
tailwindcss, postcss   # Styling
vite, typescript       # Build
```

**Rejected Alternatives:**
- **Chart.js/Recharts:** Overkill for one line chart
- **Monaco Editor:** Heavy, complex API, not needed
- **Framer Motion:** Nice but CSS is sufficient

---

## ADR-010: Direct Browser-to-API Calls (Interactive Mode)

**Status:** Accepted

**Context:** Interactive Mode needs real LLM API calls. We could proxy through a backend or call directly.

**Decision:** Direct browser-to-API calls using user's API key.

**Rationale:**
- No backend required (maintains "runs in browser" thesis)
- User's key never touches any server except the LLM provider
- Anthropic API supports CORS for browser calls
- User has full control and visibility

**Trade-offs:**
- OpenAI API may have CORS issues (documented limitation)
- Key is in browser memory (but never persisted)

**Implementation:**
```typescript
fetch('https://api.anthropic.com/v1/messages', {
  headers: {
    'x-api-key': userApiKey,
    'anthropic-version': '2023-06-01'
  },
  // ...
});
```

**Rejected Alternatives:**
- **Backend proxy:** Adds infrastructure, violates sovereignty thesis
- **Serverless functions:** Still external dependency
- **Only Demo Mode:** Loses "cognitive agnosticism" proof

---

## ADR-011: Tutorial as Gate to Free Exploration

**Status:** Accepted

**Context:** We need to prove claims through user action, not pre-loaded state.

**Decision:** 3-step guided tutorial that proves 3 core claims, then unlocks free exploration.

**Rationale:**
- User experiences the magic, doesn't just see it
- Each step proves a specific claim (zones, config, flywheel)
- Tutorial completion populates dashboard with real telemetry
- Free exploration lets developers dig deeper

**Tutorial Steps:**
1. "Draft an email" → Yellow zone pauses for approval
2. Edit config → same action auto-executes (no reload proof)
3. "Summarize notes" 3x → Skill Flywheel triggers

**Rejected Alternatives:**
- **No tutorial:** User might miss key features
- **Pre-loaded state:** User didn't do it, proof is weaker
- **5+ step tutorial:** Too long, loses attention

---

## Summary Table

| Decision | Choice | Key Rationale |
|----------|--------|---------------|
| ADR-001 | React + Vite SPA | Component composition, fast dev, static deploy |
| ADR-002 | useReducer | No deps, matches action-based pipeline |
| ADR-003 | JS objects as config | Native, no parser, editable in UI |
| ADR-004 | Simulated responses | Zero deps in Demo Mode, tier-based latency |
| ADR-005 | Memory-only state | Sovereignty, no persistence = no leakage |
| ADR-006 | Keyword matching | Fast, deterministic, no API in Demo |
| ADR-007 | Threshold of 3 | Achievable in tutorial, feels like learning |
| ADR-008 | Pipeline as hero | Proves invariant, always visible |
| ADR-009 | Minimal deps | Auditable, fast, simple |
| ADR-010 | Direct API calls | No backend, user controls keys |
| ADR-011 | Tutorial-gated | User does it, proof is experiential |
