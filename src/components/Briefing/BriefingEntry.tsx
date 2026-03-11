/**
 * BriefingEntry — Zone-aware briefing display
 *
 * GREEN: Collapsible summary ("Landscape stable, 7 signals processed")
 * YELLOW: Expanded with proposed adjustments + approve/reject inline
 * RED: Triggers full-screen takeover (handled by parent)
 */

import { useState } from 'react'
import type { Briefing, ScoreAdjustment, ProposedSubject, DomainConfig, ResearchSection } from '../../state/types'

/**
 * Strip <cite> tags from Claude's web search response
 * Sources are tracked separately, so we just need clean text
 * Handles: closed tags, unclosed tags, and self-closing tags
 */
function stripCitations(text: string): string {
  return text
    // First: closed <cite>content</cite> → keep content
    .replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, '$1')
    // Second: unclosed <cite...> at end of string → remove entirely
    .replace(/<cite[^>]*>(?![^<]*<\/cite>)[\s\S]*$/gi, '')
    // Third: stray opening <cite> tags without content → remove
    .replace(/<cite[^>]*>/gi, '')
    // Fourth: stray closing </cite> tags → remove
    .replace(/<\/cite>/gi, '')
}

interface BriefingEntryProps {
  briefing: Briefing
  onApprove?: (adjustmentId: string) => void
  onReject?: (adjustmentId: string) => void
  onApproveSubject?: (briefingId: string) => void
  onRejectSubject?: (briefingId: string) => void
  onApproveDomainConfig?: (briefingId: string) => void
  onRejectDomainConfig?: (briefingId: string) => void
  onDrillDown?: (briefing: Briefing) => void
  onRedTakeover?: (briefing: Briefing) => void
}

export function BriefingEntry({
  briefing,
  onApprove,
  onReject,
  onApproveSubject,
  onRejectSubject,
  onApproveDomainConfig,
  onRejectDomainConfig,
  onDrillDown,
  onRedTakeover,
}: BriefingEntryProps) {
  const [isExpanded, setIsExpanded] = useState(briefing.zone !== 'green')

  // RED zone triggers takeover immediately
  if (briefing.zone === 'red') {
    return (
      <div
        onClick={() => onRedTakeover?.(briefing)}
        className="border-l-4 border-l-zone-red border border-zone-red/50 bg-zone-red/10 p-4 cursor-pointer hover:bg-zone-red/20 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="bg-zone-red text-white px-2 py-0.5 text-xs font-mono uppercase">
              Red Zone
            </span>
            <span className="text-zone-red font-mono text-sm animate-pulse">
              Strategic Review Required
            </span>
          </div>
          <span className="text-xs text-grove-text-dim font-mono">
            {formatTime(briefing.timestamp)}
          </span>
        </div>
        <h3 className="font-serif text-lg text-grove-text mb-2">{briefing.title}</h3>
        <p className="text-sm text-grove-text-dim mb-3">{stripCitations(briefing.summary)}</p>
        <div className="flex items-center gap-2 text-xs text-zone-red">
          <span>Click to review strategic analysis</span>
          <span className="font-mono">→</span>
        </div>
      </div>
    )
  }

  // GREEN zone: collapsible summary
  if (briefing.zone === 'green') {
    return (
      <div
        className="border-l-4 border-l-zone-green border border-grove-border bg-grove-bg2 transition-colors"
      >
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-4 cursor-pointer hover:bg-grove-bg3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-zone-green font-mono text-sm">●</span>
              <span className="text-grove-text">{stripCitations(briefing.summary)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-grove-text-dim font-mono">
                {formatTime(briefing.timestamp)}
              </span>
              <span className="text-grove-text-dim">{isExpanded ? '▲' : '▼'}</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-grove-border">
            <div className="pt-3 space-y-2">
              {briefing.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-grove-text-dim">•</span>
                  <span className="text-grove-text-dim">{stripCitations(h.text)}</span>
                </div>
              ))}
              <button
                onClick={() => onDrillDown?.(briefing)}
                className="text-xs text-grove-amber hover:text-grove-amber-bright mt-2"
              >
                View {briefing.signalCount} signals →
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // YELLOW zone: expanded with approve/reject controls
  return (
    <div className="border-l-4 border-l-zone-yellow border border-grove-border bg-grove-bg2">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="bg-zone-yellow text-grove-bg px-2 py-0.5 text-xs font-mono uppercase font-bold">
              Yellow Zone
            </span>
            <span className="text-zone-yellow font-mono text-sm">
              Approval Required
            </span>
          </div>
          <span className="text-xs text-grove-text-dim font-mono">
            {formatTime(briefing.timestamp)}
          </span>
        </div>

        <h3 className="font-serif text-lg text-grove-text mb-2">{briefing.title}</h3>
        <p className="text-sm text-grove-text-dim mb-4">{stripCitations(briefing.summary)}</p>

        {/* Highlights */}
        {briefing.highlights.length > 0 && (
          <div className="space-y-2 mb-4">
            {briefing.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className={h.zone === 'yellow' ? 'text-zone-yellow' : 'text-grove-text-dim'}>
                  {h.zone === 'yellow' ? '◆' : '•'}
                </span>
                <span className="text-grove-text">{stripCitations(h.text)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Research Section - Web search sourced intelligence */}
        {briefing.research && (
          <ResearchCard research={briefing.research} />
        )}

        {/* Pending Adjustments */}
        {briefing.pendingAdjustments && briefing.pendingAdjustments.length > 0 && (
          <div className="border-t border-grove-border pt-4">
            <h4 className="text-xs font-mono text-grove-text-dim uppercase mb-3">
              Proposed Score Adjustments
            </h4>
            <div className="space-y-3">
              {briefing.pendingAdjustments.map((adj) => (
                <AdjustmentCard
                  key={adj.id}
                  adjustment={adj}
                  onApprove={() => onApprove?.(adj.id)}
                  onReject={() => onReject?.(adj.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pending Subject (training mode) */}
        {briefing.pendingSubject && (
          <div className="border-t border-grove-border pt-4">
            <h4 className="text-xs font-mono text-grove-text-dim uppercase mb-3">
              Proposed Watchlist Subject
            </h4>
            <SubjectProposalCard
              subject={briefing.pendingSubject}
              onApprove={() => onApproveSubject?.(briefing.id)}
              onReject={() => onRejectSubject?.(briefing.id)}
            />
          </div>
        )}

        {/* Pending Domain Config (domain setup) */}
        {briefing.pendingDomainConfig && (
          <div className="border-t border-grove-border pt-4">
            <h4 className="text-xs font-mono text-grove-text-dim uppercase mb-3">
              Proposed Domain Configuration
            </h4>
            <DomainConfigCard
              config={briefing.pendingDomainConfig}
              onApprove={() => onApproveDomainConfig?.(briefing.id)}
              onReject={() => onRejectDomainConfig?.(briefing.id)}
            />
          </div>
        )}

        {/* Drill-down link */}
        <div className="mt-4 pt-3 border-t border-grove-border">
          <button
            onClick={() => onDrillDown?.(briefing)}
            className="text-xs text-grove-amber hover:text-grove-amber-bright"
          >
            View underlying signals ({briefing.signalCount}) →
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Inline adjustment card with approve/reject
 */
function AdjustmentCard({
  adjustment,
  onApprove,
  onReject,
}: {
  adjustment: ScoreAdjustment
  onApprove: () => void
  onReject: () => void
}) {
  const deltaDisplay = adjustment.delta > 0
    ? `+${(adjustment.delta * 100).toFixed(1)}%`
    : `${(adjustment.delta * 100).toFixed(1)}%`

  const deltaColor = Math.abs(adjustment.delta) >= 0.15
    ? 'text-zone-red'
    : Math.abs(adjustment.delta) >= 0.05
      ? 'text-zone-yellow'
      : 'text-zone-green'

  return (
    <div className="bg-grove-bg border border-grove-border p-3">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-serif text-grove-text">{adjustment.subjectName}</span>
          <span className={`ml-3 font-mono font-bold ${deltaColor}`}>{deltaDisplay}</span>
        </div>
        <span className="text-xs text-grove-text-dim font-mono">
          conf: {(adjustment.confidence * 100).toFixed(0)}%
        </span>
      </div>
      <p className="text-sm text-grove-text-dim mb-3">{stripCitations(adjustment.reason)}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={onApprove}
          className="px-3 py-1.5 bg-zone-green text-white text-sm font-mono hover:bg-zone-green/80 transition-colors"
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="px-3 py-1.5 border border-grove-border text-grove-text-dim text-sm font-mono hover:bg-grove-bg3 transition-colors"
        >
          Reject
        </button>
        <span className="text-xs text-grove-text-dim ml-auto">
          Triggered by: {adjustment.triggeredBy}
        </span>
      </div>
    </div>
  )
}

/**
 * Subject proposal card for training mode
 */
function SubjectProposalCard({
  subject,
  onApprove,
  onReject,
}: {
  subject: ProposedSubject
  onApprove: () => void
  onReject: () => void
}) {
  const tierColors: Record<string, string> = {
    primary: 'text-grove-amber',
    secondary: 'text-tier-2',
    emerging: 'text-tier-1',
  }

  const typeIcons: Record<string, string> = {
    competitor: '⚔',
    partner: '🤝',
    market: '📊',
    technology: '🔬',
    regulatory: '📋',
  }

  return (
    <div className="bg-grove-bg border border-grove-border p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-serif text-lg text-grove-text">{subject.name}</span>
          <span className="ml-2">{typeIcons[subject.type] || '•'}</span>
        </div>
        <span className={`text-xs font-mono uppercase ${tierColors[subject.tier] || 'text-grove-text-dim'}`}>
          {subject.tier}
        </span>
      </div>

      {/* Type & Initial Score */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <span className="text-grove-text-dim">
          Type: <span className="text-grove-text">{subject.type}</span>
        </span>
        <span className="text-grove-text-dim">
          Initial Score: <span className="text-grove-text font-mono">{(subject.initialScore * 100).toFixed(0)}</span>
        </span>
      </div>

      {/* Keywords */}
      <div className="mb-3">
        <span className="text-xs text-grove-text-dim uppercase">Keywords:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {subject.keywords.slice(0, 6).map((kw, i) => (
            <span key={i} className="px-2 py-0.5 bg-grove-bg3 text-xs font-mono text-grove-text">
              {kw}
            </span>
          ))}
          {subject.keywords.length > 6 && (
            <span className="px-2 py-0.5 text-xs text-grove-text-dim">
              +{subject.keywords.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Aliases */}
      {subject.aliases.length > 0 && (
        <div className="mb-3">
          <span className="text-xs text-grove-text-dim uppercase">Aliases:</span>
          <span className="ml-2 text-sm text-grove-text">
            {subject.aliases.join(', ')}
          </span>
        </div>
      )}

      {/* Rationale */}
      <p className="text-sm text-grove-text-dim mb-4 italic">"{subject.rationale}"</p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onApprove}
          className="px-4 py-2 bg-zone-green text-white text-sm font-mono hover:bg-zone-green/80 transition-colors"
        >
          Add to Watchlist
        </button>
        <button
          onClick={onReject}
          className="px-4 py-2 border border-grove-border text-grove-text-dim text-sm font-mono hover:bg-grove-bg3 transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  )
}

/**
 * Domain configuration card for domain setup
 */
function DomainConfigCard({
  config,
  onApprove,
  onReject,
}: {
  config: DomainConfig
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="bg-grove-bg border border-grove-border p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="font-serif text-lg text-grove-text">{config.domain.name}</span>
          <span className="ml-2 text-grove-amber">🎯</span>
        </div>
        <span className="text-xs font-mono text-grove-text-dim">
          v{config.version}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-grove-text-dim mb-4 italic">"{config.domain.description}"</p>

      {/* Signal Types */}
      <div className="mb-4">
        <span className="text-xs text-grove-text-dim uppercase">Signal Types to Track:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {config.signalTypes.map((st) => (
            <div key={st.id} className="px-2 py-1 bg-grove-bg3 border border-grove-border">
              <span className="text-sm text-grove-text">{st.label}</span>
              <span className="ml-2 text-xs text-grove-text-dim font-mono">
                ({(st.weight * 100).toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scoring Factors */}
      <div className="mb-4">
        <span className="text-xs text-grove-text-dim uppercase">Scoring Rubric:</span>
        <div className="mt-2 space-y-1">
          {config.scoringRubric.factors.map((factor) => (
            <div key={factor.name} className="flex items-center gap-2 text-sm">
              <span className="w-24 font-mono text-grove-amber">{(factor.weight * 100).toFixed(0)}%</span>
              <span className="text-grove-text">{factor.name}</span>
              <span className="text-grove-text-dim">— {factor.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Types */}
      <div className="mb-4">
        <span className="text-xs text-grove-text-dim uppercase">Subject Categories:</span>
        <div className="flex flex-wrap gap-1 mt-2">
          {config.subjectTypes.map((st) => (
            <span key={st.id} className="px-2 py-0.5 bg-grove-bg3 text-xs font-mono text-grove-text">
              {st.label}
            </span>
          ))}
        </div>
      </div>

      {/* Domain Keywords */}
      <div className="mb-4">
        <span className="text-xs text-grove-text-dim uppercase">Domain Keywords:</span>
        <div className="flex flex-wrap gap-1 mt-2">
          {config.domainKeywords.slice(0, 8).map((kw, i) => (
            <span key={i} className="px-2 py-0.5 bg-tier-1/20 text-xs font-mono text-tier-1">
              {kw}
            </span>
          ))}
          {config.domainKeywords.length > 8 && (
            <span className="px-2 py-0.5 text-xs text-grove-text-dim">
              +{config.domainKeywords.length - 8} more
            </span>
          )}
        </div>
      </div>

      {/* Zone Thresholds */}
      <div className="mb-4 p-2 bg-grove-bg2 border border-grove-border">
        <span className="text-xs text-grove-text-dim uppercase">Zone Thresholds:</span>
        <div className="flex gap-4 mt-1 text-xs font-mono">
          <span className="text-zone-green">GREEN: Δ&lt;{config.scoringRubric.zoneThresholds.green}%</span>
          <span className="text-zone-yellow">YELLOW: {config.scoringRubric.zoneThresholds.green}-{config.scoringRubric.zoneThresholds.yellow}%</span>
          <span className="text-zone-red">RED: ≥{config.scoringRubric.zoneThresholds.red}%</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onApprove}
          className="px-4 py-2 bg-zone-green text-white text-sm font-mono hover:bg-zone-green/80 transition-colors"
        >
          Approve Configuration
        </button>
        <button
          onClick={onReject}
          className="px-4 py-2 border border-grove-border text-grove-text-dim text-sm font-mono hover:bg-grove-bg3 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}

/**
 * Research card displaying web search results and analysis
 * Shows real sources with citations — not fabricated
 */
function ResearchCard({ research }: { research: ResearchSection }) {
  return (
    <div className="border-t border-grove-border pt-4 space-y-4">
      {/* Analysis */}
      <div>
        <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
          Analysis
        </h4>
        <p className="text-sm text-grove-text leading-relaxed whitespace-pre-wrap">
          {stripCitations(research.analysis)}
        </p>
      </div>

      {/* Key Findings */}
      {research.keyFindings.length > 0 && (
        <div>
          <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
            Key Findings
          </h4>
          <ul className="space-y-2">
            {research.keyFindings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-grove-amber mt-1">•</span>
                <span className="text-grove-text">{stripCitations(finding)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources - REAL URLs from web search */}
      {research.sources.length > 0 && (
        <div>
          <h4 className="text-xs font-mono text-grove-text-dim uppercase tracking-wider mb-2">
            Sources ({research.sources.length})
          </h4>
          <div className="space-y-2">
            {research.sources.map((source, i) => {
              // Safely parse hostname
              let hostname = 'unknown'
              try {
                hostname = new URL(source.url).hostname
              } catch {
                hostname = source.url
              }

              return (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm p-2 -mx-2 hover:bg-grove-bg3 rounded transition-colors group"
                >
                  <span className="text-grove-amber shrink-0">📰</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-grove-text group-hover:text-grove-amber truncate">
                      {source.title}
                    </div>
                    {source.citedText && (
                      <div className="text-xs text-grove-text-dim mt-1 line-clamp-2">
                        "{source.citedText}"
                      </div>
                    )}
                    <div className="text-xs text-grove-text-dim mt-1 truncate">
                      {hostname}
                      {source.pageAge && ` · ${source.pageAge}`}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Provenance Footer */}
      <div className="flex items-center justify-between text-xs text-grove-text-dim border-t border-grove-border pt-3 mt-4">
        <span>
          {research.searchCount} web search{research.searchCount !== 1 ? 'es' : ''} executed
        </span>
        <span className="font-mono">
          Template #<span className="text-grove-amber">{research.templateHash}</span>
        </span>
      </div>
    </div>
  )
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return date.toLocaleDateString()
}
