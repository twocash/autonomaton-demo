/**
 * Application Context — Global State Provider
 *
 * Provides state and dispatch to all components.
 * Uses React's useReducer for predictable state management.
 *
 * NOTE: This uses the existing Signal Watch types and reducer.
 * The core infrastructure (src/core) is prepared for future migration.
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react'
import { appReducer, initialState } from './reducer'
import type { AppState, AppAction } from './types'

// =============================================================================
// PERSISTENCE
// =============================================================================

const WATCHLIST_STORAGE_KEY = 'signal_watch_watchlist_state'
const SKILLS_STORAGE_KEY = 'signal_watch_skills_state'
const ROUTING_STORAGE_KEY = 'signal_watch_routing_config'
const ZONES_STORAGE_KEY = 'signal_watch_zones_schema'

function loadPersistedState(): Partial<AppState> {
  if (typeof window === 'undefined') return {}

  try {
    const persisted: Partial<AppState> = {}

    const watchlist = localStorage.getItem(WATCHLIST_STORAGE_KEY)
    if (watchlist) persisted.watchlist = JSON.parse(watchlist)

    const skills = localStorage.getItem(SKILLS_STORAGE_KEY)
    if (skills) persisted.skills = JSON.parse(skills)

    const routing = localStorage.getItem(ROUTING_STORAGE_KEY)
    if (routing) persisted.routingConfig = JSON.parse(routing)

    const zones = localStorage.getItem(ZONES_STORAGE_KEY)
    if (zones) persisted.zonesSchema = JSON.parse(zones)

    return persisted
  } catch {
    return {}
  }
}

function getInitialState(): AppState {
  const persisted = loadPersistedState()
  return { ...initialState, ...persisted }
}

// =============================================================================
// CONTEXT
// =============================================================================

interface AppContextValue {
  state: AppState
  dispatch: Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue | null>(null)

// =============================================================================
// PROVIDER
// =============================================================================

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState)

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(state.watchlist))
  }, [state.watchlist])

  useEffect(() => {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(state.skills))
  }, [state.skills])

  useEffect(() => {
    localStorage.setItem(ROUTING_STORAGE_KEY, JSON.stringify(state.routingConfig))
  }, [state.routingConfig])

  useEffect(() => {
    localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(state.zonesSchema))
  }, [state.zonesSchema])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Access the full app state and dispatch
 */
export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

/**
 * Access just the state (for read-only components)
 */
export function useAppState(): AppState {
  return useApp().state
}

/**
 * Access just dispatch (for action-only components)
 */
export function useAppDispatch(): Dispatch<AppAction> {
  return useApp().dispatch
}

// =============================================================================
// SELECTOR HOOKS — Granular state access
// =============================================================================

export function usePipeline() {
  return useAppState().pipeline
}

export function useInteractions() {
  return useAppState().interactions
}

export function useSkills() {
  return useAppState().skills
}

export function useTelemetry() {
  return useAppState().telemetry
}

export function useMetrics() {
  return useAppState().metrics
}

export function useTutorial() {
  return useAppState().tutorial
}

export function useRoutingConfig() {
  return useAppState().routingConfig
}

export function useZonesSchema() {
  return useAppState().zonesSchema
}

export function useMode() {
  return useAppState().mode
}

export function useSkillProposal() {
  return useAppState().skillProposal
}

export function usePendingApproval() {
  return useAppState().pendingApproval
}

export function useSimulateFailure() {
  return useAppState().simulateFailure
}

export function usePatternCounts() {
  return useAppState().patternCounts
}

// Signal Watch specific selectors
export function useWatchlist() {
  return useAppState().watchlist
}

export function useSignals() {
  return useAppState().signals
}

export function usePendingAdjustments() {
  return useAppState().pendingAdjustments
}

export function useVoicePreset() {
  return useAppState().voicePreset
}
