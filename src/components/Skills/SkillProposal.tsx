/**
 * SkillProposal — Pattern Detection Notification
 *
 * This proves Claim #5: The Skill Flywheel.
 * After 3 repetitions of a pattern, propose upgrading to Tier 0.
 *
 * When approved:
 * - Future matches skip cloud inference entirely
 * - Cost drops to $0.00
 * - Sovereignty becomes 100% local
 *
 * Design: Strict geometry (no rounded)
 */

import { useSkillProposal, useAppDispatch } from '../../state/context'

export function SkillProposal() {
  const proposal = useSkillProposal()
  const dispatch = useAppDispatch()

  if (!proposal.active) return null

  return (
    <div className="fixed bottom-24 right-8 w-80 bg-grove-bg2 border border-tier-0 shadow-lg shadow-tier-0/20 p-4 animate-slide-up">
      <div className="flex items-center gap-2 text-tier-0 font-medium mb-2">
        <span>⚡</span>
        <span>Pattern Detected!</span>
      </div>

      <p className="text-sm text-grove-text-mid mb-3">
        I've seen <strong className="text-grove-text">{proposal.intent}</strong> {proposal.count} times.
        Want to turn this into a cached skill?
      </p>

      <div className="text-xs bg-grove-bg p-2 mb-3 font-mono">
        <div className="text-grove-text-dim mb-1">Proposed skill:</div>
        <div className="text-grove-text-mid">{proposal.pattern}</div>
      </div>

      <div className="text-xs text-grove-text-dim mb-3">
        <span className="text-grove-green">↓</span> Tier 2 → Tier 0{' '}
        <span className="text-grove-text-dim">|</span>{' '}
        <span className="text-grove-green">$0.01 → $0.00</span>{' '}
        <span className="text-grove-text-dim">|</span>{' '}
        <span className="text-grove-green">☁️ → 🏠</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'APPROVE_SKILL' })}
          className="flex-1 bg-tier-0 hover:bg-tier-0/80 text-grove-bg font-medium py-2 text-sm transition-colors"
        >
          Create Skill
        </button>
        <button
          onClick={() => dispatch({ type: 'REJECT_SKILL' })}
          className="flex-1 bg-grove-border hover:bg-grove-border-light text-grove-text py-2 text-sm transition-colors"
        >
          Not Now
        </button>
      </div>
    </div>
  )
}
