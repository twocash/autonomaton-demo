/**
 * Grove Autonomaton Pattern Playground
 *
 * A browser-based demo proving 9 architectural claims through user interaction.
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Header (Mode Toggle, Model Config, Andon Cord)              │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Pipeline Visualization (Hero Element)                       │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Dashboard (Metrics)                                         │
 * ├──────────────────────────────┬──────────────────────────────┤
 * │ Interaction Pane             │ Config Editor / Skills       │
 * │                              │                              │
 * ├──────────────────────────────┴──────────────────────────────┤
 * │ Telemetry Stream                                            │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Design System: Editorial Industrial (no rounded corners)
 */

import { useAppState, useAppDispatch } from './state/context'
import { PipelineVisualization } from './components/Pipeline'
import { Dashboard } from './components/Dashboard'
import { InteractionPane } from './components/Interaction'
import { ConfigEditor } from './components/Config'
import { TelemetryStream } from './components/Telemetry'
import { Header } from './components/Header'
import { SkillProposal } from './components/Skills'

export default function App() {
  const { tutorial } = useAppState()
  const dispatch = useAppDispatch()

  return (
    <div className="h-screen bg-grove-bg text-grove-text flex flex-col overflow-hidden">
      <Header />
      <PipelineVisualization />
      <Dashboard />

      {/* Main Content */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        <InteractionPane />
        <ConfigEditor />
      </main>

      <TelemetryStream />

      {/* Footer */}
      <footer className="border-t border-grove-border px-6 py-3 text-center text-xs text-grove-text-dim">
        The Grove Autonomaton Pattern • CC BY 4.0 • thegrovefoundation.org
      </footer>

      {/* Skill Proposal Toast */}
      <SkillProposal />

      {/* Tutorial overlay */}
      {tutorial.active && tutorial.currentStep === 0 && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-grove-bg2 border border-grove-border p-8 max-w-lg text-center">
            <h2 className="text-2xl font-serif text-grove-text mb-4">
              Welcome to the Pattern Playground
            </h2>
            <p className="text-grove-text-mid mb-6">
              This demo proves the Grove Autonomaton pattern through your own actions.
              You'll experience zone governance, live config editing, and the skill flywheel.
            </p>
            <p className="text-sm text-grove-text-dim mb-6">
              Ready to see software that identifies its own issues, proposes its own fixes,
              and authors its own evolution — inside zones you control?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => dispatch({ type: 'START_TUTORIAL' })}
                className="bg-grove-amber hover:bg-grove-amber-bright text-white px-6 py-2 font-medium transition-colors"
              >
                Start Tutorial
              </button>
              <button
                onClick={() => dispatch({ type: 'SKIP_TUTORIAL' })}
                className="text-grove-text-dim hover:text-grove-text-mid px-4 py-2 text-sm"
              >
                Skip to Sandbox →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
