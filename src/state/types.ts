/**
 * Grove Autonomaton Pattern Playground — Type Definitions
 *
 * These types define the entire application state.
 * If you understand these types, you understand the architecture.
 */

// =============================================================================
// PIPELINE — The five-stage invariant
// =============================================================================

/** The five stages every interaction traverses */
export type PipelineStage =
  | 'telemetry'    // Log input, create trace
  | 'recognition'  // Classify intent, select tier
  | 'compilation'  // Check skill cache, finalize routing
  | 'approval'     // Zone governance check
  | 'execution'    // Generate response

/** State of an individual pipeline stage */
export type StageState = 'idle' | 'active' | 'complete' | 'error'

/** Pipeline state for the current interaction */
export interface PipelineState {
  currentStage: PipelineStage | null
  stages: Record<PipelineStage, StageState>
  halted: boolean
  haltReason: HaltReason | null
}

/** Diagnostic info when pipeline halts (Digital Jidoka) */
export interface HaltReason {
  stage: PipelineStage
  error: string
  expected: string
  proposedFix: string
}

// =============================================================================
// ZONES — Sovereignty guardrails
// =============================================================================

/** The three governance zones */
export type Zone = 'green' | 'yellow' | 'red'

export interface ZoneDefinition {
  meaning: string      // e.g., "Autonomous Routine"
  allows: string[]     // What actions this zone permits
  description: string  // Human-readable explanation
}

export interface ZonesSchema {
  zones: Record<Zone, ZoneDefinition>
}

// =============================================================================
// TIERS — Cognitive routing
// =============================================================================

/** The four tiers of cognition */
export type Tier = 0 | 1 | 2 | 3

export interface TierConfig {
  latencyMs: number
  cost: number
  sovereignty: 'local' | 'cloud'
  label: string
}

// =============================================================================
// ROUTING — Declarative intent configuration
// =============================================================================

export interface IntentConfig {
  tier: 1 | 2 | 3      // Default tier (0 is reserved for cached skills)
  zone: Zone
  description: string
  keywords: string[]   // For demo mode intent matching
}

export interface RoutingConfig {
  intents: Record<string, IntentConfig>
}

// =============================================================================
// INTERACTIONS — The unit of work
// =============================================================================

export type InteractionStatus =
  | 'pending'    // In pipeline
  | 'approved'   // Human approved (yellow zone)
  | 'rejected'   // Human rejected (yellow zone)
  | 'executing'  // Live API call in flight (v0.5.0)
  | 'completed'  // Successfully executed
  | 'halted'     // Pipeline halted (Jidoka)

export interface Interaction {
  id: string
  timestamp: string
  input: string
  intent: string
  tier: Tier
  zone: Zone
  cost: number
  sovereignty: 'local' | 'cloud'
  confidence: number
  response: string | null
  status: InteractionStatus
  skillMatch: string | null  // ID of matched skill, if any
  mode: Mode
  patternCountAtCreation?: number  // Pattern count when this interaction was created (for "👀 Observed N/3" badge)
}

// =============================================================================
// SKILLS — The flywheel output
// =============================================================================

export interface Skill {
  id: string
  pattern: string       // Human-readable pattern description
  intentMatch: string   // The intent this skill handles
  approvedAt: string
  timesFired: number
  cumulativeSavings: number  // Total $ saved vs original tier
  originalTier: Tier
}

export interface SkillProposal {
  active: boolean
  intent: string | null
  pattern: string | null
  count: number
}

// =============================================================================
// TELEMETRY — Transparency by construction
// =============================================================================

export interface TelemetryEntry {
  id: string
  timestamp: string
  intent: string
  tier: Tier
  zone: Zone
  confidence: number
  cost: number
  mode: Mode
  latencyMs: number
  humanFeedback: 'approved' | 'rejected' | null
  skillMatch: string | null
  // Interactive mode additions
  modelUsed?: string
  tokensIn?: number
  tokensOut?: number
}

// =============================================================================
// OPERATING MODES
// =============================================================================

export type Mode = 'demo' | 'interactive'

export type CurrentView = 'sandbox' | 'foundry'

export interface ModelConfig {
  provider: string
  apiKey: string | null
  model: string
}

// =============================================================================
// TUTORIAL
// =============================================================================

export type TutorialStep = 0 | 1 | 2 | 3  // 0 = not started, 1-3 = steps

export interface TutorialState {
  active: boolean
  currentStep: TutorialStep
  completed: boolean
}

// =============================================================================
// FOUNDRY — Architectural compiler (v0.9.0)
// =============================================================================

export interface FoundryState {
  input: string
  isCompiling: boolean
  generatedPRD: string
  error: string | null
}

// =============================================================================
// FAILURE SIMULATION (Andon Cord)
// =============================================================================

export type FailureType =
  | 'none'
  | 'api_timeout'
  | 'low_confidence'
  | 'hallucination_detected'

// =============================================================================
// DASHBOARD METRICS
// =============================================================================

export interface Metrics {
  totalCost: number
  interactionCount: number
  tierHistory: number[]         // For calculating average
  localCount: number            // For calculating % local
  skillsFired: number
  costHistory: number[]         // For the trend chart
}

// =============================================================================
// APPLICATION STATE — The whole picture
// =============================================================================

export interface AppState {
  // Operating mode
  mode: Mode

  // Model configuration (Interactive mode)
  // Tier 0 uses local_memory provider (cached skills, no API call)
  modelConfig: {
    tier0: ModelConfig
    tier1: ModelConfig
    tier2: ModelConfig
    tier3: ModelConfig
  }

  // Declarative configuration (editable)
  routingConfig: RoutingConfig
  zonesSchema: ZonesSchema

  // Pipeline state
  pipeline: PipelineState

  // Interactions
  interactions: Interaction[]
  pendingApproval: Interaction | null

  // Skills (the flywheel output)
  skills: Skill[]
  patternCounts: Record<string, number>  // intent -> count
  skillProposal: SkillProposal

  // Dashboard metrics
  metrics: Metrics

  // Telemetry (audit trail)
  telemetry: TelemetryEntry[]
  selectedTelemetryId: string | null
  selectedInteractionId: string | null

  // Tutorial
  tutorial: TutorialState

  // Failure simulation (Andon cord)
  simulateFailure: FailureType

  // UI state
  configRipple: boolean  // Triggers the "no deploy" animation
  currentView: CurrentView  // Active view (v0.8.0)

  // Deck overlay (v0.7.1)
  isDeckOpen: boolean
  activeSlideIndex: number

  // Foundry (v0.9.0)
  foundry: FoundryState
}

// =============================================================================
// ACTIONS — State transitions
// =============================================================================

export type AppAction =
  // Mode
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_MODEL_CONFIG'; tier: 1 | 2 | 3; config: Partial<ModelConfig> }
  | { type: 'SET_ALL_MODEL_CONFIGS'; config: Partial<ModelConfig> }

  // Config
  | { type: 'UPDATE_ROUTING_CONFIG'; config: RoutingConfig }
  | { type: 'UPDATE_ZONES_SCHEMA'; schema: ZonesSchema }
  | { type: 'TRIGGER_CONFIG_RIPPLE' }
  | { type: 'CLEAR_CONFIG_RIPPLE' }

  // Pipeline
  | { type: 'SET_PIPELINE_STAGE'; stage: PipelineStage; state: StageState }
  | { type: 'ADVANCE_PIPELINE' }
  | { type: 'RESET_PIPELINE' }
  | { type: 'HALT_PIPELINE'; reason: HaltReason }

  // Interactions
  | { type: 'SUBMIT_INPUT'; input: string }
  | { type: 'SET_PENDING_APPROVAL'; interaction: Interaction }
  | { type: 'APPROVE_INTERACTION' }
  | { type: 'REJECT_INTERACTION' }
  | { type: 'COMPLETE_INTERACTION'; response: string; telemetry: Partial<TelemetryEntry> }
  | { type: 'ADD_INTERACTION'; interaction: Interaction }
  | { type: 'UPDATE_INTERACTION_STATUS'; id: string; status: InteractionStatus }

  // Skills
  | { type: 'INCREMENT_PATTERN'; intent: string }
  | { type: 'PROPOSE_SKILL'; intent: string; pattern: string; count: number }
  | { type: 'APPROVE_SKILL' }
  | { type: 'REJECT_SKILL' }
  | { type: 'FIRE_SKILL'; skillId: string; savings: number }

  // Telemetry
  | { type: 'ADD_TELEMETRY'; entry: TelemetryEntry }
  | { type: 'SELECT_TELEMETRY'; id: string | null }
  | { type: 'SELECT_INTERACTION'; id: string | null }

  // Tutorial
  | { type: 'START_TUTORIAL' }
  | { type: 'ADVANCE_TUTORIAL' }
  | { type: 'SKIP_TUTORIAL' }
  | { type: 'COMPLETE_TUTORIAL' }

  // Failure simulation
  | { type: 'SET_FAILURE_SIMULATION'; failureType: FailureType }

  // Metrics
  | { type: 'UPDATE_METRICS'; delta: Partial<Metrics> }

  // Deck overlay (v0.7.1)
  | { type: 'OPEN_DECK' }
  | { type: 'CLOSE_DECK' }
  | { type: 'SET_ACTIVE_SLIDE'; index: number }

  // View routing (v0.8.0)
  | { type: 'SET_VIEW'; view: CurrentView }

  // Foundry (v0.9.0)
  | { type: 'SET_FOUNDRY_INPUT'; input: string }
  | { type: 'START_FOUNDRY_COMPILATION' }
  | { type: 'APPEND_FOUNDRY_CHUNK'; chunk: string }
  | { type: 'COMPLETE_FOUNDRY_COMPILATION' }
  | { type: 'FAIL_FOUNDRY_COMPILATION'; error: string }
  | { type: 'CLEAR_FOUNDRY' }
