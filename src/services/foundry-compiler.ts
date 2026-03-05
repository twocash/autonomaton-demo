/**
 * Foundry Compiler — The Sovereign Blueprint Engine (v0.9.0)
 *
 * Uses Tier 3 streaming to compile app descriptions into strict
 * Grove Autonomaton PRDs in real-time.
 */

import type { ModelConfig, AppAction } from '../state/types'
import { streamCognitiveRequest } from './CognitiveAdapter'

// =============================================================================
// SYSTEM PROMPT — The Architect's Directive
// =============================================================================

export const FOUNDRY_SYSTEM_PROMPT = `
You are a Principal Systems Architect enforcing the Grove Autonomaton Pattern.
The user will provide a rough app concept. You will write a strict, declarative Product Requirements Document (PRD).

MANDATORY OUTPUT STRUCTURE (Use Markdown):

# Architecture Spec: [App Name]

## 1. The Invariant Pipeline
Map the core user loop to the 5 stages: Telemetry -> Recognition -> Compilation -> Approval -> Execution.

## 2. Cognitive Routing (Intents)
List the core intents. Assign each to a Tier:
- Tier 0: Cached/Free
- Tier 1: Cheap/Local
- Tier 2: Premium Cloud
- Tier 3: Apex/Agentic

## 3. Sovereignty Guardrails
Classify operations into:
- Green (Autonomous): Safe to execute.
- Yellow (Supervised): Propose and wait for human approval.
- Red (Human-Only): Surface info only.

## 4. Anti-Patterns & Hardcoding Warnings
Identify 2 specific areas where a developer might instinctively hardcode logic for this app, and explicitly explain how it MUST be moved to declarative configuration (routing.config or zones.schema) instead.
`

// =============================================================================
// COMPILATION ORCHESTRATOR
// =============================================================================

type Dispatch = React.Dispatch<AppAction>

/**
 * Stream architecture compilation from Tier 3 provider.
 * Dispatches chunks to state as they arrive.
 */
export async function compileArchitecture(
  appDescription: string,
  tierConfig: ModelConfig,
  dispatch: Dispatch
): Promise<void> {
  dispatch({ type: 'START_FOUNDRY_COMPILATION' })

  try {
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
