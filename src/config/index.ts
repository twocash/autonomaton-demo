/**
 * Config Module — Barrel export for all configuration utilities
 *
 * Centralizes exports for cleaner imports throughout the application.
 */

// Routing
export { defaultRoutingConfig, serializeRoutingConfig, parseRoutingConfig } from './routing'

// Zones
export { defaultZonesSchema, serializeZonesSchema } from './zones'

// Tiers
export { TIER_CONFIG } from './tiers'

// Models
export { serializeModelsConfig, parseModelsConfig } from './models'
export type { ModelsConfig, TierModelConfig } from './models'

// Skills
export { serializeSkills } from './skills'
