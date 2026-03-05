/**
 * FoundryPane — The Sovereign Manifesto Engine (v0.9.2)
 *
 * Live-streaming Tier 3 PRD compiler with exportable HTML manifesto.
 *
 * Features:
 * - Mode selector (Scaffold active, Refactor v2.0 teaser)
 * - Auto-scroll follows streaming output
 * - Terminal aesthetic for PRD display
 * - Sovereign Manifesto HTML export (business case + regulatory + PRD)
 */

import { useState, useRef, useEffect } from 'react'
import { useAppState, useAppDispatch } from '../../state/context'
import { compileArchitecture } from '../../services/foundry-compiler'
import { generateBlueprintHTML, downloadBlueprint } from '../../utils/blueprint-generator'
import { getPipelineSignature } from '../../config/prompts.schema'
import { getRandomHeroPrompt } from '../../config/hero-prompts'

export function FoundryPane() {
  const [appName, setAppName] = useState('')
  const { foundry, modelConfig } = useAppState()
  const dispatch = useAppDispatch()

  // Auto-scroll ref
  const streamEndRef = useRef<HTMLDivElement>(null)
  // Textarea ref for auto-focus after hero prompt injection
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll when PRD updates or compilation completes
  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [foundry.generatedPRD, foundry.isCompiling])

  // Inject a random hero prompt and focus the textarea
  const injectRandomHeroPrompt = () => {
    const hero = getRandomHeroPrompt()
    dispatch({ type: 'SET_FOUNDRY_INPUT', input: hero.prompt })
    // Focus textarea after state update
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const handleCompile = async () => {
    if (!foundry.input.trim() || foundry.isCompiling) return

    // Extract app name from first line or use generic
    const name = appName.trim() || extractAppName(foundry.input) || 'Untitled App'
    setAppName(name)

    await compileArchitecture(
      foundry.input,
      modelConfig.tier3,
      dispatch
    )
  }

  const handleDownload = () => {
    const signature = getPipelineSignature()
    const html = generateBlueprintHTML(
      appName,
      foundry.generatedPRD,
      modelConfig.tier3.model,  // v0.9.3: Model name for provenance
      signature                  // v0.9.3: Pipeline hash for provenance
    )
    downloadBlueprint(appName, html)
  }

  const hasValidTier3 = modelConfig.tier3.apiKey?.trim()
  const isComplete = !foundry.isCompiling && foundry.generatedPRD.length > 0

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full space-y-6">

        {/* Header */}
        <div className="border-b border-grove-border pb-6">
          <div className="font-mono text-xs text-grove-amber tracking-[0.2em] uppercase mb-4">
            Architectural Compiler
          </div>
          <h2 className="font-serif text-3xl text-grove-text mb-3">
            The Architect's Foundry
          </h2>
          <p className="font-mono text-sm text-grove-text-dim leading-relaxed">
            Describe the software you want to build. The Foundry will use your
            <span className="text-grove-text font-bold"> Tier 3 API Key </span>
            to compile a zone-classified, declarative PRD mapped to the Autonomaton pattern.
          </p>
        </div>

        {/* Input Area */}
        {!isComplete && (
          <div className="space-y-4">
            {/* UI Teaser: Mode Selector + Hero Prompt Loader */}
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-4">
                <span className="text-grove-amber">
                  [◉] Scaffold New Project
                </span>
                <span className="text-grove-text-dim flex items-center gap-1">
                  [○] Refactor Codebase
                  <span className="text-[9px] border border-grove-border px-1 py-0.5 text-grove-text-dim">
                    v2.0
                  </span>
                </span>
              </div>
              <button
                onClick={injectRandomHeroPrompt}
                disabled={foundry.isCompiling}
                className="text-[10px] text-grove-amber border border-grove-amber/30 px-2 py-1 rounded-sm hover:bg-grove-amber/10 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span className="text-sm">🎲</span> Load Architectural Prompt
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={foundry.input}
              onChange={(e) => dispatch({ type: 'SET_FOUNDRY_INPUT', input: e.target.value })}
              placeholder="e.g., A local agent that reads my Notion inbox, categorizes tasks by urgency, and autonomously drafts status reports..."
              disabled={foundry.isCompiling}
              className="w-full h-40 bg-grove-bg border border-grove-border p-4 font-mono text-sm text-grove-text placeholder:text-grove-text-dim focus:border-grove-amber focus:outline-none resize-none disabled:opacity-50"
            />
            <div className="flex justify-between items-center">
              <div className="font-mono text-[10px] text-grove-text-dim uppercase">
                {hasValidTier3 ? '✓ Tier 3 configured' : 'Requires valid models.config'}
              </div>
              <button
                onClick={handleCompile}
                disabled={foundry.isCompiling || !foundry.input.trim() || !hasValidTier3}
                className="bg-grove-amber text-grove-bg font-mono text-xs uppercase px-6 py-3 hover:bg-grove-amber-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {foundry.isCompiling ? 'Compiling...' : 'Compile Architecture →'}
              </button>
            </div>
          </div>
        )}

        {/* Streaming Output (with auto-scroll) */}
        {(foundry.isCompiling || foundry.generatedPRD) && (
          <div className="border border-grove-border bg-grove-bg">
            <div className="border-b border-grove-border px-4 py-2 flex items-center gap-2">
              {foundry.isCompiling && (
                <span className="w-2 h-2 bg-grove-amber animate-pulse" />
              )}
              <span className="font-mono text-xs text-grove-text-dim uppercase">
                {foundry.isCompiling ? 'Streaming Architecture...' : 'Architecture Compiled'}
              </span>
            </div>
            <div className="p-4 font-mono text-sm text-grove-text whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
              {foundry.generatedPRD}
              {foundry.isCompiling && <span className="animate-pulse">▌</span>}
            </div>
          </div>
        )}

        {/* Error Display */}
        {foundry.error && (
          <div className="border border-red-500 bg-red-500/10 p-4">
            <div className="font-mono text-xs text-red-500 uppercase mb-2">Compilation Failed</div>
            <div className="font-mono text-sm text-grove-text">{foundry.error}</div>
            <button
              onClick={() => dispatch({ type: 'CLEAR_FOUNDRY' })}
              className="mt-4 border border-grove-border hover:border-grove-text text-grove-text-dim hover:text-grove-text font-mono text-xs uppercase px-4 py-2 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Export CTA */}
        {isComplete && (
          <div className="mt-8 p-6 border border-grove-amber bg-grove-amber/5 text-center">
            <h3 className="font-serif text-2xl text-grove-amber mb-2">Sovereign Manifesto Ready</h3>
            <p className="font-mono text-xs text-grove-text-dim mb-6 max-w-lg mx-auto leading-relaxed">
              Distribute this HTML file to your engineering team, legal reviewers, and drop it
              directly into Cursor or Claude Code. It serves as your business case, regulatory
              shield, and strict agentic coding instructions.
            </p>
            <button
              onClick={handleDownload}
              className="bg-grove-amber hover:bg-grove-amber-bright text-grove-bg font-mono text-sm uppercase tracking-widest px-8 py-4 transition-colors w-full"
            >
              Download Sovereign Manifesto (.html)
            </button>
            <button
              onClick={() => dispatch({ type: 'CLEAR_FOUNDRY' })}
              className="mt-4 text-grove-text-dim hover:text-grove-text font-mono text-xs uppercase transition-colors"
            >
              Compile Another
            </button>
          </div>
        )}

        {/* Auto-scroll anchor — must be after CTA to scroll to download button */}
        <div ref={streamEndRef} />
      </div>
    </div>
  )
}

// =============================================================================
// HELPERS
// =============================================================================

function extractAppName(input: string): string {
  // Extract app name from common patterns
  const patterns = [
    /(?:build|create|make)\s+(?:a|an)\s+(.+?)(?:\s+that|\s+which|\.)/i,
    /^(.+?)\s+(?:app|application|tool|system)/i,
  ]
  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) return match[1].trim()
  }
  return ''
}
