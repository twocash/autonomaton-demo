/**
 * Application Reducer — State Transitions
 *
 * All state changes go through here.
 * If you want to understand what the app can do, read the action handlers.
 */

import type { AppState, AppAction, PipelineStage, StageState } from './types'
import { defaultRoutingConfig } from '../config/routing'
import { defaultZonesSchema } from '../config/zones'

// =============================================================================
// INITIAL STATE
// =============================================================================

export const initialState: AppState = {
  mode: 'demo',

  modelConfig: {
    tier0: { provider: 'local_memory', apiKey: null, model: 'cached_skill' },
    tier1: { provider: 'anthropic', apiKey: null, model: 'claude-3-haiku-20240307' },
    tier2: { provider: 'anthropic', apiKey: null, model: 'claude-sonnet-4-20250514' },
    tier3: { provider: 'anthropic', apiKey: null, model: 'claude-opus-4-20250514' },
  },

  routingConfig: defaultRoutingConfig,
  zonesSchema: defaultZonesSchema,

  pipeline: {
    currentStage: null,
    stages: {
      telemetry: 'idle',
      recognition: 'idle',
      compilation: 'idle',
      approval: 'idle',
      execution: 'idle',
    },
    halted: false,
    haltReason: null,
  },

  interactions: [],
  pendingApproval: null,

  skills: [],
  patternCounts: {},
  skillProposal: { active: false, intent: null, pattern: null, count: 0 },

  metrics: {
    totalCost: 0,
    interactionCount: 0,
    tierHistory: [],
    localCount: 0,
    skillsFired: 0,
    costHistory: [],
  },

  telemetry: [],
  selectedTelemetryId: null,
  selectedInteractionId: null,

  tutorial: {
    active: true,  // Start with tutorial
    currentStep: 0,
    completed: false,
  },

  simulateFailure: 'none',
  configRipple: false,
  currentView: 'sandbox',

  // Deck overlay (v0.7.1)
  // Synchronous localStorage check prevents UI flash on first visit
  isDeckOpen: typeof window !== 'undefined' && !localStorage.getItem('grove_hasSeenDeck'),
  activeSlideIndex: 0,

  // Foundry (v0.9.0)
  foundry: {
    input: '',
    isCompiling: false,
    generatedPRD: '',
    error: null,
  },
}

// =============================================================================
// PIPELINE HELPERS
// =============================================================================

const STAGE_ORDER: PipelineStage[] = [
  'telemetry',
  'recognition',
  'compilation',
  'approval',
  'execution',
]

function getNextStage(current: PipelineStage | null): PipelineStage | null {
  if (!current) return 'telemetry'
  const idx = STAGE_ORDER.indexOf(current)
  return idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null
}

function resetPipelineStages(): Record<PipelineStage, StageState> {
  return {
    telemetry: 'idle',
    recognition: 'idle',
    compilation: 'idle',
    approval: 'idle',
    execution: 'idle',
  }
}

// =============================================================================
// REDUCER
// =============================================================================

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // =========================================================================
    // MODE
    // =========================================================================
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
        // Clear API keys when switching to demo mode (tier0 has no key)
        modelConfig: action.mode === 'demo'
          ? {
              tier0: state.modelConfig.tier0, // local_memory, no key
              tier1: { ...state.modelConfig.tier1, apiKey: null },
              tier2: { ...state.modelConfig.tier2, apiKey: null },
              tier3: { ...state.modelConfig.tier3, apiKey: null },
            }
          : state.modelConfig,
      }

    case 'SET_MODEL_CONFIG':
      return {
        ...state,
        modelConfig: {
          ...state.modelConfig,
          [`tier${action.tier}`]: {
            ...state.modelConfig[`tier${action.tier}` as keyof typeof state.modelConfig],
            ...action.config,
          },
        },
      }

    case 'SET_ALL_MODEL_CONFIGS':
      return {
        ...state,
        modelConfig: {
          tier0: state.modelConfig.tier0, // local_memory, immutable
          tier1: { ...state.modelConfig.tier1, ...action.config },
          tier2: { ...state.modelConfig.tier2, ...action.config },
          tier3: { ...state.modelConfig.tier3, ...action.config },
        },
      }

    // =========================================================================
    // CONFIG
    // =========================================================================
    case 'UPDATE_ROUTING_CONFIG':
      return { ...state, routingConfig: action.config }

    case 'UPDATE_ZONES_SCHEMA':
      return { ...state, zonesSchema: action.schema }

    case 'TRIGGER_CONFIG_RIPPLE':
      return { ...state, configRipple: true }

    case 'CLEAR_CONFIG_RIPPLE':
      return { ...state, configRipple: false }

    // =========================================================================
    // PIPELINE
    // =========================================================================
    case 'SET_PIPELINE_STAGE':
      return {
        ...state,
        pipeline: {
          ...state.pipeline,
          currentStage: action.stage,
          stages: {
            ...state.pipeline.stages,
            [action.stage]: action.state,
          },
        },
      }

    case 'ADVANCE_PIPELINE': {
      const nextStage = getNextStage(state.pipeline.currentStage)
      if (!nextStage) return state

      // Mark current stage complete, next stage active
      const newStages = { ...state.pipeline.stages }
      if (state.pipeline.currentStage) {
        newStages[state.pipeline.currentStage] = 'complete'
      }
      newStages[nextStage] = 'active'

      return {
        ...state,
        pipeline: {
          ...state.pipeline,
          currentStage: nextStage,
          stages: newStages,
        },
      }
    }

    case 'RESET_PIPELINE':
      // v0.4.1: Also clear 'halted' status on interactions
      return {
        ...state,
        pipeline: {
          currentStage: null,
          stages: resetPipelineStages(),
          halted: false,
          haltReason: null,
        },
        interactions: state.interactions.map((interaction) =>
          interaction.status === 'halted'
            ? { ...interaction, status: 'completed' as const }
            : interaction
        ),
      }

    case 'HALT_PIPELINE': {
      // v0.4.1: Also mark the last interaction as 'halted' for inline DiagnosticCard
      const lastInteractionIndex = state.interactions.length - 1
      return {
        ...state,
        pipeline: {
          ...state.pipeline,
          halted: true,
          haltReason: action.reason,
          stages: {
            ...state.pipeline.stages,
            [action.reason.stage]: 'error',
          },
        },
        interactions: lastInteractionIndex >= 0
          ? state.interactions.map((interaction, idx) =>
              idx === lastInteractionIndex
                ? { ...interaction, status: 'halted' as const }
                : interaction
            )
          : state.interactions,
      }
    }

    // =========================================================================
    // INTERACTIONS
    // =========================================================================
    case 'ADD_INTERACTION':
      return {
        ...state,
        interactions: [...state.interactions, action.interaction],
      }

    case 'SET_PENDING_APPROVAL':
      return { ...state, pendingApproval: action.interaction }

    case 'APPROVE_INTERACTION':
      if (!state.pendingApproval) return state
      return {
        ...state,
        pendingApproval: null,
        interactions: state.interactions.map((i) =>
          i.id === state.pendingApproval!.id
            ? { ...i, status: 'approved' as const }
            : i
        ),
      }

    case 'REJECT_INTERACTION':
      if (!state.pendingApproval) return state
      return {
        ...state,
        pendingApproval: null,
        interactions: state.interactions.map((i) =>
          i.id === state.pendingApproval!.id
            ? { ...i, status: 'rejected' as const }
            : i
        ),
      }

    case 'UPDATE_INTERACTION_STATUS':
      // v0.5.0: Update interaction status (e.g., to 'executing' during API call)
      return {
        ...state,
        interactions: state.interactions.map((i) =>
          i.id === action.id ? { ...i, status: action.status } : i
        ),
      }

    case 'COMPLETE_INTERACTION': {
      // Pipeline processes one interaction at a time, so the most recent is always current.
      // This LIFO assumption is safe because SUBMIT_INPUT → ... → COMPLETE_INTERACTION
      // is a synchronous sequence for a single interaction.
      const currentInteraction = state.interactions[state.interactions.length - 1]
      if (!currentInteraction) return state

      return {
        ...state,
        interactions: state.interactions.map((i) =>
          i.id === currentInteraction.id
            ? { ...i, response: action.response, status: 'completed' as const }
            : i
        ),
      }
    }

    // =========================================================================
    // SKILLS (THE FLYWHEEL)
    // =========================================================================
    case 'INCREMENT_PATTERN':
      return {
        ...state,
        patternCounts: {
          ...state.patternCounts,
          [action.intent]: (state.patternCounts[action.intent] || 0) + 1,
        },
      }

    case 'PROPOSE_SKILL':
      return {
        ...state,
        skillProposal: {
          active: true,
          intent: action.intent,
          pattern: action.pattern,
          count: action.count,
        },
      }

    case 'APPROVE_SKILL': {
      if (!state.skillProposal.intent) return state

      const newSkill = {
        id: `skill-${Date.now()}`,
        pattern: state.skillProposal.pattern || '',
        intentMatch: state.skillProposal.intent,
        approvedAt: new Date().toISOString(),
        timesFired: 0,
        cumulativeSavings: 0,
        originalTier: state.routingConfig.intents[state.skillProposal.intent]?.tier || 2,
      }

      return {
        ...state,
        skills: [...state.skills, newSkill],
        skillProposal: { active: false, intent: null, pattern: null, count: 0 },
        patternCounts: {
          ...state.patternCounts,
          [state.skillProposal.intent]: 0, // Reset count
        },
      }
    }

    case 'REJECT_SKILL':
      return {
        ...state,
        skillProposal: { active: false, intent: null, pattern: null, count: 0 },
      }

    case 'FIRE_SKILL':
      return {
        ...state,
        skills: state.skills.map((s) =>
          s.id === action.skillId
            ? {
                ...s,
                timesFired: s.timesFired + 1,
                cumulativeSavings: s.cumulativeSavings + action.savings,
              }
            : s
        ),
        metrics: {
          ...state.metrics,
          skillsFired: state.metrics.skillsFired + 1,
        },
      }

    // =========================================================================
    // TELEMETRY
    // =========================================================================
    case 'ADD_TELEMETRY':
      return {
        ...state,
        telemetry: [...state.telemetry, action.entry],
      }

    case 'SELECT_TELEMETRY':
      return { ...state, selectedTelemetryId: action.id }

    case 'SELECT_INTERACTION':
      return { ...state, selectedInteractionId: action.id }

    // =========================================================================
    // TUTORIAL
    // =========================================================================
    case 'START_TUTORIAL':
      return {
        ...state,
        tutorial: { active: true, currentStep: 1, completed: false },
      }

    case 'ADVANCE_TUTORIAL':
      return {
        ...state,
        tutorial: {
          ...state.tutorial,
          currentStep: Math.min(3, state.tutorial.currentStep + 1) as 0 | 1 | 2 | 3,
        },
      }

    case 'SKIP_TUTORIAL':
      return {
        ...state,
        tutorial: { active: false, currentStep: 0, completed: false },
      }

    case 'COMPLETE_TUTORIAL':
      return {
        ...state,
        tutorial: { active: false, currentStep: 3, completed: true },
      }

    // =========================================================================
    // FAILURE SIMULATION (ANDON CORD)
    // =========================================================================
    case 'SET_FAILURE_SIMULATION':
      return { ...state, simulateFailure: action.failureType }

    // =========================================================================
    // METRICS
    // =========================================================================
    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: {
          totalCost: state.metrics.totalCost + (action.delta.totalCost || 0),
          interactionCount: state.metrics.interactionCount + (action.delta.interactionCount || 0),
          tierHistory: [
            ...state.metrics.tierHistory,
            ...(action.delta.tierHistory || []),
          ],
          localCount: state.metrics.localCount + (action.delta.localCount || 0),
          skillsFired: state.metrics.skillsFired + (action.delta.skillsFired || 0),
          costHistory: [
            ...state.metrics.costHistory,
            ...(action.delta.costHistory || []),
          ],
        },
      }

    // =========================================================================
    // DECK OVERLAY (v0.7.1)
    // =========================================================================
    case 'OPEN_DECK':
      return { ...state, isDeckOpen: true }

    case 'CLOSE_DECK':
      return { ...state, isDeckOpen: false }

    case 'SET_ACTIVE_SLIDE':
      return { ...state, activeSlideIndex: action.index }

    // =========================================================================
    // VIEW ROUTING (v0.8.0)
    // =========================================================================
    case 'SET_VIEW':
      return { ...state, currentView: action.view }

    // =========================================================================
    // FOUNDRY (v0.9.0)
    // =========================================================================
    case 'SET_FOUNDRY_INPUT':
      return {
        ...state,
        foundry: { ...state.foundry, input: action.input },
      }

    case 'START_FOUNDRY_COMPILATION':
      return {
        ...state,
        foundry: {
          ...state.foundry,
          isCompiling: true,
          generatedPRD: '',
          error: null,
        },
      }

    case 'APPEND_FOUNDRY_CHUNK':
      return {
        ...state,
        foundry: {
          ...state.foundry,
          generatedPRD: state.foundry.generatedPRD + action.chunk,
        },
      }

    case 'COMPLETE_FOUNDRY_COMPILATION':
      return {
        ...state,
        foundry: { ...state.foundry, isCompiling: false },
      }

    case 'FAIL_FOUNDRY_COMPILATION':
      return {
        ...state,
        foundry: {
          ...state.foundry,
          isCompiling: false,
          error: action.error,
        },
      }

    case 'CLEAR_FOUNDRY':
      return {
        ...state,
        foundry: {
          input: '',
          isCompiling: false,
          generatedPRD: '',
          error: null,
        },
      }

    default:
      return state
  }
}
