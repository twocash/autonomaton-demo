/**
 * Header — Logo, View Toggle, Mode Toggle
 *
 * Typography: Instrument Serif for logo
 * No rounded corners (strict geometry)
 *
 * v0.4.1: Andon dropdown moved to InteractionPane PromptTray
 * v0.8.0: Added centered view toggle (Playground / The Foundry)
 */

import { useAppState, useAppDispatch } from '../../state/context'

export function Header() {
  const { mode, currentView } = useAppState()
  const dispatch = useAppDispatch()

  const handleModeToggle = () => {
    dispatch({ type: 'SET_MODE', mode: mode === 'demo' ? 'interactive' : 'demo' })
  }

  return (
    <header className="border-b border-grove-border px-4 py-2 bg-grove-bg2">
      <div className="flex items-center justify-between">
        {/* LEFT: Logo — Instrument Serif */}
        <div className="flex-1">
          <h1 className="text-lg font-serif text-grove-text leading-tight">
            Grove Autonomaton
          </h1>
          <p className="text-xs text-grove-text-dim">Pattern Playground</p>
        </div>

        {/* CENTER: View Toggle (v0.8.0) */}
        <div className="flex bg-grove-bg border border-grove-border p-1">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', view: 'sandbox' })}
            className={`px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              currentView === 'sandbox'
                ? 'bg-grove-bg2 text-grove-amber border border-grove-border'
                : 'text-grove-text-dim hover:text-grove-text border border-transparent'
            }`}
          >
            Playground
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', view: 'foundry' })}
            className={`px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              currentView === 'foundry'
                ? 'bg-grove-bg2 text-grove-amber border border-grove-border'
                : 'text-grove-text-dim hover:text-grove-text border border-transparent'
            }`}
          >
            The Foundry
          </button>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {/* Architecture Deck Button (v0.7.1) */}
          <button
            onClick={() => dispatch({ type: 'OPEN_DECK' })}
            className="font-serif text-grove-amber hover:text-grove-amber-bright transition-colors text-sm"
          >
            [ Anatomy of an Autonomaton ]
          </button>

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
              {mode === 'demo' ? 'Demo' : 'BYOK'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
