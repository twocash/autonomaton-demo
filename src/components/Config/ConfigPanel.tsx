/**
 * ConfigPanel — The Hero Configuration View
 *
 * This proves Claim #3: Declarative configuration defines behavior.
 * Edit config → behavior changes → no code changes required.
 *
 * Five tabs:
 * 1. Watchlist — Subjects being monitored
 * 2. Sources — Signal sources (future)
 * 3. Voice — Output styling presets (THE DEMO MOMENT)
 * 4. Thresholds — Zone governance settings
 * 5. Routing — Intent routing rules
 *
 * Typography: Fragment Mono for all config content
 * Design: Strict geometry (no rounded)
 */

import { useState } from 'react'
import { useAppDispatch, useAppState } from '../../state/context'
import { VoicePresetSelector } from './VoicePresetSelector'
import { ConfigEditor } from './ConfigEditor'

type ConfigTab = 'watchlist' | 'sources' | 'voice' | 'thresholds' | 'routing'

interface ConfigPanelProps {
  subjects: Array<{
    id: string
    name: string
    type: string
    tier: string
    baselineScore: number
    keywords: string[]
  }>
  onRemoveSubject?: (id: string) => void
}

export function ConfigPanel({ subjects, onRemoveSubject }: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<ConfigTab>('voice')
  const dispatch = useAppDispatch()
  const { voicePreset, zonesSchema, configRipple } = useAppState()

  const handleVoiceChange = (preset: 'strategic' | 'executive' | 'operator') => {
    dispatch({ type: 'UPDATE_VOICE_PRESET', preset })
    dispatch({ type: 'TRIGGER_CONFIG_RIPPLE' })
    setTimeout(() => dispatch({ type: 'CLEAR_CONFIG_RIPPLE' }), 600)
  }

  return (
    <div className="h-full flex flex-col bg-grove-bg relative">
      {/* Config Ripple Animation */}
      {configRipple && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <div className="absolute inset-0 bg-grove-amber/10 animate-ripple" />
        </div>
      )}

      {/* Header */}
      <div className="border-b border-grove-border px-6 py-4 bg-grove-bg2">
        <h1 className="font-mono text-lg text-grove-text flex items-center gap-3">
          <span className="text-grove-amber">⚙</span>
          Configuration
        </h1>
        <p className="font-mono text-xs text-grove-text-dim mt-1">
          Edit config → next cycle reflects changes → zero code changes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-grove-border bg-grove-bg2 px-4">
        <TabButton
          label="Watchlist"
          active={activeTab === 'watchlist'}
          onClick={() => setActiveTab('watchlist')}
          badge={subjects.length > 0 ? subjects.length.toString() : undefined}
        />
        <TabButton
          label="Sources"
          active={activeTab === 'sources'}
          onClick={() => setActiveTab('sources')}
          disabled
        />
        <TabButton
          label="Voice"
          active={activeTab === 'voice'}
          onClick={() => setActiveTab('voice')}
          highlight
        />
        <TabButton
          label="Thresholds"
          active={activeTab === 'thresholds'}
          onClick={() => setActiveTab('thresholds')}
        />
        <TabButton
          label="Routing"
          active={activeTab === 'routing'}
          onClick={() => setActiveTab('routing')}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'watchlist' && (
          <WatchlistTab subjects={subjects} onRemove={onRemoveSubject} />
        )}
        {activeTab === 'sources' && (
          <SourcesTab />
        )}
        {activeTab === 'voice' && (
          <VoicePresetSelector
            currentPreset={voicePreset}
            onPresetChange={handleVoiceChange}
          />
        )}
        {activeTab === 'thresholds' && (
          <ThresholdsTab
            zonesSchema={zonesSchema}
            onNavigateToRouting={() => setActiveTab('routing')}
          />
        )}
        {activeTab === 'routing' && (
          <div className="p-4 h-full flex flex-col">
            <p className="font-mono text-xs text-grove-text-dim mb-4">
              Intent routing rules. Edit and apply to change tier routing.
            </p>
            <div className="flex-1 min-h-[500px]">
              <ConfigEditor />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// TAB BUTTON
// =============================================================================

interface TabButtonProps {
  label: string
  active: boolean
  onClick: () => void
  highlight?: boolean
  badge?: string
  disabled?: boolean
}

function TabButton({ label, active, onClick, highlight, badge, disabled }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-4 py-3 text-sm font-mono font-medium transition-colors
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${active
          ? 'text-grove-amber border-b-2 border-grove-amber'
          : highlight
            ? 'text-grove-amber/70 hover:text-grove-amber border-b-2 border-transparent'
            : 'text-grove-text-dim hover:text-grove-text border-b-2 border-transparent'
        }
      `}
    >
      {label}
      {badge && (
        <span className="ml-2 bg-grove-amber/20 text-grove-amber text-xs px-1.5 py-0.5">
          {badge}
        </span>
      )}
    </button>
  )
}

// =============================================================================
// WATCHLIST TAB
// =============================================================================

interface WatchlistTabProps {
  subjects: Array<{
    id: string
    name: string
    type: string
    tier: string
    baselineScore: number
    keywords: string[]
  }>
  onRemove?: (id: string) => void
}

function WatchlistTab({ subjects, onRemove }: WatchlistTabProps) {
  if (subjects.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4 opacity-30">◉</div>
        <p className="font-mono text-sm text-grove-text-dim">
          No subjects in watchlist yet.
        </p>
        <p className="font-mono text-xs text-grove-text-dim mt-2">
          Add subjects via the Inbox command bar.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      {subjects.map(subject => (
        <div
          key={subject.id}
          className="border border-grove-border p-4 bg-grove-bg2 hover:bg-grove-bg3 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-mono text-sm font-medium text-grove-text">
                {subject.name}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs font-mono text-grove-text-dim">
                <span>Type: {subject.type}</span>
                <span>•</span>
                <span>Tier: {subject.tier}</span>
                <span>•</span>
                <span>Score: {Math.round(subject.baselineScore * 100)}%</span>
              </div>
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(subject.id)}
                className="text-grove-text-dim hover:text-grove-red transition-colors"
                title="Remove subject"
              >
                ×
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {subject.keywords.slice(0, 5).map(kw => (
              <span
                key={kw}
                className="text-[10px] font-mono bg-grove-border px-1.5 py-0.5 text-grove-text-dim"
              >
                {kw}
              </span>
            ))}
            {subject.keywords.length > 5 && (
              <span className="text-[10px] font-mono text-grove-text-dim">
                +{subject.keywords.length - 5} more
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// SOURCES TAB (Placeholder)
// =============================================================================

function SourcesTab() {
  return (
    <div className="p-8 text-center">
      <div className="text-4xl mb-4 opacity-30">◈</div>
      <p className="font-mono text-sm text-grove-text-dim">
        Signal sources configuration.
      </p>
      <p className="font-mono text-xs text-grove-text-dim mt-2">
        Coming in a future update.
      </p>
    </div>
  )
}

// =============================================================================
// THRESHOLDS TAB
// =============================================================================

interface ThresholdsTabProps {
  zonesSchema: {
    zones: Record<string, {
      meaning: string
      description: string
      flywheel_eligible: boolean
    }>
  }
  onNavigateToRouting?: () => void
}

function ThresholdsTab({ zonesSchema, onNavigateToRouting }: ThresholdsTabProps) {
  return (
    <div className="p-6 space-y-6">
      <p className="font-mono text-xs text-grove-text-dim">
        Zone governance thresholds. These control when actions require human approval.
      </p>

      {/* GREEN Zone */}
      <div className="border border-zone-green/30 p-4 bg-grove-bg2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-zone-green">●</span>
          <h3 className="font-mono text-sm font-medium text-zone-green">GREEN Zone</h3>
          <span className="text-xs font-mono text-grove-text-dim">— Auto-Execute</span>
        </div>
        <p className="font-mono text-xs text-grove-text-dim mb-3">
          {zonesSchema.zones.green?.description || 'Routine operations that execute autonomously.'}
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-grove-text-dim block mb-1">Max Score Delta</label>
            <div className="bg-grove-bg border border-grove-border px-3 py-2 text-grove-text">
              5% (0.05)
            </div>
          </div>
          <div>
            <label className="text-grove-text-dim block mb-1">Flywheel</label>
            <div className="bg-grove-bg border border-grove-border px-3 py-2 text-zone-green">
              ENABLED
            </div>
          </div>
        </div>
      </div>

      {/* YELLOW Zone */}
      <div className="border border-zone-yellow/30 p-4 bg-grove-bg2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-zone-yellow">●</span>
          <h3 className="font-mono text-sm font-medium text-zone-yellow">YELLOW Zone</h3>
          <span className="text-xs font-mono text-grove-text-dim">— Human Approval</span>
        </div>
        <p className="font-mono text-xs text-grove-text-dim mb-3">
          {zonesSchema.zones.yellow?.description || 'Significant actions requiring human approval.'}
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-grove-text-dim block mb-1">Score Delta Range</label>
            <div className="bg-grove-bg border border-grove-border px-3 py-2 text-grove-text">
              5% – 15%
            </div>
          </div>
          <div>
            <label className="text-grove-text-dim block mb-1">Flywheel</label>
            <div className="bg-grove-bg border border-grove-border px-3 py-2 text-zone-yellow">
              ENABLED
            </div>
          </div>
        </div>
      </div>

      {/* RED Zone */}
      <div className="border border-zone-red/30 p-4 bg-grove-bg2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-zone-red">●</span>
          <h3 className="font-mono text-sm font-medium text-zone-red">RED Zone</h3>
          <span className="text-xs font-mono text-grove-text-dim">— Human Decision Only</span>
        </div>
        <p className="font-mono text-xs text-grove-text-dim mb-3">
          {zonesSchema.zones.red?.description || 'Critical decisions requiring human judgment.'}
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-grove-text-dim block mb-1">Trigger</label>
            <div className="bg-grove-bg border border-grove-border px-3 py-2 text-grove-text">
              ≥15% delta, tier crossing
            </div>
          </div>
          <div>
            <label className="text-grove-text-dim block mb-1">Flywheel</label>
            <div className="bg-grove-bg border border-grove-border px-3 py-2 text-zone-red">
              DISABLED
            </div>
          </div>
        </div>
      </div>

      <p className="font-mono text-[10px] text-grove-text-dim text-center">
        Zone thresholds are derived from zones.schema.ts in{' '}
        <button
          onClick={onNavigateToRouting}
          className="text-grove-amber hover:text-grove-amber-bright underline"
        >
          Routing
        </button>
      </p>
    </div>
  )
}
