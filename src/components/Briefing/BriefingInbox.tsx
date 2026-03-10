/**
 * BriefingInbox — Primary view for Signal Watch
 *
 * Each briefing cycle produces one entry:
 * - GREEN: Collapsible summaries
 * - YELLOW: Expanded with approve/reject controls
 * - RED: Full-screen takeover with strategic analysis
 */

import { useState, useRef, useEffect } from 'react'
import type { Briefing } from '../../state/types'
import { BriefingEntry } from './BriefingEntry'
import { RedZoneTakeover } from './RedZoneTakeover'
import { SkillProposalCard } from '../Skills'
import { useSkillProposal, useAppDispatch } from '../../state/context'

interface BriefingInboxProps {
  briefings?: Briefing[]
  onApprove?: (adjustmentId: string) => void
  onReject?: (adjustmentId: string) => void
  onApproveSubject?: (briefingId: string) => void
  onRejectSubject?: (briefingId: string) => void
  onApproveDomainConfig?: (briefingId: string) => void
  onRejectDomainConfig?: (briefingId: string) => void
  onDrillDown?: (briefing: Briefing) => void
}

export function BriefingInbox({
  briefings = [],
  onApprove,
  onReject,
  onApproveSubject,
  onRejectSubject,
  onApproveDomainConfig,
  onRejectDomainConfig,
  onDrillDown,
}: BriefingInboxProps) {
  const [redTakeover, setRedTakeover] = useState<Briefing | null>(null)
  const skillProposal = useSkillProposal()
  const dispatch = useAppDispatch()
  const scrollEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new briefings arrive
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [briefings.length])

  // Sync redTakeover with updated briefing data (so approve/reject reflects immediately)
  useEffect(() => {
    if (redTakeover) {
      const updated = briefings.find(b => b.id === redTakeover.id)
      if (updated) {
        // Update with fresh data
        setRedTakeover(updated)
      } else {
        // Briefing was removed, close modal
        setRedTakeover(null)
      }
    }
  }, [briefings, redTakeover?.id])

  // Count by zone
  const pendingSubjects = briefings.filter(b => b.pendingSubject).length
  const stats = {
    total: briefings.length,
    green: briefings.filter(b => b.zone === 'green').length,
    yellow: briefings.filter(b => b.zone === 'yellow').length,
    red: briefings.filter(b => b.zone === 'red').length,
    pendingApprovals: briefings
      .filter(b => b.zone === 'yellow')
      .reduce((sum, b) => sum + (b.pendingAdjustments?.length || 0) + (b.pendingSubject ? 1 : 0), 0),
    pendingSubjects,
  }

  const handleRedTakeover = (briefing: Briefing) => {
    setRedTakeover(briefing)
  }

  const handleCloseTakeover = () => {
    setRedTakeover(null)
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-grove-border p-4 bg-grove-bg2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl text-grove-text">Briefing Inbox</h2>
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-grove-text-dim">{stats.total} briefings</span>
              {stats.pendingApprovals > 0 && (
                <span className="text-zone-yellow">
                  {stats.pendingApprovals} pending approval{stats.pendingApprovals > 1 ? 's' : ''}
                </span>
              )}
              {stats.red > 0 && (
                <span className="text-zone-red animate-pulse">
                  {stats.red} high-value
                </span>
              )}
            </div>
          </div>

          {/* Zone summary pills */}
          <div className="flex gap-2">
            {stats.red > 0 && (
              <span className="px-2 py-1 text-xs font-mono bg-zone-red/20 text-zone-red border border-zone-red/50">
                {stats.red} RED
              </span>
            )}
            {stats.yellow > 0 && (
              <span className="px-2 py-1 text-xs font-mono bg-zone-yellow/20 text-zone-yellow border border-zone-yellow/50">
                {stats.yellow} YELLOW
              </span>
            )}
            <span className="px-2 py-1 text-xs font-mono bg-zone-green/20 text-zone-green border border-zone-green/50">
              {stats.green} GREEN
            </span>
          </div>
        </div>

        {/* Briefing List */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-[65%] mx-auto space-y-4">
            {/* Skill Flywheel Proposal — Shows when pattern threshold reached */}
            {skillProposal.active && skillProposal.intent && (
              <SkillProposalCard
                intent={skillProposal.intent}
                pattern={skillProposal.pattern}
                count={skillProposal.count}
                onApprove={() => dispatch({ type: 'APPROVE_SKILL' })}
                onReject={() => dispatch({ type: 'REJECT_SKILL' })}
              />
            )}

            {briefings.length === 0 ? (
              <div className="text-center py-12 text-grove-text-dim">
                <p className="font-serif text-lg mb-2">No briefings yet</p>
                <p className="text-sm">Run an ad-hoc scan or wait for the next scheduled cycle</p>
              </div>
            ) : (
              // Chronological order: oldest first, newest at bottom (chat convention)
              [...briefings]
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((briefing) => (
                  <BriefingEntry
                    key={briefing.id}
                    briefing={briefing}
                    onApprove={onApprove}
                    onReject={onReject}
                    onApproveSubject={onApproveSubject}
                    onRejectSubject={onRejectSubject}
                    onApproveDomainConfig={onApproveDomainConfig}
                    onRejectDomainConfig={onRejectDomainConfig}
                    onDrillDown={onDrillDown}
                    onRedTakeover={handleRedTakeover}
                  />
                ))
            )}
            {/* Scroll anchor for auto-scroll on new briefings */}
            <div ref={scrollEndRef} className="h-4 flex-shrink-0" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-grove-border p-3 bg-grove-bg2">
          <div className="flex items-center justify-between text-xs text-grove-text-dim">
            <span>
              Briefing cycle: hourly | Next: {getNextCycleTime()}
            </span>
            <span className="font-mono">
              Zone thresholds: Δ&lt;5% (green), 5-15% (yellow), ≥15% (red)
            </span>
          </div>
        </div>
      </div>

      {/* RED Zone Takeover Modal */}
      {redTakeover && (
        <RedZoneTakeover
          briefing={redTakeover}
          onClose={handleCloseTakeover}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
    </>
  )
}

function getNextCycleTime(): string {
  const now = new Date()
  const next = new Date(now)
  next.setHours(next.getHours() + 1, 0, 0, 0)
  return next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default BriefingInbox
