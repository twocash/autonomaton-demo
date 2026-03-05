/**
 * TelemetryStream — Real-time audit trail (Terminal aesthetic)
 *
 * This proves Claim #7: Transparency by construction.
 * Every routing decision is a traced artifact.
 *
 * Features:
 * - Live JSON stream of every interaction
 * - Click entry → highlights corresponding interaction
 * - Export audit log as JSON
 * - Terminal-style green tint for visual distinction from chat UI
 *
 * Typography: Fragment Mono for all content
 * Design: Strict geometry (no rounded)
 */

import { useTelemetry, useAppDispatch, useAppState } from '../../state/context'
import { generateProvenanceHash } from '../../utils/provenance'

export function TelemetryStream() {
  const telemetry = useTelemetry()
  const dispatch = useAppDispatch()
  const { selectedTelemetryId, modelConfig } = useAppState()

  const handleEntryClick = (id: string) => {
    dispatch({ type: 'SELECT_TELEMETRY', id: selectedTelemetryId === id ? null : id })
    dispatch({ type: 'SELECT_INTERACTION', id: selectedTelemetryId === id ? null : id })
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(telemetry, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `autonomaton-audit-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="h-48 border-t border-grove-border bg-grove-bg flex flex-col terminal-stream">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-grove-border/50">
        <div className="flex items-center gap-2">
          <span className="text-grove-green animate-pulse">●</span>
          <span className="text-sm font-mono font-medium text-grove-green/80">
            Telemetry Stream
          </span>
          {telemetry.length > 0 && (
            <span className="text-xs font-mono text-grove-green/60">
              ({telemetry.length} entries)
            </span>
          )}
        </div>
        <button
          onClick={handleExport}
          className="text-xs font-mono text-grove-green hover:text-grove-green/80 transition-colors border border-grove-green/30 hover:border-grove-green/60 px-2 py-0.5"
        >
          Export Audit Log
        </button>
      </div>

      {/* Stream */}
      <div className="flex-1 p-2 overflow-y-auto scrollbar-thin font-mono text-xs">
        {telemetry.length === 0 ? (
          <div className="text-grove-green/50 p-2 space-y-1">
            <p><span className="text-grove-green">&gt;</span> Telemetry entries will appear here...</p>
            <p><span className="text-grove-green">&gt;</span> Each interaction generates a structured audit record</p>
            <p><span className="text-grove-green">&gt;</span> Click any entry to highlight the corresponding interaction</p>
            <p className="text-grove-green/30 mt-4">_</p>
          </div>
        ) : (
          <div className="space-y-1">
            {telemetry.map((entry) => {
              // Resolve model name from tier (modelConfig uses tier0/tier1/tier2/tier3 keys)
              const tierKey = `tier${entry.tier}` as 'tier0' | 'tier1' | 'tier2' | 'tier3'
              const executionModel = entry.tier === 0
                ? 'local_cache'
                : modelConfig[tierKey]?.model || 'unknown'
              const hash = generateProvenanceHash(entry.id, entry.intent, executionModel)

              return (
                <div
                  key={entry.id}
                  onClick={() => handleEntryClick(entry.id)}
                  className={`
                    telemetry-entry cursor-pointer
                    ${selectedTelemetryId === entry.id ? 'selected' : ''}
                  `}
                >
                  <span className="text-grove-green font-semibold">{entry.timestamp.slice(11, 19)}</span>
                  <span className="text-grove-text-dim"> │ </span>
                  <span className="text-grove-green/80 min-w-[80px]">{entry.intent}</span>
                  <span className="text-grove-text-dim"> │ </span>
                  <TierBadge tier={entry.tier} />
                  <span className="text-grove-text-dim"> │ </span>
                  <ZoneBadge zone={entry.zone} />
                  <span className="text-grove-text-dim"> │ </span>
                  <span className="text-grove-text-mid/70 min-w-[120px] truncate text-[10px]">{executionModel}</span>
                  <span className="text-grove-text-dim"> │ </span>
                  <span className="text-grove-text-mid">${entry.cost.toFixed(4)}</span>
                  <span className="text-grove-text-dim"> │ </span>
                  <span className="text-grove-amber/70 hover:text-grove-amber transition-colors">#{hash}</span>
                  {entry.skillMatch && (
                    <>
                      <span className="text-grove-text-dim"> │ </span>
                      <span className="text-tier-0">cached</span>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function TierBadge({ tier }: { tier: number }) {
  const colors: Record<number, string> = {
    0: 'text-tier-0',
    1: 'text-tier-1',
    2: 'text-tier-2',
    3: 'text-tier-3',
  }
  return <span className={colors[tier] || 'text-grove-text-dim'}>T{tier}</span>
}

function ZoneBadge({ zone }: { zone: string }) {
  const colors: Record<string, string> = {
    green: 'text-zone-green',
    yellow: 'text-zone-yellow',
    red: 'text-zone-red',
  }
  return <span className={colors[zone] || 'text-grove-text-dim'}>{zone}</span>
}
