/**
 * RedZoneTakeover — Full-screen strategic analysis for RED zone briefings
 *
 * This is the "human decision required" interface.
 * No auto-execute. No shortcuts. The operator owns this decision.
 */

import type { Briefing } from '../../state/types'

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

interface RedZoneTakeoverProps {
  briefing: Briefing
  onClose: () => void
  onApprove?: (adjustmentId: string) => void
  onReject?: (adjustmentId: string) => void
}

export function RedZoneTakeover({
  briefing,
  onClose,
  onApprove,
  onReject,
}: RedZoneTakeoverProps) {
  return (
    <div className="fixed inset-0 z-50 bg-grove-bg/95 flex flex-col">
      {/* Header */}
      <header className="border-b border-zone-red p-4 bg-zone-red/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="bg-zone-red text-white px-3 py-1 font-mono text-sm uppercase animate-pulse">
              Red Zone
            </span>
            <h1 className="font-serif text-2xl text-grove-text">
              Strategic Analysis — Action Required
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-grove-text-dim hover:text-grove-text text-2xl"
          >
            ×
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Briefing Title & Meta */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-grove-text mb-3">{briefing.title}</h2>
            <div className="flex items-center gap-4 text-sm text-grove-text-dim">
              <span className="font-mono">{new Date(briefing.timestamp).toLocaleString()}</span>
              <span>•</span>
              <span>{briefing.signalCount} signals analyzed</span>
              <span>•</span>
              <span>Tier {briefing.tier} cognition</span>
            </div>
          </div>

          {/* Executive Summary */}
          <section className="mb-8 p-6 border border-zone-red/30 bg-zone-red/5">
            <h3 className="font-mono text-xs text-zone-red uppercase tracking-wider mb-3">
              Executive Summary
            </h3>
            <p className="text-lg text-grove-text leading-relaxed">{stripCitations(briefing.summary)}</p>
          </section>

          {/* Proposed Score Adjustments — always render when present, independent of research */}
          {briefing.pendingAdjustments && briefing.pendingAdjustments.length > 0 && (
            <section className="mb-8">
              <h3 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-4">
                Proposed Score Adjustments
              </h3>
              <div className="space-y-4">
                {briefing.pendingAdjustments.map((adj) => {
                  const deltaDisplay = adj.delta > 0
                    ? `+${(adj.delta * 100).toFixed(1)}%`
                    : `${(adj.delta * 100).toFixed(1)}%`

                  return (
                    <div key={adj.id} className="p-4 bg-grove-bg2 border border-grove-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-lg text-grove-text">{adj.subjectName}</span>
                          <span className="font-mono text-xl font-bold text-zone-red">{deltaDisplay}</span>
                        </div>
                        <span className="text-sm text-grove-text-dim font-mono">
                          Confidence: {(adj.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-grove-text-dim mb-4">{stripCitations(adj.reason)}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onApprove?.(adj.id)}
                          className="px-4 py-2 bg-zone-green text-white font-mono hover:bg-zone-green/80 transition-colors"
                        >
                          Approve Adjustment
                        </button>
                        <button
                          onClick={() => onReject?.(adj.id)}
                          className="px-4 py-2 border border-grove-border text-grove-text-dim font-mono hover:bg-grove-bg3 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Research Analysis */}
          {briefing.research && (
            <section className="mb-8">
              <h3 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-4">
                Research Analysis
              </h3>
              <p className="text-lg text-grove-text leading-relaxed mb-6">
                {stripCitations(briefing.research.analysis)}
              </p>

              {/* Key Findings */}
              {briefing.research.keyFindings.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-3">
                    Key Findings
                  </h4>
                  <ul className="space-y-2">
                    {briefing.research.keyFindings.map((finding, i) => (
                      <li key={i} className="flex items-start gap-3 text-grove-text">
                        <span className="text-zone-red mt-1">•</span>
                        <span>{stripCitations(finding)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sources */}
              {briefing.research.sources.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-3">
                    Sources ({briefing.research.sources.length})
                  </h4>
                  <div className="space-y-3">
                    {briefing.research.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 bg-grove-bg3 hover:bg-grove-bg border border-grove-border transition-colors group"
                      >
                        <span className="text-grove-amber">↗</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-grove-text group-hover:text-grove-amber">
                            {source.title}
                          </div>
                          {source.citedText && (
                            <div className="text-sm text-grove-text-dim mt-1 line-clamp-2">
                              "{stripCitations(source.citedText)}"
                            </div>
                          )}
                          <div className="text-xs text-grove-text-dim mt-1">
                            {(() => {
                              try {
                                return new URL(source.url).hostname
                              } catch {
                                return source.url
                              }
                            })()}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Strategic Analysis */}
          <section className="mb-8">
            <h3 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-4">
              Strategic Analysis
            </h3>
            <div className="space-y-4">
              {briefing.highlights.map((h, i) => (
                <div
                  key={i}
                  className={`p-4 border-l-4 ${
                    h.zone === 'red'
                      ? 'border-l-zone-red bg-zone-red/5'
                      : h.zone === 'yellow'
                        ? 'border-l-zone-yellow bg-zone-yellow/5'
                        : 'border-l-grove-border bg-grove-bg2'
                  }`}
                >
                  <p className="text-grove-text">{stripCitations(h.text)}</p>
                  {h.subjectId && (
                    <span className="text-xs text-grove-text-dim mt-2 block font-mono">
                      Subject: {h.subjectId}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          {briefing.recommendations && briefing.recommendations.length > 0 && (
            <section className="mb-8">
              <h3 className="font-mono text-xs text-grove-text-dim uppercase tracking-wider mb-4">
                Recommendations
              </h3>
              <div className="space-y-3">
                {briefing.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-grove-bg2 border border-grove-border">
                    <span className={`px-2 py-0.5 text-xs font-mono uppercase ${
                      rec.priority === 'high' ? 'bg-zone-red/20 text-zone-red' :
                      rec.priority === 'medium' ? 'bg-zone-yellow/20 text-zone-yellow' :
                      'bg-grove-bg text-grove-text-dim'
                    }`}>
                      {rec.priority}
                    </span>
                    <div>
                      <p className="text-grove-text">{stripCitations(rec.action)}</p>
                      <p className="text-sm text-grove-text-dim mt-1">{stripCitations(rec.rationale)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zone-red p-4 bg-zone-red/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-sm text-grove-text-dim">
            High-confidence research surfaced for your review.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-grove-border text-grove-text font-mono hover:bg-grove-bg3"
          >
            Return to Inbox
          </button>
        </div>
      </footer>
    </div>
  )
}
