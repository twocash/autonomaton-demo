/**
 * DiagnosticCard — Digital Jidoka Halt Display
 *
 * This proves Claim #6: Build Quality In (Digital Jidoka).
 * When the pipeline halts, this card renders inline with the
 * interaction that caused the halt — not in a separate location.
 *
 * v0.9.4: "Transparent Provenance" — Config-driven Andon Cord
 * Shows explicit guidance to edit config files when pipeline halts.
 *
 * Design: Industrial manifesto styling
 * - Sharp corners (no rounded)
 * - Deep dark red background (#1a0a0a)
 * - Red top border accent
 * - Monospace typography for system data
 */

import type { HaltReason } from '../../state/types'

interface DiagnosticCardProps {
  reason: HaltReason
  onReset: () => void
}

export function DiagnosticCard({ reason, onReset }: DiagnosticCardProps) {
  return (
    <div className="border-t-2 border-x border-b border-grove-red bg-[#1a0a0a] p-5 mt-4">
      {/* Header */}
      <div className="font-mono text-grove-red text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="font-bold">HALT</span>
        <span>Pipeline Halted</span>
      </div>

      {/* Error Body */}
      <p className="font-sans text-grove-text text-sm mb-4">
        {reason.error}
      </p>

      {/* Diagnostic Data */}
      <div className="bg-grove-bg border border-grove-border p-3 font-mono text-xs text-grove-text-mid space-y-2">
        <div>
          <span className="text-grove-text-dim">Stage: </span>
          <span className="text-grove-red">{reason.stage}</span>
        </div>
        <div>
          <span className="text-grove-text-dim">Expected: </span>
          <span>{reason.expected}</span>
        </div>
        <div>
          <span className="text-grove-text-dim">Proposed Fix: </span>
          <span className="text-grove-amber">{reason.proposedFix}</span>
        </div>
      </div>

      {/* v0.9.4: Config-Driven Andon Cord — Explicit config file guidance */}
      {reason.stage === 'recognition' && (
        <div className="mt-4 p-4 border-l-4 border-grove-amber bg-grove-bg3">
          <div className="font-mono text-xs text-grove-amber tracking-widest uppercase mb-2">
            Config-Driven Fix Available
          </div>
          <p className="font-mono text-sm text-grove-text mb-3">
            The cognitive router cannot proceed because the intent is not mapped to any Tier.
          </p>
          <div className="bg-grove-bg2 border border-grove-border p-3 font-mono text-xs text-grove-text-dim">
            <span className="text-grove-green">Fix:</span> Open{' '}
            <span className="text-grove-text">routing.config.ts</span> in the right pane
            and add this intent to the desired compute tier array to resume execution.
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onReset}
        className="mt-4 border border-grove-border hover:border-grove-red hover:text-grove-red text-grove-text px-4 py-2 font-mono text-xs uppercase transition-colors"
      >
        Clear & Reset
      </button>
    </div>
  )
}
