/**
 * Foundry Compiler — Tier 3 Streaming PRD Generator (v0.9.2)
 *
 * Compiles app descriptions into strict Grove Autonomaton PRDs in real-time.
 * Output is wrapped by blueprint-generator.ts into the Sovereign Manifesto HTML.
 *
 * v0.9.2: Prompt logic moved to declarative pipeline (prompts.schema.ts)
 */

import type { ModelConfig, AppAction } from '../state/types'
import { streamCognitiveRequest } from './CognitiveAdapter'
import { compileFoundryPrompt, getPipelineSignature, FoundryPromptSchema } from '../config/prompts.schema'

// =============================================================================
// SYSTEM PROMPT — Compiled from Declarative Pipeline
// =============================================================================

// The prompt is now composed from src/config/prompts.schema.ts
// This separates prompt engineering from execution logic.
export const FOUNDRY_SYSTEM_PROMPT = compileFoundryPrompt()

// =============================================================================
// COMPILATION ORCHESTRATOR
// =============================================================================

type Dispatch = React.Dispatch<AppAction>

/** Small delay for telemetry ticktock visual effect */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Stream architecture compilation from Tier 3 provider.
 * v0.9.3: Includes preflight telemetry "ticktock" before LLM stream.
 * Dispatches chunks to state as they arrive.
 */
export async function compileArchitecture(
  appDescription: string,
  tierConfig: ModelConfig,
  dispatch: Dispatch
): Promise<void> {
  dispatch({ type: 'START_FOUNDRY_COMPILATION' })

  try {
    // =========================================================================
    // PREFLIGHT TELEMETRY — The Compiler Ledger "Ticktock"
    // =========================================================================
    const signature = getPipelineSignature()

    dispatch({ type: 'APPEND_FOUNDRY_LOG', log: '[SYSTEM] Initializing Foundry Compiler engine...' })
    await delay(300)

    dispatch({ type: 'APPEND_FOUNDRY_LOG', log: `[CONFIG] Loading declarative prompt schema (v${FoundryPromptSchema.version})...` })
    await delay(300)

    dispatch({ type: 'APPEND_FOUNDRY_LOG', log: `[PROVENANCE] Pipeline signature: ${signature}` })
    await delay(300)

    dispatch({ type: 'APPEND_FOUNDRY_LOG', log: `[NETWORK] Routing to Tier 3 Apex (${tierConfig.model})...` })
    await delay(400)

    dispatch({ type: 'APPEND_FOUNDRY_LOG', log: '[STREAM] Connection established. Receiving architecture payload...' })
    await delay(200)

    // =========================================================================
    // STREAM LLM RESPONSE
    // =========================================================================
    for await (const chunk of streamCognitiveRequest(
      appDescription,
      FOUNDRY_SYSTEM_PROMPT,
      tierConfig
    )) {
      dispatch({ type: 'APPEND_FOUNDRY_CHUNK', chunk })
    }
    dispatch({ type: 'COMPLETE_FOUNDRY_COMPILATION' })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    dispatch({ type: 'FAIL_FOUNDRY_COMPILATION', error: message })
  }
}
