/**
 * FlywheelView — Skill Flywheel Visualization
 *
 * This proves Claim #5: The Skill Flywheel.
 * Shows the complete picture of pattern learning and tier migration.
 *
 * Sections:
 * 1. Pending Proposals — Patterns approaching promotion threshold (N/5 progress bars)
 * 2. Active Skills — Promoted patterns with cumulative savings and fire counts
 * 3. Tier Distribution — Reused from Dashboard, shows the ratchet effect
 */

import { useSkills, usePatternCounts, useMetrics, useRoutingConfig } from '../../state/context'
import { TierDistribution } from '../Dashboard/TierDistribution'

/**
 * Progress bar for a pattern approaching skill promotion
 */
function PatternProgressCard({
  pattern,
  count,
  threshold,
}: {
  pattern: string
  count: number
  threshold: number
}) {
  const progress = Math.min((count / threshold) * 100, 100)
  const remaining = threshold - count

  return (
    <div className="p-4 bg-grove-bg2 border border-grove-border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-sm text-grove-text">{pattern}</span>
        <span className="font-mono text-xs text-grove-amber">
          {count}/{threshold}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-grove-bg rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-grove-amber transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-xs text-grove-text-dim font-mono">
        {remaining > 0
          ? `${remaining} more approval${remaining > 1 ? 's' : ''} to become a skill`
          : 'Ready for promotion!'}
      </div>
    </div>
  )
}

/**
 * Card for an active (promoted) skill
 */
function ActiveSkillCard({
  intent,
  pattern,
  timesFired,
  cumulativeSavings,
  approvedAt,
}: {
  intent: string
  pattern: string
  timesFired: number
  cumulativeSavings: number
  approvedAt: string
}) {
  const approvedDate = new Date(approvedAt).toLocaleDateString()

  return (
    <div className="p-4 bg-grove-bg2 border border-tier-0/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-tier-0/20 text-tier-0 font-mono text-xs uppercase">
            Tier 0
          </span>
          <span className="font-serif text-grove-text">{intent}</span>
        </div>
        <span className="text-xs text-grove-text-dim font-mono">
          Since {approvedDate}
        </span>
      </div>

      <div className="text-sm text-grove-text-dim mb-3 font-mono">
        {pattern}
      </div>

      <div className="flex items-center gap-6 text-sm font-mono">
        <div>
          <span className="text-grove-text-dim">Fired: </span>
          <span className="text-grove-text">{timesFired}x</span>
        </div>
        <div>
          <span className="text-grove-text-dim">Saved: </span>
          <span className="text-tier-0 font-medium">
            ${cumulativeSavings.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function FlywheelView() {
  const skills = useSkills()
  const patternCounts = usePatternCounts()
  const metrics = useMetrics()
  const routingConfig = useRoutingConfig()

  // Get threshold from config (default 5)
  const threshold = routingConfig.skillPromotion?.afterNApprovals ?? 5

  // Filter patterns that are in progress (count > 0, not yet skills)
  const skillIntents = new Set(skills.map(s => s.intentMatch))
  const pendingPatterns = Object.entries(patternCounts)
    .filter(([intent, count]) => count > 0 && !skillIntents.has(intent))
    .sort((a, b) => b[1] - a[1]) // Sort by count descending

  // Calculate total savings from skills
  const totalSavings = skills.reduce((sum, s) => sum + s.cumulativeSavings, 0)
  const totalFires = skills.reduce((sum, s) => sum + s.timesFired, 0)

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl text-grove-text mb-2">
            Skill Flywheel
          </h1>
          <p className="text-grove-text-dim">
            Patterns are learned through repetition. After {threshold} approvals, a pattern becomes a cached skill at Tier 0.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-grove-bg2 border border-grove-border">
            <div className="text-xs text-grove-text-dim font-mono uppercase tracking-wider mb-1">
              Active Skills
            </div>
            <div className="text-2xl font-mono text-grove-text">
              {skills.length}
            </div>
          </div>
          <div className="p-4 bg-grove-bg2 border border-grove-border">
            <div className="text-xs text-grove-text-dim font-mono uppercase tracking-wider mb-1">
              Total Fires
            </div>
            <div className="text-2xl font-mono text-grove-text">
              {totalFires}
            </div>
          </div>
          <div className="p-4 bg-grove-bg2 border border-tier-0/30">
            <div className="text-xs text-grove-text-dim font-mono uppercase tracking-wider mb-1">
              Cumulative Savings
            </div>
            <div className="text-2xl font-mono text-tier-0">
              ${totalSavings.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Pending Proposals */}
        <section>
          <h2 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-4">
            Patterns in Progress ({pendingPatterns.length})
          </h2>

          {pendingPatterns.length === 0 ? (
            <div className="p-6 bg-grove-bg2 border border-grove-border text-center">
              <p className="text-grove-text-dim text-sm">
                No patterns detected yet. Use the app to establish repeatable workflows.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPatterns.map(([pattern, count]) => (
                <PatternProgressCard
                  key={pattern}
                  pattern={pattern}
                  count={count}
                  threshold={threshold}
                />
              ))}
            </div>
          )}
        </section>

        {/* Active Skills */}
        <section>
          <h2 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-4">
            Active Skills ({skills.length})
          </h2>

          {skills.length === 0 ? (
            <div className="p-6 bg-grove-bg2 border border-grove-border text-center">
              <p className="text-grove-text-dim text-sm">
                No skills promoted yet. Keep using patterns to trigger the flywheel.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => (
                <ActiveSkillCard
                  key={skill.id}
                  intent={skill.intentMatch}
                  pattern={skill.pattern}
                  timesFired={skill.timesFired}
                  cumulativeSavings={skill.cumulativeSavings}
                  approvedAt={skill.approvedAt}
                />
              ))}
            </div>
          )}
        </section>

        {/* Tier Distribution */}
        <section>
          <h2 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-4">
            Tier Distribution
          </h2>
          <TierDistribution tierHistory={metrics.tierHistory} />
        </section>

        {/* Flywheel Explanation */}
        <section className="p-6 bg-grove-bg2 border border-grove-border">
          <h3 className="font-mono text-xs text-grove-amber uppercase tracking-wider mb-3">
            How the Flywheel Works
          </h3>
          <div className="space-y-2 text-sm text-grove-text-dim">
            <p>
              <strong className="text-grove-text">1. Pattern Detection:</strong> The system tracks repeated intents and queries.
            </p>
            <p>
              <strong className="text-grove-text">2. Proposal:</strong> After {threshold} repetitions, a skill proposal surfaces for approval.
            </p>
            <p>
              <strong className="text-grove-text">3. Promotion:</strong> Approved patterns become Tier 0 skills — cached, free, local.
            </p>
            <p>
              <strong className="text-grove-text">4. The Ratchet:</strong> More skills = lower average tier = lower cost over time.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FlywheelView
