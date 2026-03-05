/**
 * Pipeline Orchestrator — Interaction Lifecycle
 *
 * This is the heart of the demo. Every request flows through here:
 *
 *   Input → Telemetry → Recognition → Compilation → Approval → Execution
 *
 * The orchestrator:
 * - Animates each stage transition
 * - Checks for Jidoka conditions (simulated failures)
 * - Handles zone governance (approval flows)
 * - Updates metrics and telemetry
 */

import type {
  AppAction,
  AppState,
  FailureType,
  HaltReason,
  Interaction,
  PipelineStage,
  TelemetryEntry,
} from '../state/types'
import { classifyIntent, shouldProposeSkill, generatePatternDescription } from './cognitive-router'
import { getSimulatedResponse } from '../config/responses'
import { TIER_CONFIG } from '../config/tiers'
import { executeCognitiveRequest } from './CognitiveAdapter'

// Stage timing for animations (ms)
const STAGE_TIMING: Record<PipelineStage, number> = {
  telemetry: 200,
  recognition: 400,
  compilation: 300,
  approval: 100, // Fast if green, pauses if yellow
  execution: 500,
}

type Dispatch = (action: AppAction) => void

/**
 * Process user input through the entire pipeline
 */
export async function processInteraction(
  input: string,
  state: AppState,
  dispatch: Dispatch
): Promise<void> {
  const startTime = Date.now()
  const interactionId = `int-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  // Reset pipeline
  dispatch({ type: 'RESET_PIPELINE' })

  // ==========================================================================
  // STAGE 1: TELEMETRY
  // ==========================================================================
  await advanceToStage('telemetry', dispatch)

  // Check for Jidoka halt (simulated failure)
  const jidokaCheck = checkJidoka(state.simulateFailure, 'telemetry')
  if (jidokaCheck) {
    dispatch({ type: 'HALT_PIPELINE', reason: jidokaCheck })
    return
  }

  await delay(STAGE_TIMING.telemetry)

  // ==========================================================================
  // STAGE 2: RECOGNITION
  // ==========================================================================
  await advanceToStage('recognition', dispatch)

  // Check for Jidoka halt
  const jidokaRecognition = checkJidoka(state.simulateFailure, 'recognition')
  if (jidokaRecognition) {
    dispatch({ type: 'HALT_PIPELINE', reason: jidokaRecognition })
    return
  }

  // Classify the intent using cognitive router
  const decision = classifyIntent(input, state.routingConfig, state.skills)

  // Simulate latency based on tier
  const tierLatency = TIER_CONFIG[decision.tier].latencyMs
  await delay(Math.min(STAGE_TIMING.recognition, tierLatency / 2))

  // ==========================================================================
  // STAGE 3: COMPILATION
  // ==========================================================================
  await advanceToStage('compilation', dispatch)

  // Check for Jidoka halt
  const jidokaCompilation = checkJidoka(state.simulateFailure, 'compilation')
  if (jidokaCompilation) {
    dispatch({ type: 'HALT_PIPELINE', reason: jidokaCompilation })
    return
  }

  // Calculate pattern count BEFORE creating interaction (for badge display)
  // Only count if it's a valid intent and not already a cached skill
  const willIncrementPattern = decision.intent !== 'unknown' && !decision.skillMatch
  const patternCountAtCreation = willIncrementPattern
    ? (state.patternCounts[decision.intent] || 0) + 1
    : undefined

  // Create the interaction record
  const interaction: Interaction = {
    id: interactionId,
    timestamp: new Date().toISOString(),
    input,
    intent: decision.intent,
    tier: decision.tier,
    zone: decision.zone,
    cost: decision.cost,
    sovereignty: decision.sovereignty,
    confidence: decision.confidence,
    response: null,
    status: 'pending',
    skillMatch: decision.skillMatch?.id || null,
    mode: state.mode,
    patternCountAtCreation,
  }

  dispatch({ type: 'ADD_INTERACTION', interaction })

  // Track pattern for skill flywheel
  if (willIncrementPattern) {
    dispatch({ type: 'INCREMENT_PATTERN', intent: decision.intent })

    // Check if we should propose a skill
    const newCount = patternCountAtCreation!
    if (shouldProposeSkill(decision.intent, { ...state.patternCounts, [decision.intent]: newCount }, state.skills)) {
      dispatch({
        type: 'PROPOSE_SKILL',
        intent: decision.intent,
        pattern: generatePatternDescription(decision.intent),
        count: newCount,
      })
    }
  }

  await delay(STAGE_TIMING.compilation)

  // ==========================================================================
  // STAGE 4: APPROVAL
  // ==========================================================================
  await advanceToStage('approval', dispatch)

  // Check for Jidoka halt
  const jidokaApproval = checkJidoka(state.simulateFailure, 'approval')
  if (jidokaApproval) {
    dispatch({ type: 'HALT_PIPELINE', reason: jidokaApproval })
    return
  }

  // Zone governance check
  if (decision.zone === 'yellow') {
    // Yellow zone: pause for human approval
    dispatch({ type: 'SET_PENDING_APPROVAL', interaction })
    // The execution continues when user clicks approve/reject
    // We'll handle that in a separate flow
    return
  }

  if (decision.zone === 'red') {
    // Red zone: human-only, but we still generate the advisory response
    await delay(STAGE_TIMING.approval)
  } else {
    // Green zone: auto-approve, continue
    await delay(STAGE_TIMING.approval)
  }

  // ==========================================================================
  // STAGE 5: EXECUTION
  // ==========================================================================
  await completeExecution(interaction, decision, state, dispatch, startTime)
}

/**
 * Complete the execution stage (called after approval for yellow zone)
 */
export async function completeExecution(
  interaction: Interaction,
  decision: ReturnType<typeof classifyIntent>,
  state: AppState,
  dispatch: Dispatch,
  startTime: number
): Promise<void> {
  await advanceToStage('execution', dispatch)

  // Check for Jidoka halt
  const jidokaExecution = checkJidoka(state.simulateFailure, 'execution')
  if (jidokaExecution) {
    dispatch({ type: 'HALT_PIPELINE', reason: jidokaExecution })
    return
  }

  let response: string
  let tokensIn: number | undefined
  let tokensOut: number | undefined
  let modelUsed: string | undefined

  if (state.mode === 'demo') {
    // Demo mode: simulated responses with artificial latency
    response = getSimulatedResponse(decision.intent, interaction.input)
    const executionLatency = TIER_CONFIG[decision.tier].latencyMs
    await delay(executionLatency)
  } else {
    // Interactive mode: all tiers flow through CognitiveAdapter
    // Tier 0 uses local_memory provider, Tiers 1-3 use configured LLM providers
    const tierKey = `tier${decision.tier}` as keyof typeof state.modelConfig
    const tierConfig = state.modelConfig[tierKey]
    modelUsed = tierConfig.model

    // Set executing status for cloud tiers (Tier 0 is instant)
    if (decision.tier > 0) {
      dispatch({
        type: 'UPDATE_INTERACTION_STATUS',
        id: interaction.id,
        status: 'executing',
      })
    }

    try {
      const result = await executeCognitiveRequest(interaction.input, tierConfig)
      response = result.text
      tokensIn = result.tokensIn
      tokensOut = result.tokensOut
    } catch (error) {
      // Jidoka: halt pipeline with provider error
      const message = error instanceof Error ? error.message : String(error)
      dispatch({
        type: 'HALT_PIPELINE',
        reason: {
          stage: 'execution',
          error: message,
          expected: 'Valid API response from provider',
          proposedFix: 'Check API key and network connection in models.config',
        },
      })
      return
    }
  }

  // Complete the interaction
  const totalLatency = Date.now() - startTime

  const telemetryEntry: TelemetryEntry = {
    id: interaction.id,
    timestamp: interaction.timestamp,
    intent: decision.intent,
    tier: decision.tier,
    zone: decision.zone,
    confidence: decision.confidence,
    cost: decision.cost,
    mode: state.mode,
    latencyMs: totalLatency,
    humanFeedback: decision.zone === 'yellow' ? 'approved' : null,
    skillMatch: decision.skillMatch?.id || null,
    // v0.5.0: Interactive mode additions
    modelUsed,
    tokensIn,
    tokensOut,
  }

  dispatch({ type: 'COMPLETE_INTERACTION', response, telemetry: telemetryEntry })
  dispatch({ type: 'ADD_TELEMETRY', entry: telemetryEntry })

  // Update metrics
  dispatch({
    type: 'UPDATE_METRICS',
    delta: {
      totalCost: decision.cost,
      interactionCount: 1,
      tierHistory: [decision.tier],
      localCount: decision.sovereignty === 'local' ? 1 : 0,
      costHistory: [decision.cost],
    },
  })

  // If skill was used, record savings
  if (decision.skillMatch) {
    const savings = TIER_CONFIG[decision.skillMatch.originalTier].cost - TIER_CONFIG[0].cost
    dispatch({ type: 'FIRE_SKILL', skillId: decision.skillMatch.id, savings })
  }

  // Mark execution complete
  dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'execution', state: 'complete' })
}

/**
 * Continue from approval stage after user approves
 */
export async function continueAfterApproval(
  interaction: Interaction,
  state: AppState,
  dispatch: Dispatch
): Promise<void> {
  const decision = classifyIntent(interaction.input, state.routingConfig, state.skills)
  const startTime = Date.now() - TIER_CONFIG[decision.tier].latencyMs // Approximate

  dispatch({ type: 'APPROVE_INTERACTION' })
  await completeExecution(interaction, decision, state, dispatch, startTime)
}

/**
 * Handle rejection from approval stage
 */
export function rejectInteraction(dispatch: Dispatch): void {
  dispatch({ type: 'REJECT_INTERACTION' })
  dispatch({ type: 'RESET_PIPELINE' })
}

// =============================================================================
// HELPERS
// =============================================================================

async function advanceToStage(stage: PipelineStage, dispatch: Dispatch): Promise<void> {
  dispatch({ type: 'SET_PIPELINE_STAGE', stage, state: 'active' })
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if a simulated failure should halt the pipeline
 */
function checkJidoka(failureType: FailureType, currentStage: PipelineStage): HaltReason | null {
  if (failureType === 'none') return null

  // Map failure types to stages where they manifest
  const failureStages: Record<FailureType, PipelineStage> = {
    none: 'telemetry', // Won't be used
    api_timeout: 'execution',
    low_confidence: 'recognition',
    hallucination_detected: 'execution',
  }

  if (failureStages[failureType] !== currentStage) return null

  // 'none' case is handled by early return above, so exclude it from the Record
  const reasons: Record<Exclude<FailureType, 'none'>, HaltReason> = {
    api_timeout: {
      stage: 'execution',
      error: 'API Timeout: No response received within 30s',
      expected: 'Response within 10s for Tier 2 calls',
      proposedFix: 'Retry with exponential backoff, or fall back to Tier 1',
    },
    low_confidence: {
      stage: 'recognition',
      error: 'Low Confidence: Intent classification score 0.23 (threshold: 0.5)',
      expected: 'Confidence ≥ 0.5 for autonomous routing',
      proposedFix: 'Request clarification from user, or route to human review',
    },
    hallucination_detected: {
      stage: 'execution',
      error: 'Hallucination Detected: Response contains unverifiable claims',
      expected: 'All claims grounded in provided context',
      proposedFix: 'Flag response for human review, request with stricter grounding',
    },
  }

  return reasons[failureType]
}

