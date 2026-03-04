# Grove Autonomaton Pattern Playground — Execution Prompt

## Instant Orientation

**Project:** `C:\github\grove-autonomaton-example`
**Sprint:** `autonomaton-demo-v1`
**Goal:** Build a browser-based demo proving 9 Autonomaton Pattern claims through user interaction

---

## Attention Anchoring Protocol

**Before any major decision, re-read:**
1. `docs/sprints/autonomaton-demo-v1/SPEC.md` — Live Status + Attention Anchor
2. This document's "What We're Building" section

**After every Epic completion:**
- Re-read SPEC.md Goals and Acceptance Criteria
- Verify the claim(s) that epic was meant to prove

**Before committing:**
- Verify: Does this change help prove one of the 9 claims?

---

## What We're Building

A **single-page React application** that proves the Grove Autonomaton pattern through direct user experience.

**The Demo Must:**
1. Show every interaction traversing 5 pipeline stages (Telemetry → Recognition → Compilation → Approval → Execution)
2. Display cognitive tier selection (0-3) with cost and sovereignty profile
3. Allow live editing of `routing.config` and `zones.schema` with immediate effect
4. Enforce zone governance: Green auto-executes, Yellow pauses for approval, Red shows info only
5. Learn skills after 3 repeated patterns (Skill Flywheel)
6. Show cost decreasing as skills accumulate (The Ratchet)
7. Provide full audit trail with click-to-highlight correlation
8. Demonstrate model independence (swap labels, architecture survives)
9. Halt on failure with diagnostic card (Digital Jidoka)

**Success:** A developer completes the 3-step tutorial in 3 minutes and thinks "This is how it should work."

---

## Technical Stack

```
React 18 + TypeScript + Vite + Tailwind CSS
```

**No external dependencies beyond these.** No charting library, no state management library, no Monaco editor.

---

## Pre-Execution Verification

```bash
cd /c/github/grove-autonomaton-example

# Verify Node.js available
node --version  # Should be 18+

# Verify directory is empty (except docs)
ls -la
```

---

## Epic Execution Sequence

Execute epics in order. Each builds on the previous.

### Epic 1: Project Scaffolding

```bash
# Initialize Vite + React + TypeScript
npm create vite@latest . -- --template react-ts
npm install

# Add Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        zone: {
          green: '#22c55e',
          yellow: '#eab308',
          red: '#ef4444',
        },
        tier: {
          0: '#8b5cf6', // purple - cached
          1: '#3b82f6', // blue - cheap
          2: '#f97316', // orange - premium
          3: '#dc2626', // red - apex
        }
      }
    },
  },
  plugins: [],
}
```

**Configure `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-900 text-slate-100 font-sans;
  }
}

/* Pipeline stage animations */
@keyframes pulse-active {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.stage-active {
  animation: pulse-active 1s ease-in-out infinite;
}

/* Config ripple animation */
@keyframes config-ripple {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

.config-ripple {
  animation: config-ripple 0.6s ease-out forwards;
}

/* Cost evaporation */
@keyframes cost-evaporate {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}

.cost-evaporating {
  animation: cost-evaporate 0.8s ease-out forwards;
}
```

**Create directory structure:**
```bash
mkdir -p src/state src/components/{Pipeline,Dashboard,Interaction,Config,Skills,Telemetry,Tutorial,Header,shared} src/services src/config src/utils
```

**Verification:**
```bash
npm run dev
# Should see Vite default page at localhost:5173
```

---

### Epic 2-3: Core State & Types

**Create `src/state/types.ts`:**
```typescript
export type PipelineStage = 'telemetry' | 'recognition' | 'compilation' | 'approval' | 'execution';
export type StageState = 'idle' | 'active' | 'complete' | 'error';
export type Zone = 'green' | 'yellow' | 'red';
export type Mode = 'demo' | 'interactive';

export interface Interaction {
  id: string;
  timestamp: string;
  input: string;
  intent: string;
  tier: 0 | 1 | 2 | 3;
  zone: Zone;
  cost: number;
  sovereignty: 'local' | 'cloud';
  confidence: number;
  response: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'halted';
  skillMatch: string | null;
  mode: Mode;
}

export interface Skill {
  id: string;
  pattern: string;
  intentMatch: string;
  approvedAt: string;
  timesFired: number;
  cumulativeSavings: number;
  originalTier: number;
}

export interface TelemetryEntry {
  id: string;
  timestamp: string;
  intent: string;
  tier: number;
  zone: string;
  confidence: number;
  cost: number;
  mode: Mode;
  latency_ms: number;
  human_feedback?: 'approved' | 'rejected' | null;
}

export interface IntentConfig {
  tier: 1 | 2 | 3;
  zone: Zone;
  description: string;
  keywords: string[];
}

export interface RoutingConfig {
  intents: Record<string, IntentConfig>;
}

export interface ZoneDefinition {
  meaning: string;
  allows: string[];
  description: string;
}

export interface ZonesSchema {
  zones: Record<Zone, ZoneDefinition>;
}

export interface AppState {
  mode: Mode;
  modelConfig: {
    tier1: { provider: string; apiKey: string | null };
    tier2: { provider: string; apiKey: string | null };
    tier3: { provider: string; apiKey: string | null };
  };
  routingConfig: RoutingConfig;
  zonesSchema: ZonesSchema;
  pipeline: {
    currentStage: PipelineStage | null;
    stages: Record<PipelineStage, StageState>;
    halted: boolean;
    haltReason: string | null;
  };
  interactions: Interaction[];
  currentInteraction: Interaction | null;
  pendingApproval: Interaction | null;
  skills: Skill[];
  patternCounts: Record<string, number>;
  metrics: {
    totalCost: number;
    interactionCount: number;
    tierHistory: number[];
    localCount: number;
  };
  telemetry: TelemetryEntry[];
  selectedTelemetryId: string | null;
  selectedInteractionId: string | null;
  tutorial: {
    active: boolean;
    currentStep: 0 | 1 | 2 | 3;
    completed: boolean;
  };
  skillProposal: {
    active: boolean;
    intent: string | null;
    pattern: string | null;
  };
  configRipple: boolean;
}
```

**Create `src/config/default-routing.ts`:**
```typescript
import { RoutingConfig } from '../state/types';

export const defaultRoutingConfig: RoutingConfig = {
  intents: {
    capture_idea: {
      tier: 1,
      zone: 'green',
      description: 'Quick thought capture',
      keywords: ['capture', 'idea', 'thought', 'note', 'jot', 'remember']
    },
    summarize_notes: {
      tier: 1,
      zone: 'green',
      description: 'Summarize recent notes',
      keywords: ['summarize', 'summary', 'notes', 'recap', 'overview']
    },
    research_topic: {
      tier: 2,
      zone: 'yellow',
      description: 'Research a topic in depth',
      keywords: ['research', 'investigate', 'look into', 'deep dive', 'explore']
    },
    draft_email: {
      tier: 2,
      zone: 'yellow',
      description: 'Draft an email from context',
      keywords: ['draft', 'email', 'write email', 'compose', 'message']
    },
    propose_skill: {
      tier: 2,
      zone: 'yellow',
      description: 'Propose a new automated skill',
      keywords: ['propose', 'skill', 'automate', 'workflow', 'automation']
    },
    analyze_data: {
      tier: 3,
      zone: 'yellow',
      description: 'Complex data analysis',
      keywords: ['analyze', 'data', 'analysis', 'metrics', 'statistics']
    },
    deploy_change: {
      tier: 3,
      zone: 'red',
      description: 'Deploy a system change',
      keywords: ['deploy', 'release', 'push', 'ship', 'publish']
    },
    delete_data: {
      tier: 3,
      zone: 'red',
      description: 'Destructive data operation',
      keywords: ['delete', 'remove', 'destroy', 'wipe', 'erase']
    }
  }
};
```

**Create `src/config/default-zones.ts`:**
```typescript
import { ZonesSchema } from '../state/types';

export const defaultZonesSchema: ZonesSchema = {
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

**Create `src/config/tier-config.ts`:**
```typescript
export const TIER_CONFIG = {
  0: { latencyMs: 50, cost: 0.00, sovereignty: 'local' as const, label: 'Cached Skill' },
  1: { latencyMs: 200, cost: 0.001, sovereignty: 'local' as const, label: 'Cheap Cognition' },
  2: { latencyMs: 800, cost: 0.01, sovereignty: 'cloud' as const, label: 'Premium Cognition' },
  3: { latencyMs: 1500, cost: 0.10, sovereignty: 'cloud' as const, label: 'Apex Cognition' }
};
```

---

### Key Implementation Patterns

**Pipeline Stage Component:**
```tsx
// src/components/Pipeline/PipelineStage.tsx
interface PipelineStageProps {
  name: string;
  state: StageState;
  icon: React.ReactNode;
}

export function PipelineStage({ name, state, icon }: PipelineStageProps) {
  const stateStyles = {
    idle: 'bg-slate-700 text-slate-400',
    active: 'bg-blue-600 text-white stage-active',
    complete: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white'
  };

  return (
    <div className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${stateStyles[state]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs font-medium">{name}</div>
    </div>
  );
}
```

**Zone Badge Component:**
```tsx
// src/components/shared/ZoneBadge.tsx
interface ZoneBadgeProps {
  zone: Zone;
}

export function ZoneBadge({ zone }: ZoneBadgeProps) {
  const styles = {
    green: 'bg-zone-green/20 text-zone-green border-zone-green',
    yellow: 'bg-zone-yellow/20 text-zone-yellow border-zone-yellow',
    red: 'bg-zone-red/20 text-zone-red border-zone-red'
  };

  const labels = {
    green: 'Autonomous',
    yellow: 'Supervised',
    red: 'Human-Only'
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${styles[zone]}`}>
      {labels[zone]}
    </span>
  );
}
```

**Cognitive Router (Demo Mode):**
```typescript
// src/services/cognitive-router.ts
export function classifyIntent(input: string, config: RoutingConfig): {
  intent: string;
  tier: 1 | 2 | 3;
  zone: Zone;
  confidence: number;
} {
  const inputLower = input.toLowerCase();
  let bestMatch = { intent: 'unknown', tier: 2 as const, zone: 'yellow' as Zone, confidence: 0 };

  for (const [intentName, intentConfig] of Object.entries(config.intents)) {
    for (const keyword of intentConfig.keywords) {
      if (inputLower.includes(keyword.toLowerCase())) {
        const confidence = keyword.length / input.length;
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            intent: intentName,
            tier: intentConfig.tier,
            zone: intentConfig.zone,
            confidence: Math.min(0.95, confidence + 0.5)
          };
        }
      }
    }
  }

  return bestMatch;
}
```

---

### Post-Epic Verification Protocol

After completing each epic:

```bash
# 1. Build check
npm run build

# 2. Dev server check
npm run dev
# Manually verify the epic's acceptance criteria

# 3. Update DEVLOG
echo "## Epic N Complete - $(date -Iseconds)" >> docs/sprints/autonomaton-demo-v1/DEVLOG.md
echo "- Acceptance criteria verified" >> docs/sprints/autonomaton-demo-v1/DEVLOG.md

# 4. Commit
git add -A
git commit -m "feat: {epic description}"

# 5. ATTENTION ANCHOR: Re-read SPEC.md before next epic
cat docs/sprints/autonomaton-demo-v1/SPEC.md | head -50
```

---

## The 9 Claims — Verification Commands

Run these after all epics complete:

| Claim | Verification |
|-------|--------------|
| 1. Pipeline Invariant | Type anything → watch 5 stages light up in sequence |
| 2. Cognitive Router | Check: tier badge, cost display, sovereignty label |
| 3. Declarative Config | Edit `draft_email` zone → type "draft email" → behavior changes |
| 4. Zone Governance | Green: auto-execute. Yellow: approval card. Red: info only. |
| 5. Skill Flywheel | "Summarize notes" 3x → proposal appears |
| 6. The Ratchet | Approve skill → next match shows Tier 0, cost $0.00 |
| 7. Transparency | Click interaction → telemetry highlights. Export works. |
| 8. Model Independence | Change model dropdown → routing unchanged |
| 9. Digital Jidoka | Type gibberish with low confidence → pipeline halts |

---

## Final Checklist

- [ ] Tutorial completes in under 3 minutes
- [ ] All 9 claims are demonstrable
- [ ] No console errors
- [ ] Professional visual polish
- [ ] Export audit log works
- [ ] Mode toggle (Demo/Interactive) works
- [ ] README.md created with setup instructions

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/state/reducer.ts` | Central state management |
| `src/services/cognitive-router.ts` | Intent classification |
| `src/services/pipeline-orchestrator.ts` | Interaction lifecycle |
| `src/components/Pipeline/PipelineVisualization.tsx` | Hero element |
| `src/components/Config/ConfigEditor.tsx` | Live config editing |
| `src/components/Skills/SkillProposalModal.tsx` | Flywheel trigger |
| `src/components/Tutorial/TutorialOverlay.tsx` | Guided onboarding |

---

## Attention Anchor (Final)

**We are building:** A browser demo that proves 9 Autonomaton claims through user action.
**Success looks like:** Developer completes tutorial → understands the pattern → wants to implement it.
**We are NOT:** Building production infrastructure or a full application.
**Current phase:** Execution
**Next action:** Start with Epic 1: Project Scaffolding
