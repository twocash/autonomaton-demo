/**
 * Declarative Prompt Pipeline — The Sovereign Manifesto
 *
 * This file teaches users how to compose modular prompts.
 * Instead of hidden strings, we expose prompt engineering
 * as a declarative schema.
 *
 * v0.9.2: "The Sovereign Manifesto Payload"
 * v0.9.3: Added getPipelineSignature() for recursive provenance
 */

export interface PromptBlock {
  id: string
  content: string
}

export interface PromptSchema {
  version: string
  pipeline: PromptBlock[]
}

export const FoundryPromptSchema: PromptSchema = {
  version: "1.0",
  pipeline: [
    {
      id: "system_persona",
      content: "You are a Principal Systems Architect enforcing the Grove Autonomaton Pattern. You translate raw user ideas into strict, governed, declarative architectures."
    },
    {
      id: "architectural_context",
      content: `The architecture is based on separating the cognitive engine (LLM) from the declarative scaffolding.
- The Ratchet: Models are swappable commodities. The architecture's natural dynamic is downward migration: from expensive Tier 3 Cloud APIs to free Tier 0 Local Caches.
- Sovereignty: Permissions are NEVER hardcoded. They live in a declarative zones.schema (Green/Yellow/Red).
- Provenance: Every transaction generates a deterministic hash linking intent → model → outcome for audit compliance.`
    },
    {
      id: "output_requirements",
      content: `Analyze the user's application concept and output a strict Markdown PRD containing EXACTLY these 5 sections:

## 1. The Invariant Pipeline
Map the app's core loop to the five canonical stages:
Telemetry → Recognition → Compilation → Approval → Execution

## 2. Declarative Zones
Draft the JSON/YAML schema classifying the app's features into:
- **Green Zone**: Auto-execute (low risk, reversible)
- **Yellow Zone**: Human approval required (medium risk, external effects)
- **Red Zone**: Prohibited or info-only (high risk, irreversible)

## 3. Cognitive Routing
Draft the routing.config assigning intents to Tiers:
- **Tier 0**: Local cache / deterministic (free)
- **Tier 1**: Small models (cheap, fast)
- **Tier 2**: Mid-tier models (balanced)
- **Tier 3**: Apex models (expensive, maximum capability)

## 4. The Audit Ledger
Provide a sample 1-line telemetry hash log proving how this app will track model provenance:
\`timestamp | intent | tier | zone | model | cost | #hash\`

## 5. Anti-Patterns
Identify 2 specific areas where a junior dev would instinctively hardcode logic for this app, and explain how it MUST be moved to config.`
    }
  ]
}

/**
 * Compile the prompt pipeline into a single string for API calls.
 * This separates the prompt engineering from the execution engine.
 */
export const compileFoundryPrompt = (): string =>
  FoundryPromptSchema.pipeline.map(block => block.content).join('\n\n')

/**
 * Generate a deterministic signature of the prompt pipeline.
 * This creates an immutable proof of the instructions used for compilation.
 *
 * The signature is: v{version}-{8-char-hex-hash}
 * Example: v1.0-a3f8b2c1
 */
export const getPipelineSignature = (): string => {
  const payload = JSON.stringify(FoundryPromptSchema)
  let hash = 0
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `v${FoundryPromptSchema.version}-${Math.abs(hash).toString(16).padStart(8, '0')}`
}
