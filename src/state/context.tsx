/**
 * Application Context — Global State Provider
 *
 * Provides state and dispatch to all components.
 * Uses React's useReducer for predictable state management.
 */

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react'
import { appReducer, initialState } from './reducer'
import type { AppState, AppAction } from './types'

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
  const [state, dispatch] = useReducer(appReducer, initialState)

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
