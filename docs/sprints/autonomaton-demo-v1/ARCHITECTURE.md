# Grove Autonomaton Pattern Playground — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GROVE AUTONOMATON PLAYGROUND                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │   Header    │  │      Mode Toggle        │  │    Model Config         │  │
│  │             │  │   Demo ◉ Interactive    │  │    Tier 1: [Haiku ▼]   │  │
│  └─────────────┘  └─────────────────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    FIVE-STAGE PIPELINE (Hero Element)               │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│    │
│  │  │Telemetry │→ │Recognition│→│Compilation│→│ Approval │→│Execution││    │
│  │  │    ●     │  │    ○     │  │    ○     │  │    ○     │  │   ○    ││    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └────────┘│    │
│  └─────────────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────┐  ┌──────────────────────────────────┐  │
│  │       DASHBOARD (Top Bar)      │  │         SKILLS LIBRARY           │  │
│  │  Cost: $0.42  │ Avg Tier: 1.3  │  │  ┌─────────────────────────────┐ │  │
│  │  % Local: 67% │ Skills: 4      │  │  │ summarize_notes (Tier 0)   │ │  │
│  │  ═══════════════════════════   │  │  │ capture_idea (Tier 0)      │ │  │
│  │  [Cost Trend Chart ↘]          │  │  └─────────────────────────────┘ │  │
│  └────────────────────────────────┘  └──────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  ┌────────────────────────────┐  │
│  │        INTERACTION PANE              │  │      CONFIG EDITOR         │  │
│  │  ┌────────────────────────────────┐  │  │  ┌──────────────────────┐  │  │
│  │  │ User: "Draft an email"         │  │  │  │ [routing.config]     │  │  │
│  │  │ ┌────────────────────────────┐ │  │  │  │ [zones.schema]       │  │  │
│  │  │ │ Tier: 2 │ Zone: 🟡 Yellow  │ │  │  │  ├──────────────────────┤  │  │
│  │  │ │ Cost: $0.01 │ Cloud        │ │  │  │  │ intents:             │  │  │
│  │  │ └────────────────────────────┘ │  │  │  │   draft_email:       │  │  │
│  │  │ ┌────────────────────────────┐ │  │  │  │     tier: 2          │  │  │
│  │  │ │ APPROVAL REQUIRED          │ │  │  │  │     zone: yellow     │  │  │
│  │  │ │ [Approve] [Reject]         │ │  │  │  │                      │  │  │
│  │  │ └────────────────────────────┘ │  │  │  └──────────────────────┘  │  │
│  │  └────────────────────────────────┘  │  │  [Validation: ✓ Valid]     │  │
│  │  ┌────────────────────────────────┐  │  └────────────────────────────┘  │
│  │  │ > Type your request...        │  │                                   │
│  │  └────────────────────────────────┘  │                                   │
│  └──────────────────────────────────────┘                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    TELEMETRY STREAM (Monospace)                     │    │
│  │  {"ts":"2026-03-04T13:15:00Z","intent":"draft_email","tier":2,...}  │    │
│  │  {"ts":"2026-03-04T13:14:30Z","intent":"capture_idea","tier":0,...} │    │
│  │  [Export Audit Log]                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── Header
│   ├── Logo & Tagline
│   ├── ModeToggle (Demo/Interactive)
│   └── ModelConfigPanel (per-tier dropdowns + API key inputs)
│
├── PipelineVisualization (Hero Element)
│   ├── PipelineStage (x5: Telemetry, Recognition, Compilation, Approval, Execution)
│   └── PipelineConnector (arrows between stages)
│
├── Dashboard
│   ├── MetricCard (x4: Total Cost, Avg Tier, % Local, Skills Count)
│   └── CostTrendChart (line chart, cost over time)
│
├── MainContent (split pane)
│   ├── LeftPane
│   │   ├── InteractionPane
│   │   │   ├── InteractionList
│   │   │   │   └── InteractionCard (shows tier, zone, cost, response)
│   │   │   │       ├── TierBadge
│   │   │   │       ├── ZoneBadge (color-coded)
│   │   │   │       ├── CostDisplay
│   │   │   │       └── ApprovalCard (for Yellow zone)
│   │   │   └── InputArea
│   │   └── SkillsLibrary
│   │       └── SkillCard (pattern, tier 0, savings, times fired)
│   │
│   └── RightPane
│       └── ConfigEditor
│           ├── TabBar (routing.config | zones.schema)
│           ├── CodeEditor (Monaco-lite or monospace textarea)
│           └── ValidationStatus
│
├── TelemetryStream
│   ├── TelemetryEntry (JSON block, clickable)
│   └── ExportButton
│
├── TutorialOverlay (guided 3-step onboarding)
│   └── TutorialStep
│
├── SkillProposalModal (Flywheel trigger)
│
├── DiagnosticCard (Jidoka halt state)
│
└── Animations
    ├── ConfigRipple (no-deploy proof)
    └── CostEvaporation (tier migration)
```

---

## State Architecture

### Central State (useReducer)

```typescript
interface AppState {
  // Operating Mode
  mode: 'demo' | 'interactive';

  // Model Configuration (Interactive Mode)
  modelConfig: {
    tier1: { provider: string; apiKey: string | null };
    tier2: { provider: string; apiKey: string | null };
    tier3: { provider: string; apiKey: string | null };
  };

  // Configuration Files (editable)
  routingConfig: RoutingConfig;
  zonesSchema: ZonesSchema;

  // Pipeline State
  pipeline: {
    currentStage: PipelineStage | null;
    stages: {
      telemetry: StageState;
      recognition: StageState;
      compilation: StageState;
      approval: StageState;
      execution: StageState;
    };
    halted: boolean;
    haltReason: DiagnosticInfo | null;
  };

  // Interactions
  interactions: Interaction[];
  currentInteraction: Interaction | null;
  pendingApproval: Interaction | null;

  // Skills Library
  skills: Skill[];
  patternCounts: Map<string, PatternCount>;

  // Dashboard Metrics
  metrics: {
    totalCost: number;
    interactionCount: number;
    tierHistory: number[];
    localCount: number;
  };

  // Telemetry
  telemetry: TelemetryEntry[];
  selectedTelemetryId: string | null;

  // Tutorial
  tutorial: {
    active: boolean;
    currentStep: 0 | 1 | 2 | 3;
    completed: boolean;
  };
}

type PipelineStage = 'telemetry' | 'recognition' | 'compilation' | 'approval' | 'execution';

type StageState = 'idle' | 'active' | 'complete' | 'error';

interface Interaction {
  id: string;
  timestamp: string;
  input: string;
  intent: string;
  tier: 0 | 1 | 2 | 3;
  zone: 'green' | 'yellow' | 'red';
  cost: number;
  sovereignty: 'local' | 'cloud';
  confidence: number;
  response: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'halted';
  skillMatch: string | null;
  mode: 'demo' | 'interactive';
}

interface Skill {
  id: string;
  pattern: string;
  intentMatch: string;
  approvedAt: string;
  timesFired: number;
  cumulativeSavings: number;
  originalTier: number;
}

interface TelemetryEntry {
  id: string;
  timestamp: string;
  intent: string;
  tier: number;
  zone: string;
  confidence: number;
  cost: number;
  mode: 'demo' | 'interactive';
  model_used?: string;
  tokens_in?: number;
  tokens_out?: number;
  latency_ms: number;
  human_feedback?: 'approved' | 'rejected' | null;
  response_hash?: string;
}
```

---

## Data Flow: Interaction Lifecycle

```
User Input
    │
    ▼
┌───────────────────────────────────────────────────────────────────┐
│ STAGE 1: TELEMETRY                                                │
│ • Log input with timestamp                                        │
│ • Create TelemetryEntry skeleton                                  │
│ • Pipeline stage: telemetry → active                              │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────────┐
│ STAGE 2: RECOGNITION                                              │
│ • Classify intent against routingConfig                           │
│ • Keyword matching (demo) or LLM classification (interactive)     │
│ • Determine: intent, tier, zone, confidence                       │
│ • Pipeline stage: recognition → active                            │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────────┐
│ STAGE 3: COMPILATION                                              │
│ • Check Skills Library for cached pattern match                   │
│ • If match → override tier to 0, mark as skill match              │
│ • Calculate cost based on tier                                    │
│ • Pipeline stage: compilation → active                            │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────────┐
│ STAGE 4: APPROVAL                                                 │
│ • Check zone from zonesSchema                                     │
│ • GREEN: Auto-approve, brief flash, continue                      │
│ • YELLOW: Show ApprovalCard, WAIT for human action                │
│ • RED: Show info-only card, NO action buttons, STOP               │
│ • Pipeline stage: approval → active (pauses if yellow/red)        │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼ (if approved or green)
┌───────────────────────────────────────────────────────────────────┐
│ STAGE 5: EXECUTION                                                │
│ • Generate response:                                              │
│   - Demo Mode: Simulated with tier-based latency                  │
│   - Interactive Mode: Real LLM API call                           │
│ • Update interaction with response                                │
│ • Pipeline stage: execution → complete                            │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────────┐
│ POST-EXECUTION                                                    │
│ • Finalize TelemetryEntry, add to stream                          │
│ • Update pattern counts                                           │
│ • Check Skill Flywheel threshold (3+ repeats)                     │
│ • Update dashboard metrics                                        │
│ • If skill fired at Tier 0 → trigger CostEvaporation animation    │
└───────────────────────────────────────────────────────────────────┘
```

---

## Configuration Schemas

### routing.config (YAML-like, stored as JS object)

```typescript
interface RoutingConfig {
  intents: {
    [intentName: string]: {
      tier: 1 | 2 | 3;
      zone: 'green' | 'yellow' | 'red';
      description: string;
      keywords?: string[]; // For demo mode matching
    };
  };
}

// Default configuration
const defaultRoutingConfig: RoutingConfig = {
  intents: {
    capture_idea: {
      tier: 1,
      zone: 'green',
      description: 'Quick thought capture',
      keywords: ['capture', 'idea', 'thought', 'note', 'jot']
    },
    summarize_notes: {
      tier: 1,
      zone: 'green',
      description: 'Summarize recent notes',
      keywords: ['summarize', 'summary', 'notes', 'recap']
    },
    research_topic: {
      tier: 2,
      zone: 'yellow',
      description: 'Research a topic in depth',
      keywords: ['research', 'investigate', 'look into', 'deep dive']
    },
    draft_email: {
      tier: 2,
      zone: 'yellow',
      description: 'Draft an email from context',
      keywords: ['draft', 'email', 'write email', 'compose']
    },
    propose_skill: {
      tier: 2,
      zone: 'yellow',
      description: 'Propose a new automated skill',
      keywords: ['propose', 'skill', 'automate', 'workflow']
    },
    analyze_data: {
      tier: 3,
      zone: 'yellow',
      description: 'Complex data analysis',
      keywords: ['analyze', 'data', 'analysis', 'metrics']
    },
    deploy_change: {
      tier: 3,
      zone: 'red',
      description: 'Deploy a system change',
      keywords: ['deploy', 'release', 'push', 'ship']
    },
    delete_data: {
      tier: 3,
      zone: 'red',
      description: 'Destructive data operation',
      keywords: ['delete', 'remove', 'destroy', 'wipe']
    }
  }
};
```

### zones.schema

```typescript
interface ZonesSchema {
  zones: {
    green: ZoneDefinition;
    yellow: ZoneDefinition;
    red: ZoneDefinition;
  };
}

interface ZoneDefinition {
  meaning: string;
  allows: string[];
  description: string;
}

const defaultZonesSchema: ZonesSchema = {
  zones: {
    green: {
      meaning: 'Autonomous Routine',
      allows: ['execute_confirmed_skills', 'write_telemetry'],
      description: 'System executes without asking. Confirmed patterns, low-risk ops.'
    },
    yellow: {
      meaning: 'Supervised Proposals',
      allows: ['propose_new_skill', 'propose_rule_change'],
      description: 'System proposes, human approves. Medium-risk operations.'
    },
    red: {
      meaning: 'Human-Only',
      allows: ['surface_information_only'],
      description: 'System surfaces info and waits. Architecture decisions, security changes.'
    }
  }
};
```

---

## Cognitive Tier Implementation

### Demo Mode (Simulated)

```typescript
interface TierConfig {
  latencyMs: number;
  cost: number;
  sovereignty: 'local' | 'cloud';
}

const TIER_CONFIG: Record<number, TierConfig> = {
  0: { latencyMs: 50, cost: 0.00, sovereignty: 'local' },    // Cached skill
  1: { latencyMs: 200, cost: 0.001, sovereignty: 'local' },  // Cheap/local
  2: { latencyMs: 800, cost: 0.01, sovereignty: 'cloud' },   // Premium
  3: { latencyMs: 1500, cost: 0.10, sovereignty: 'cloud' }   // Apex
};

// Simulated responses by intent (for demo mode)
const SIMULATED_RESPONSES: Record<string, string> = {
  capture_idea: "Got it! I've captured your idea about {topic}. Added to your notes.",
  summarize_notes: "Here's a summary of your recent notes:\n\n• {point1}\n• {point2}\n• {point3}",
  research_topic: "Research findings on {topic}:\n\n**Key Insights:**\n1. {insight1}\n2. {insight2}\n\n**Recommended Actions:**\n- {action1}",
  draft_email: "Here's a draft email:\n\n---\nSubject: {subject}\n\nHi {recipient},\n\n{body}\n\nBest regards",
  // ... etc
};
```

### Interactive Mode (Real API)

```typescript
interface LLMProvider {
  name: string;
  endpoint: string;
  models: string[];
  formatRequest: (prompt: string, model: string) => RequestInit;
  parseResponse: (response: Response) => Promise<LLMResponse>;
}

const PROVIDERS: Record<string, LLMProvider> = {
  anthropic: {
    name: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-haiku-20240307', 'claude-sonnet-4-20250514', 'claude-opus-4-20250514'],
    formatRequest: (prompt, model) => ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '{API_KEY}',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    }),
    parseResponse: async (res) => {
      const data = await res.json();
      return {
        content: data.content[0].text,
        tokensIn: data.usage.input_tokens,
        tokensOut: data.usage.output_tokens
      };
    }
  },
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
    // ... similar structure
  }
};
```

---

## Key Animations

### 1. Pipeline Stage Progression
- Each stage has `idle` (gray), `active` (pulsing blue), `complete` (green check), `error` (red)
- Smooth transitions between states
- Connectors animate as flow progresses

### 2. Config Ripple ("No Deploy" Proof)
- When config saved: ripple wave emanates from editor
- Travels across screen to interaction pane
- Brief glow on affected interaction cards
- Duration: 600ms

### 3. Cost Evaporation (Tier Migration)
- When Tier 0 skill fires instead of higher tier:
  - Cloud icon morphs to local/edge icon
  - Cost number strikes through with line
  - New cost ($0.00) fades in
  - "Cached" badge slides in
  - Subtle particle effect (cost "evaporating")
- Duration: 800ms

### 4. Zone Color Coding
- Green zone: `#22c55e` (green-500)
- Yellow zone: `#eab308` (yellow-500)
- Red zone: `#ef4444` (red-500)
- Applied consistently to badges, borders, backgrounds

### 5. Approval Card Entrance
- Slides up from interaction card
- Gentle bounce
- Buttons have hover states
- Approval = green flash, card collapses
- Rejection = red flash, card collapses

---

## File Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root component, state provider
├── index.css                   # Tailwind imports + custom styles
│
├── state/
│   ├── reducer.ts              # Central state reducer
│   ├── actions.ts              # Action creators
│   ├── types.ts                # TypeScript interfaces
│   └── context.tsx             # React context provider
│
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── ModeToggle.tsx
│   │   └── ModelConfigPanel.tsx
│   │
│   ├── Pipeline/
│   │   ├── PipelineVisualization.tsx
│   │   ├── PipelineStage.tsx
│   │   └── PipelineConnector.tsx
│   │
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── MetricCard.tsx
│   │   └── CostTrendChart.tsx
│   │
│   ├── Interaction/
│   │   ├── InteractionPane.tsx
│   │   ├── InteractionList.tsx
│   │   ├── InteractionCard.tsx
│   │   ├── ApprovalCard.tsx
│   │   ├── InputArea.tsx
│   │   └── DiagnosticCard.tsx
│   │
│   ├── Config/
│   │   ├── ConfigEditor.tsx
│   │   ├── ConfigTabs.tsx
│   │   └── ValidationStatus.tsx
│   │
│   ├── Skills/
│   │   ├── SkillsLibrary.tsx
│   │   ├── SkillCard.tsx
│   │   └── SkillProposalModal.tsx
│   │
│   ├── Telemetry/
│   │   ├── TelemetryStream.tsx
│   │   ├── TelemetryEntry.tsx
│   │   └── ExportButton.tsx
│   │
│   ├── Tutorial/
│   │   ├── TutorialOverlay.tsx
│   │   └── TutorialStep.tsx
│   │
│   └── shared/
│       ├── ZoneBadge.tsx
│       ├── TierBadge.tsx
│       ├── CostDisplay.tsx
│       └── animations.ts
│
├── services/
│   ├── cognitive-router.ts     # Intent classification, tier selection
│   ├── skill-matcher.ts        # Pattern matching against skills
│   ├── llm-providers.ts        # API client implementations
│   └── telemetry.ts            # Telemetry entry creation
│
├── config/
│   ├── default-routing.ts      # Default routing.config
│   ├── default-zones.ts        # Default zones.schema
│   └── simulated-responses.ts  # Demo mode responses
│
└── utils/
    ├── yaml-parser.ts          # Parse/serialize YAML-like config
    ├── hash.ts                 # Response hashing for audit
    └── export.ts               # Audit log export
```

---

## External Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

**Note:** Minimal dependencies. No state management library (React's useReducer is sufficient). No charting library (simple SVG or CSS for cost trend). No Monaco editor (styled textarea with basic validation).

---

## Security Considerations

1. **API Keys (Interactive Mode)**
   - Stored in React state only (memory)
   - Never written to localStorage/sessionStorage
   - Never included in telemetry entries
   - Cleared on mode switch to Demo
   - Cleared on page close

2. **CORS**
   - Anthropic API supports browser-based calls
   - OpenAI may require proxy (document limitation)

3. **Telemetry Privacy**
   - Response content NOT logged in full
   - Only hash of response stored
   - No PII extraction or storage
