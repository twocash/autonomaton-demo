/**
 * Default Routing Configuration
 *
 * This is the declarative source of truth for intent routing.
 * Edit this to change how the system behaves — no code changes required.
 *
 * Each intent specifies:
 * - tier: Which cognitive tier handles it (1=cheap, 2=premium, 3=apex)
 * - zone: Governance level (green=auto, yellow=approve, red=human-only)
 * - keywords: Patterns for demo mode intent matching
 */

import type { RoutingConfig } from '../state/types'

export const defaultRoutingConfig: RoutingConfig = {
  intents: {
    // =========================================================================
    // GREEN ZONE — Autonomous, no approval needed
    // =========================================================================
    capture_idea: {
      tier: 1,
      zone: 'green',
      description: 'Quick thought capture',
      keywords: ['capture', 'idea', 'thought', 'note', 'jot', 'remember', 'quick note'],
    },

    summarize_notes: {
      tier: 1,
      zone: 'green',
      description: 'Summarize recent notes',
      keywords: ['summarize', 'summary', 'notes', 'recap', 'overview', 'digest'],
    },

    // =========================================================================
    // YELLOW ZONE — Requires human approval
    // =========================================================================
    research_topic: {
      tier: 2,
      zone: 'yellow',
      description: 'Research a topic in depth',
      keywords: ['research', 'investigate', 'look into', 'deep dive', 'explore', 'find out'],
    },

    draft_email: {
      tier: 2,
      zone: 'yellow',
      description: 'Draft an email from context',
      keywords: ['draft', 'email', 'write email', 'compose', 'message', 'send'],
    },

    propose_skill: {
      tier: 2,
      zone: 'yellow',
      description: 'Propose a new automated skill',
      keywords: ['propose', 'skill', 'automate', 'workflow', 'automation', 'teach'],
    },

    analyze_data: {
      tier: 3,
      zone: 'yellow',
      description: 'Complex data analysis',
      keywords: ['analyze', 'data', 'analysis', 'metrics', 'statistics', 'report'],
    },

    // =========================================================================
    // RED ZONE — Human-only, system surfaces info and waits
    // =========================================================================
    deploy_change: {
      tier: 3,
      zone: 'red',
      description: 'Deploy a system change',
      keywords: ['deploy', 'release', 'push', 'ship', 'publish', 'go live'],
    },

    delete_data: {
      tier: 3,
      zone: 'red',
      description: 'Destructive data operation',
      keywords: ['delete', 'remove', 'destroy', 'wipe', 'erase', 'drop'],
    },
  },
}

/**
 * Serialize config to YAML-like string for display in editor
 */
export function serializeRoutingConfig(config: RoutingConfig): string {
  let yaml = 'intents:\n'

  for (const [name, intent] of Object.entries(config.intents)) {
    yaml += `  ${name}:\n`
    yaml += `    tier: ${intent.tier}\n`
    yaml += `    zone: ${intent.zone}\n`
    yaml += `    description: "${intent.description}"\n`
  }

  return yaml
}

/**
 * Parse YAML-like string back to config object
 * Simple parser for demo — not a full YAML implementation
 */
export function parseRoutingConfig(yaml: string): RoutingConfig | { error: string } {
  try {
    const config: RoutingConfig = { intents: {} }
    const lines = yaml.split('\n')
    let currentIntent: string | null = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed === 'intents:') continue

      // Intent name: exactly 2-space indent, word characters only, ends with colon
      // Example: "  capture_idea:" → captures "capture_idea"
      const intentMatch = line.match(/^  (\w+):$/)
      if (intentMatch) {
        currentIntent = intentMatch[1]
        config.intents[currentIntent] = {
          tier: 1,
          zone: 'green',
          description: '',
          keywords: defaultRoutingConfig.intents[currentIntent]?.keywords || [],
        }
        continue
      }

      // Property: exactly 4-space indent, "key: value" format
      // Example: "    tier: 2" → captures ["tier", "2"]
      if (currentIntent) {
        const propMatch = line.match(/^    (\w+): (.+)$/)
        if (propMatch) {
          const [, key, value] = propMatch
          const intent = config.intents[currentIntent]

          if (key === 'tier') {
            const tier = parseInt(value)
            if (tier >= 1 && tier <= 3) intent.tier = tier as 1 | 2 | 3
          } else if (key === 'zone') {
            if (['green', 'yellow', 'red'].includes(value)) {
              intent.zone = value as 'green' | 'yellow' | 'red'
            }
          } else if (key === 'description') {
            // Strip surrounding quotes: "hello world" → hello world
            intent.description = value.replace(/^"|"$/g, '')
          }
        }
      }
    }

    return config
  } catch (e) {
    return { error: `Parse error: ${e}` }
  }
}
