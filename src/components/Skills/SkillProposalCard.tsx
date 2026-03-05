/**
 * SkillProposalCard — Inline Skill Flywheel Proposal
 *
 * This proves Claim #5: The Skill Flywheel.
 * After 3 repetitions of a pattern, propose upgrading to Tier 0.
 *
 * When approved:
 * - Future matches skip cloud inference entirely
 * - Cost drops to $0.00
 * - Sovereignty becomes 100% local
 *
 * v0.6.0: Relocated from floating modal to inline conversational flow.
 * Follows DiagnosticCard pattern — renders inside InteractionCard.
 *
 * Design: Editorial Industrial (Grove Manifesto)
 * - Sharp corners (no rounded)
 * - Amber accent for "learning event"
 * - Monospace typography for system data
 */

interface SkillProposalCardProps {
  intent: string
  pattern: string | null
  count: number
  onApprove: () => void
  onReject: () => void
}

export function SkillProposalCard({
  intent,
  pattern,
  count,
  onApprove,
  onReject,
}: SkillProposalCardProps) {
  return (
    <div className="border-t-2 border-x border-b border-grove-amber bg-grove-bg2 p-5 mt-4">
      {/* Header */}
      <div className="font-mono text-grove-amber text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
        <span>⚡</span>
        <span>Pattern Detected</span>
      </div>

      {/* Message */}
      <p className="font-sans text-grove-text text-sm mb-4">
        I've seen <strong className="text-grove-text">{intent}</strong> {count} times.
        Want to turn this into a cached skill?
      </p>

      {/* Proposed Skill Pattern */}
      <div className="bg-grove-bg border border-grove-border p-3 font-mono text-xs text-grove-text-mid mb-3">
        <div className="text-grove-text-dim mb-1">Proposed skill:</div>
        <div className="text-grove-text">{pattern}</div>
      </div>

      {/* Tier Migration Preview (The Ratchet) */}
      <div className="bg-grove-bg border border-grove-border p-3 font-mono text-xs text-grove-text-mid flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-grove-text-dim">Tier 2</span>
          <span className="text-grove-amber">→</span>
          <span className="text-grove-green">Tier 0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-grove-text-dim">$0.01</span>
          <span className="text-grove-amber">→</span>
          <span className="text-grove-green">$0.00</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-grove-text-dim">☁️</span>
          <span className="text-grove-amber">→</span>
          <span className="text-grove-green">🏠</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onApprove}
          className="bg-grove-amber hover:bg-grove-amber-bright text-grove-bg font-mono text-xs uppercase px-4 py-2 transition-colors"
        >
          Create Skill
        </button>
        <button
          onClick={onReject}
          className="border border-grove-border hover:border-grove-text text-grove-text-dim hover:text-grove-text font-mono text-xs uppercase px-4 py-2 transition-colors"
        >
          Not Now
        </button>
      </div>
    </div>
  )
}
