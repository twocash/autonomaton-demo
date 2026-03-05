/**
 * Hero Prompts — Armory Payloads
 *
 * Pre-written architectural prompts demonstrating complex agentic systems.
 * These prove the Autonomaton pattern can govern self-healing, self-coding agents.
 *
 * v1.0: Launch armory for frictionless "Aha!" moments.
 */

export interface HeroPrompt {
  title: string
  prompt: string
}

export const HERO_PROMPTS: HeroPrompt[] = [
  {
    title: 'The Self-Healing Triager',
    prompt: `I want to build an Unstructured Data Triager. It monitors my Notion inbox, converting raw text dumps into structured JSON. It must attempt parsing using local regex rules first (Tier 1). If it encounters an unrecognizable format, it must halt the pipeline (Jidoka) and escalate to a Tier 3 Apex model. The Tier 3 model must extract the data AND write a new permanent regex rule for this format. Finally, it must propose adding this new rule to the local configuration, requiring my explicit approval before modifying its own codebase.`,
  },
  {
    title: 'The Kaizen Automator',
    prompt: `I need to build a Flywheel Harvester agent. It wakes up at midnight and ingests the day's local telemetry ledgers. It must search for any 'ad_hoc_query' intents that were successfully executed and approved by a human more than 5 times. When it finds a pattern, it must draft a new permanent TypeScript skill for that action and map it to a Tier 1 model. It must then halt execution and trigger a Yellow Zone approval gate, presenting me with a Git Pull Request. It is strictly forbidden from merging the PR without my click.`,
  },
  {
    title: 'The IDE Interceptor',
    prompt: `I want to build a local proxy called the Sentinel. It sits on my machine between my AI IDE (like Cursor) and the LLM APIs. It inspects the code the AI is trying to write. If the AI attempts to hardcode an API call, bypass the routing.config, or ignore the 5-stage pipeline, the Sentinel must hit an architectural hard-block (Red Zone). It must instantly drop the network request and return a system message to the AI IDE explaining exactly which Grove architectural principle it violated, forcing the AI to rewrite the code declaratively.`,
  },
]

/**
 * Get a random hero prompt from the armory
 */
export function getRandomHeroPrompt(): HeroPrompt {
  const index = Math.floor(Math.random() * HERO_PROMPTS.length)
  return HERO_PROMPTS[index]
}
