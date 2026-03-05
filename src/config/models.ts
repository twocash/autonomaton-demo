/**
 * models.config — Tier-to-Model Mapping
 *
 * This proves Claim #8: Model Independence
 * Swap model labels per tier → routing, governance, skills survive unchanged.
 *
 * API keys are stored in browser memory only, never persisted.
 */

import type { AppState } from '../state/types'

export interface ModelsConfig {
  tiers: {
    0: TierModelConfig
    1: TierModelConfig
    2: TierModelConfig
    3: TierModelConfig
  }
}

export interface TierModelConfig {
  name: string
  provider: string
  model?: string
  endpoint?: string
  apiKey: string | null
  costPerInteraction: number
}

export function serializeModelsConfig(state: AppState): string {
  const { modelConfig } = state

  return `# models.config
# Map cognitive providers to architectural tiers.
# Keys remain strictly in local browser memory.

tiers:
  0:
    name: "Pattern Cache"
    provider: "local_memory"
    cost_per_interaction: 0.00

  1:
    name: "Cheap Cognition"
    provider: "${modelConfig.tier1.provider}"
    model: "${modelConfig.tier1.model}"
    api_key: "${modelConfig.tier1.apiKey ? '••••••••' : '<not set>'}"
    cost_per_interaction: 0.001

  2:
    name: "Premium Cognition"
    provider: "${modelConfig.tier2.provider}"
    model: "${modelConfig.tier2.model}"
    api_key: "${modelConfig.tier2.apiKey ? '••••••••' : '<not set>'}"
    cost_per_interaction: 0.01

  3:
    name: "Apex Cognition"
    provider: "${modelConfig.tier3.provider}"
    model: "${modelConfig.tier3.model}"
    api_key: "${modelConfig.tier3.apiKey ? '••••••••' : '<not set>'}"
    cost_per_interaction: 0.10

# --- SWAPPABLE ALTERNATIVES ---
#
# OpenAI (any tier)
# provider: "openai"
# model: "gpt-4o"
#
# Google (Tier 2/3)
# provider: "google"
# model: "gemini-1.5-pro"
#
# Ollama / Local (Tier 1)
# provider: "ollama"
# endpoint: "http://localhost:11434"
# model: "mistral"
`
}

export function parseModelsConfig(
  text: string,
  currentConfig?: AppState['modelConfig']
): { modelConfig: AppState['modelConfig'] } | { error: string } {
  try {
    // Simple YAML-like parsing for the models config
    const lines = text.split('\n')
    let currentTier: 1 | 2 | 3 | null = null

    // Start with current config to preserve API keys, or use defaults
    const config: AppState['modelConfig'] = currentConfig
      ? {
          tier0: { ...currentConfig.tier0 },
          tier1: { ...currentConfig.tier1 },
          tier2: { ...currentConfig.tier2 },
          tier3: { ...currentConfig.tier3 },
        }
      : {
          tier0: { provider: 'local_memory', apiKey: null, model: 'cached_skill' },
          tier1: { provider: 'anthropic', apiKey: null, model: 'claude-3-haiku-20240307' },
          tier2: { provider: 'anthropic', apiKey: null, model: 'claude-sonnet-4-20250514' },
          tier3: { provider: 'anthropic', apiKey: null, model: 'claude-opus-4-20250514' },
        }

    for (const line of lines) {
      const trimmed = line.trim()

      // Skip comments and empty lines
      if (trimmed.startsWith('#') || trimmed === '') continue

      // Detect tier sections
      if (/^\d:$/.test(trimmed)) {
        const tierNum = parseInt(trimmed[0])
        if (tierNum >= 1 && tierNum <= 3) {
          currentTier = tierNum as 1 | 2 | 3
        } else {
          currentTier = null
        }
        continue
      }

      // Parse key-value pairs
      if (currentTier && trimmed.includes(':')) {
        const colonIdx = trimmed.indexOf(':')
        const key = trimmed.slice(0, colonIdx).trim()
        let value = trimmed.slice(colonIdx + 1).trim()

        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }

        const tierKey = `tier${currentTier}` as keyof typeof config

        switch (key) {
          case 'provider':
            config[tierKey].provider = value
            break
          case 'model':
            config[tierKey].model = value
            break
          case 'api_key':
            // Only update if user entered a real key (not masked/placeholder)
            if (value !== '••••••••' && value !== '<not set>') {
              config[tierKey].apiKey = value || null
            }
            // If masked, the existing key is preserved from currentConfig
            break
        }
      }
    }

    return { modelConfig: config }
  } catch (e) {
    return { error: 'Invalid models configuration format' }
  }
}
