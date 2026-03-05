/**
 * InteractionPane — User input and interaction history
 *
 * This is where users type requests and see responses.
 * Each interaction shows: tier, zone, cost, and the system response.
 *
 * v0.3 Additions:
 * - Pattern tracking badge ("👀 Observed N/3")
 * - Run Again button on completed interactions
 * - Persistent Prompt Tray above input
 *
 * v0.4 Design:
 * - Strict geometry (no rounded)
 * - Grove color palette
 * - Amber active states
 *
 * v0.4.1 Additions:
 * - Andon dropdown in PromptTray (moved from Header)
 * - DiagnosticCard renders inline when interaction.status === 'halted'
 */

import { useState, useRef, useEffect } from 'react'
import { useApp, useTutorial, usePendingApproval, usePipeline, useSkillProposal } from '../../state/context'
import { processInteraction, continueAfterApproval, rejectInteraction } from '../../services'
import { DiagnosticCard } from '../Diagnostic/DiagnosticCard'
import { SkillProposalCard } from '../Skills'
import type { Interaction, FailureType } from '../../state/types'

// Preset prompts for the tray
const PRESETS = [
  {
    label: 'Capture thought',
    input: 'capture my idea about project architecture',
    zone: 'green' as const,
    tier: 1,
    intent: 'capture_idea',
  },
  {
    label: 'Research topic',
    input: 'research best practices for API design',
    zone: 'yellow' as const,
    tier: 2,
    intent: 'research_topic',
  },
  {
    label: 'Draft email',
    input: 'draft an email to the team about the project',
    zone: 'yellow' as const,
    tier: 2,
    intent: 'draft_email',
  },
  {
    label: 'Delete data',
    input: 'delete all user data',
    zone: 'red' as const,
    tier: 3,
    intent: 'delete_data',
  },
]

export function InteractionPane() {
  const [input, setInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const { state, dispatch } = useApp()
  const tutorial = useTutorial()
  const pendingApproval = usePendingApproval()
  const pipeline = usePipeline()
  const skillProposal = useSkillProposal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || processing) return

    setProcessing(true)
    setInput('')

    try {
      await processInteraction(input, state, dispatch)
    } finally {
      setProcessing(false)
    }
  }

  const handleApprove = async () => {
    if (!pendingApproval) return
    setProcessing(true)
    try {
      await continueAfterApproval(pendingApproval, state, dispatch)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = () => {
    rejectInteraction(dispatch)
  }

  const handlePreset = async (presetInput: string) => {
    if (processing) return
    // v0.9.4: Removed auto-wake from presets — let demo mode run simulated flow
    // Auto-wake only triggers when user types in the input field
    setProcessing(true)
    try {
      await processInteraction(presetInput, state, dispatch)
    } finally {
      setProcessing(false)
    }
  }

  const handleRunAgain = async (interaction: Interaction) => {
    if (processing) return
    await handlePreset(interaction.input)
  }

  // Check if an intent has an approved skill
  const hasSkill = (intent: string) =>
    state.skills.some((s) => s.intentMatch === intent)

  // Auto-scroll to bottom when new interactions or approval card appears
  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.interactions, pendingApproval])

  return (
    <div className="flex-1 border-r border-grove-border bg-grove-bg2 flex flex-col min-h-0">
      {/* Interaction List */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin min-h-0">
        {state.interactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl font-serif text-grove-text mb-2">Welcome to the Pattern Playground</p>
            <p className="text-sm text-grove-text-dim mb-8">
              {tutorial.active
                ? 'Follow the tutorial to experience the Autonomaton pattern.'
                : 'Click any button to see the pattern in action.'}
            </p>
            {/* Empty state preset buttons (larger format) */}
            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <button
                onClick={() => handlePreset('capture my idea about project architecture')}
                disabled={processing}
                className="flex items-center gap-3 px-4 py-3 bg-grove-bg3 hover:bg-grove-border border border-zone-green/30 hover:border-zone-green text-left transition-all group disabled:opacity-50"
              >
                <span className="w-3 h-3 bg-zone-green shadow-[0_0_8px_var(--zone-green)]" />
                <div className="flex-1">
                  <div className="text-grove-text font-medium text-sm group-hover:text-zone-green transition-colors">Capture a quick thought</div>
                  <div className="text-xs text-grove-text-dim">Watch an autonomous execution (Green Zone)</div>
                </div>
                <span className="text-grove-text-dim text-xs font-mono">T1</span>
              </button>
              <button
                onClick={() => handlePreset('research best practices for API design')}
                disabled={processing}
                className="flex items-center gap-3 px-4 py-3 bg-grove-bg3 hover:bg-grove-border border border-zone-yellow/30 hover:border-zone-yellow text-left transition-all group disabled:opacity-50"
              >
                <span className="w-3 h-3 bg-zone-yellow shadow-[0_0_8px_var(--zone-yellow)]" />
                <div className="flex-1">
                  <div className="text-grove-text font-medium text-sm group-hover:text-zone-yellow transition-colors">Deep dive on API design</div>
                  <div className="text-xs text-grove-text-dim">Trigger a human approval gate (Yellow Zone)</div>
                </div>
                <span className="text-grove-text-dim text-xs font-mono">T2</span>
              </button>
              <button
                onClick={() => handlePreset('delete all user data')}
                disabled={processing}
                className="flex items-center gap-3 px-4 py-3 bg-grove-bg3 hover:bg-grove-border border border-zone-red/30 hover:border-zone-red text-left transition-all group disabled:opacity-50"
              >
                <span className="w-3 h-3 bg-zone-red shadow-[0_0_8px_var(--zone-red)]" />
                <div className="flex-1">
                  <div className="text-grove-text font-medium text-sm group-hover:text-zone-red transition-colors">Delete all user data</div>
                  <div className="text-xs text-grove-text-dim">Hit an architectural hard-block (Red Zone)</div>
                </div>
                <span className="text-grove-text-dim text-xs font-mono">T3</span>
              </button>
            </div>

            {/* Foundry Cross-Link (v0.8.0, v0.9.5: centered) */}
            <div className="mt-8 pt-6 border-t border-grove-border w-full max-w-md mx-auto text-center">
              <p className="font-mono text-xs text-grove-text-dim mb-3">
                Already understand the pattern?
              </p>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', view: 'foundry' })}
                className="text-grove-amber hover:text-grove-amber-bright font-mono text-xs uppercase tracking-widest transition-colors"
              >
                Enter The Foundry →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {state.interactions.map((interaction) => (
              <InteractionCard
                key={interaction.id}
                interaction={interaction}
                isSelected={state.selectedInteractionId === interaction.id}
                hasSkill={hasSkill(interaction.intent)}
                onRunAgain={() => handleRunAgain(interaction)}
                processing={processing}
                haltReason={interaction.status === 'halted' ? pipeline.haltReason : null}
                onReset={() => dispatch({ type: 'RESET_PIPELINE' })}
              />
            ))}
            {/* Scroll anchor with breathing room */}
            <div ref={messagesEndRef} className="h-4 flex-shrink-0" />
          </div>
        )}

        {/* Pending Approval Card — Immediate Constraint (v0.8.1: reordered) */}
        {pendingApproval && (
          <div className="mt-4 bg-zone-yellow/10 border-l-4 border-grove-yellow p-3">
            <div className="text-zone-yellow font-medium mb-2 uppercase tracking-wider text-sm">
              Approval Required
            </div>
            <p className="text-sm text-grove-text-mid mb-2">
              This action is in the <strong>YELLOW ZONE</strong> — it requires your approval before proceeding.
            </p>
            <div className="text-xs text-grove-text-dim mb-4 bg-grove-bg/50 p-2 font-mono">
              <strong>Intent:</strong> {pendingApproval.intent}<br />
              <strong>Tier:</strong> {pendingApproval.tier}<br />
              <strong>Estimated cost:</strong> ${pendingApproval.cost.toFixed(4)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={processing}
                className="bg-grove-green hover:bg-grove-green/80 disabled:opacity-50 text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                {processing ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="bg-grove-border hover:bg-grove-border-light disabled:opacity-50 text-grove-text px-4 py-2 text-sm font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Skill Flywheel Proposal — Meta-action closest to input (v0.8.1: moved here) */}
        {skillProposal.active && skillProposal.intent && state.interactions.length > 0 && (
          <SkillProposalCard
            intent={skillProposal.intent}
            pattern={skillProposal.pattern}
            count={skillProposal.count}
            onApprove={() => dispatch({ type: 'APPROVE_SKILL' })}
            onReject={() => dispatch({ type: 'REJECT_SKILL' })}
          />
        )}
      </div>

      {/* Prompt Tray — Always visible above input */}
      {state.interactions.length > 0 && (
        <PromptTray
          presets={PRESETS}
          skills={state.skills}
          onSelect={handlePreset}
          disabled={processing || !!pendingApproval}
          simulateFailure={state.simulateFailure}
          onFailureChange={(failureType) => dispatch({ type: 'SET_FAILURE_SIMULATION', failureType })}
        />
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-grove-border p-4">
        {/* v0.9.9: Live Mode Warning — directly above textarea */}
        {state.mode === 'interactive' && (
          <div className="font-mono text-[9px] text-grove-amber uppercase mb-2">
            <span className="animate-pulse">⚡</span> LIVE MODE: API keys required for T2/T3
          </div>
        )}
        <div
          className="flex gap-2"
          onClick={() => {
            // v0.9.9: Sandbox breach — dispatch telemetry wake-up call when leaving demo mode
            if (state.mode === 'demo') {
              dispatch({ type: 'SET_MODE', mode: 'interactive' })
              // Dispatch telemetry entry for sandbox breach event
              dispatch({
                type: 'ADD_TELEMETRY',
                entry: {
                  id: `system-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  intent: 'system_alert',
                  tier: 0,
                  zone: 'green',
                  confidence: 1,
                  cost: 0,
                  mode: 'interactive',
                  latencyMs: 0,
                  humanFeedback: null,
                  skillMatch: null,
                  message: 'Sandbox breach: Live Mode activated',
                },
              })
            }
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={() => {
              // v0.9.9: Sandbox breach on keypress (same as onClick)
              if (state.mode === 'demo') {
                dispatch({ type: 'SET_MODE', mode: 'interactive' })
                dispatch({
                  type: 'ADD_TELEMETRY',
                  entry: {
                    id: `system-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    intent: 'system_alert',
                    tier: 0,
                    zone: 'green',
                    confidence: 1,
                    cost: 0,
                    mode: 'interactive',
                    latencyMs: 0,
                    humanFeedback: null,
                    skillMatch: null,
                    message: 'Sandbox breach: Live Mode activated',
                  },
                })
              }
            }}
            placeholder={processing ? 'Processing...' : 'Type your request...'}
            disabled={processing || !!pendingApproval}
            className="flex-1 bg-grove-bg border border-grove-border px-4 py-2 text-grove-text placeholder-grove-text-dim focus:outline-none focus:border-grove-amber disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={processing || !!pendingApproval || !input.trim()}
            className="bg-grove-amber hover:bg-grove-amber-bright disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 font-medium transition-colors"
          >
            {processing ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}

// =============================================================================
// INTERACTION CARD
// =============================================================================

interface InteractionCardProps {
  interaction: Interaction
  isSelected: boolean
  hasSkill: boolean
  onRunAgain: () => void
  processing: boolean
  haltReason: import('../../state/types').HaltReason | null
  onReset: () => void
}

function InteractionCard({
  interaction,
  isSelected,
  hasSkill,
  onRunAgain,
  processing,
  haltReason,
  onReset,
}: InteractionCardProps) {
  return (
    <div
      className={`
        relative bg-grove-bg3 p-4 border-l-4 transition-all group
        ${interaction.zone === 'green' ? 'border-zone-green' : ''}
        ${interaction.zone === 'yellow' ? 'border-zone-yellow' : ''}
        ${interaction.zone === 'red' ? 'border-zone-red' : ''}
        ${interaction.status === 'pending' ? 'opacity-70' : ''}
        ${interaction.status === 'halted' ? 'border-grove-red' : ''}
        ${isSelected ? 'ring-2 ring-grove-amber' : ''}
      `}
    >
      {/* Run Again Button */}
      {interaction.status === 'completed' && (
        <button
          onClick={onRunAgain}
          disabled={processing}
          title="Run again"
          className="absolute top-3 right-3 px-2 py-1 text-grove-text-dim hover:text-grove-text hover:bg-grove-border transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 font-mono text-xs"
        >
          Run
        </button>
      )}

      {/* User Input */}
      <div className="text-sm text-grove-text-dim mb-2 flex items-center gap-2">
        <span className="text-grove-text-dim">›</span>
        {interaction.input}
      </div>

      {/* Metadata Badges */}
      <div className="flex items-center gap-3 text-xs mb-3 flex-wrap font-mono">
        <span className={`tier-${interaction.tier} px-2 py-0.5 border`}>
          T{interaction.tier}: {interaction.tier === 0 ? 'Cached' : interaction.tier === 1 ? 'Cheap' : interaction.tier === 2 ? 'Premium' : 'Apex'}
        </span>
        <span className={`zone-${interaction.zone} px-2 py-0.5 border capitalize`}>
          {interaction.zone}
        </span>
        <span className="text-grove-text-dim">
          ${interaction.cost.toFixed(4)}
        </span>
        {interaction.skillMatch && (
          <span className="text-tier-0 px-2 py-0.5 border border-tier-0">
            Skill
          </span>
        )}
        {interaction.sovereignty === 'local' && (
          <span className="text-grove-green text-xs px-2 py-0.5 border border-grove-green/30">Local</span>
        )}

        {/* Pattern Tracking Badge */}
        <PatternBadge interaction={interaction} hasSkill={hasSkill} />
      </div>

      {/* Response */}
      {interaction.response && (
        <div className="text-sm text-grove-text-mid whitespace-pre-wrap bg-grove-bg/50 p-3">
          {interaction.response}
        </div>
      )}

      {/* Status indicator */}
      {interaction.status === 'pending' && (
        <div className="text-xs text-grove-text-dim mt-2 flex items-center gap-2">
          <span className="animate-pulse">●</span>
          Processing...
        </div>
      )}
      {interaction.status === 'executing' && (
        <div className="mt-4 p-4 border border-grove-border bg-grove-bg2">
          <div className="flex items-center gap-3 font-mono text-xs text-grove-amber">
            <div className="w-2 h-2 bg-grove-amber animate-pulse" />
            <span className="uppercase tracking-widest">
              Awaiting Tier {interaction.tier} Cognition...
            </span>
          </div>
          <div className="font-mono text-[10px] text-grove-text-dim mt-1">
            Provider: {interaction.mode === 'interactive' ? 'LIVE API CALL' : 'DEMO'}
          </div>
        </div>
      )}
      {interaction.status === 'rejected' && (
        <div className="text-xs text-grove-red mt-2">
          ✗ Rejected by user
        </div>
      )}

      {/* Inline Diagnostic Card (Digital Jidoka) */}
      {interaction.status === 'halted' && haltReason && (
        <DiagnosticCard reason={haltReason} onReset={onReset} />
      )}
    </div>
  )
}

// =============================================================================
// PATTERN BADGE
// =============================================================================

interface PatternBadgeProps {
  interaction: Interaction
  hasSkill: boolean
}

function PatternBadge({ interaction, hasSkill }: PatternBadgeProps) {
  const count = interaction.patternCountAtCreation

  // If this intent now has a skill, show "Cached Skill"
  if (hasSkill && !interaction.skillMatch) {
    return (
      <span className="text-tier-0 px-2 py-0.5 border border-tier-0 animate-pulse">
        Cached Skill
      </span>
    )
  }

  // If there's no pattern count, or it's a skill match, don't show anything
  if (!count || interaction.skillMatch) return null

  // Show the observation count
  if (count >= 3) {
    return (
      <span className="text-grove-amber px-2 py-0.5 border border-grove-amber/50 animate-pulse">
        Skill Proposed
      </span>
    )
  }

  return (
    <span className="text-grove-text-dim px-2 py-0.5 border border-grove-border">
      Observed {count}/3
    </span>
  )
}

// =============================================================================
// PROMPT TRAY
// =============================================================================

interface PromptTrayProps {
  presets: typeof PRESETS
  skills: { intentMatch: string }[]
  onSelect: (input: string) => void
  disabled: boolean
  simulateFailure: FailureType
  onFailureChange: (failureType: FailureType) => void
}

function PromptTray({ presets, skills, onSelect, disabled, simulateFailure, onFailureChange }: PromptTrayProps) {
  const hasSkill = (intent: string) =>
    skills.some((s) => s.intentMatch === intent)

  return (
    <div className="border-t border-grove-border/50 px-4 py-2 bg-grove-bg/50 mb-4">
      <div className="flex items-start justify-between gap-4">
        {/* LEFT COLUMN: Label + Buttons + Hint (grouped) */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Row: Label + Scrollable Buttons */}
          <div className="flex items-center gap-3">
            <div className="font-mono text-[10px] text-grove-text-dim uppercase tracking-widest border-r border-grove-border pr-3 flex-shrink-0">
              Simulate Intent
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 flex-1">
              {presets.map((preset) => {
                const skilled = hasSkill(preset.intent)
                return (
                  <button
                    key={preset.intent}
                    onClick={() => onSelect(preset.input)}
                    disabled={disabled}
                    className={`
                      flex items-center gap-1.5 px-2 py-1 text-xs font-mono whitespace-nowrap
                      transition-all disabled:opacity-50
                      ${skilled
                        ? 'bg-tier-0/10 border border-tier-0/50 text-tier-0 hover:bg-tier-0/20'
                        : `bg-grove-bg border border-zone-${preset.zone}/30 text-grove-text-mid hover:border-zone-${preset.zone} hover:text-grove-text`
                      }
                    `}
                  >
                    <span
                      className={`w-1.5 h-1.5 ${
                        skilled
                          ? 'bg-tier-0'
                          : `bg-zone-${preset.zone}`
                      }`}
                    />
                    {preset.label}
                    <span className="text-grove-text-dim">
                      {skilled ? 'T0' : `T${preset.tier}`}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
          {/* Flywheel Hint — LEFT-aligned under buttons */}
          <div className="text-left mt-1">
            <span className="font-mono text-[9px] text-grove-amber/70 italic">
              Hint: Execute the same intent 3 times to trigger the Skill Flywheel.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Jidoka Dropdown (isolated) */}
        <select
          value={simulateFailure}
          onChange={(e) => onFailureChange(e.target.value as FailureType)}
          className={`
            font-mono text-xs px-2 py-1 border flex-shrink-0
            ${simulateFailure !== 'none'
              ? 'bg-grove-red/20 border-grove-red text-grove-red'
              : 'bg-grove-bg border-grove-border text-grove-text-dim'
            }
          `}
        >
          <option value="none">Jidoka: Normal</option>
          <option value="api_timeout">Jidoka: API Timeout</option>
          <option value="low_confidence">Jidoka: Low Confidence</option>
          <option value="hallucination_detected">Jidoka: Hallucination</option>
        </select>
      </div>
    </div>
  )
}
