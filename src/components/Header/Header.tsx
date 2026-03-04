/**
 * Header — Mode toggle, Model Config, Andon Cord, Deck Link
 *
 * Typography: Instrument Serif for logo
 * No rounded corners (strict geometry)
 */

import { useAppState, useAppDispatch } from '../../state/context'
import type { FailureType } from '../../state/types'

export function Header() {
  const { mode, simulateFailure } = useAppState()
  const dispatch = useAppDispatch()

  const handleModeToggle = () => {
    dispatch({ type: 'SET_MODE', mode: mode === 'demo' ? 'interactive' : 'demo' })
  }

  const handleFailureToggle = (failureType: FailureType) => {
    dispatch({ type: 'SET_FAILURE_SIMULATION', failureType })
  }

  return (
    <header className="border-b border-grove-border px-6 py-4 bg-grove-bg2">
      <div className="flex items-center justify-between">
        {/* Logo — Instrument Serif */}
        <div>
          <h1 className="text-xl font-serif text-grove-text">
            Grove Autonomaton
          </h1>
          <p className="text-sm text-grove-text-dim">Pattern Playground</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Manifesto Link */}
          <a
            href="grove-autonomaton-deck.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-grove-amber hover:text-grove-amber-bright transition-colors text-sm"
          >
            [ Read the Pattern Deck ]
          </a>

          {/* Andon Cord - Pull to simulate failure */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-grove-text-dim">Andon:</span>
            <select
              value={simulateFailure}
              onChange={(e) => handleFailureToggle(e.target.value as FailureType)}
              className={`
                text-sm px-3 py-1 border
                ${simulateFailure !== 'none'
                  ? 'bg-grove-red/20 border-grove-red text-grove-red'
                  : 'bg-grove-bg border-grove-border text-grove-text-mid'
                }
              `}
            >
              <option value="none">Normal</option>
              <option value="api_timeout">🔴 API Timeout</option>
              <option value="low_confidence">🔴 Low Confidence</option>
              <option value="hallucination_detected">🔴 Hallucination</option>
            </select>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-grove-text-dim">Mode:</span>
            <button
              onClick={handleModeToggle}
              className={`
                px-3 py-1 text-sm font-medium transition-colors
                ${mode === 'demo'
                  ? 'bg-grove-amber text-white'
                  : 'bg-grove-green text-white'
                }
              `}
            >
              {mode === 'demo' ? 'Demo' : 'Interactive'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
