/**
 * Signal Watch — Competitive Research Autonomaton
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Header (Logo, API Key)                                      │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Pipeline Visualization                                      │
 * ├────────────────┬──────────────────────────┬─────────────────┤
 * │ Signal Feed    │ Briefing Inbox (2/3)     │ Watchlist (1/3) │
 * │ (collapsible)  │                          │                 │
 * ├────────────────┴──────────────────────────┴─────────────────┤
 * │ Command Bar (ad-hoc scans)                                  │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Telemetry Stream (provenance)                               │
 * └─────────────────────────────────────────────────────────────┘
 */

import { useState, useEffect } from 'react'
import { PipelineVisualization } from './components/Pipeline'
import { TelemetryStream } from './components/Telemetry'
import { Header } from './components/Header'
import { BriefingInbox, BriefingDetailPane } from './components/Briefing'
import { SignalFeed } from './components/SignalFeed'
import { WatchlistDashboard, SubjectDetailPane } from './components/Watchlist'
import { CommandBar } from './components/CommandBar'
import { NavBar } from './components/Navigation'
import { DashboardView } from './components/Dashboard'
import { ConfigPanel } from './components/Config'
import { FlywheelView } from './components/Flywheel'
import { CostEvaporation } from './components/CostEvaporation'
import { DiagnosticCard } from './components/Diagnostic/DiagnosticCard'
import { useAppDispatch, useAppState, usePipeline } from './state/context'
import type { CurrentView } from './state/types'
import { executeCognitiveRequest, executeResearchRequest, type ResearchResult } from './services/CognitiveAdapter'
import { shouldProposeSkill, generatePatternDescription, getAdjustmentPatternKey, getBriefMeOnPatternKey } from './services'
import { defaultScanTemplate, serializeScanPrompt, parseScanResponse, hashScanConfig } from './config/prompts/scan.template'
import { defaultSubjectTemplate, serializeSubjectPrompt, parseSubjectResponse, hashSubjectConfig } from './config/prompts/subject.template'
import { defaultDomainTemplate, serializeDomainPrompt, parseDomainResponse, hashDomainConfig } from './config/prompts/domain.template'
import { extractSubjectEntity, HAIKU_EXTRACTION_COST } from './services/entity-extractor'
import type { Briefing, WatchlistSubject, TelemetryEntry, ScoreHistoryEntry, ScoreAdjustment, ProposedSubject, DomainConfig, ResearchSection } from './state/types'

const API_KEY_STORAGE_KEY = 'signal_watch_api_key'
const BRIEFINGS_STORAGE_KEY = 'signal_watch_briefings'
const SUBJECTS_STORAGE_KEY = 'signal_watch_subjects'
const TRAINING_COMPLETE_KEY = 'signal_watch_training_complete'
const DOMAIN_CONFIG_KEY = 'signal_watch_domain_config'

const APP_VERSION = '0.2.0'
declare const __COMMIT_HASH__: string

// Load from localStorage — start empty for training mode
function loadBriefings(): Briefing[] {
  try {
    const stored = localStorage.getItem(BRIEFINGS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function loadSubjects(): WatchlistSubject[] {
  try {
    const stored = localStorage.getItem(SUBJECTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function loadTrainingComplete(): boolean {
  return localStorage.getItem(TRAINING_COMPLETE_KEY) === 'true'
}

function loadDomainConfig(): DomainConfig | null {
  try {
    const stored = localStorage.getItem(DOMAIN_CONFIG_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function App() {
  const dispatch = useAppDispatch()
  const appState = useAppState()  // For flywheel pattern tracking
  const pipeline = usePipeline()  // For Andon gate DiagnosticCard

  // Local state for briefings and watchlist (persisted to localStorage)
  const [briefings, setBriefings] = useState<Briefing[]>(loadBriefings)
  const [subjects, setSubjects] = useState<WatchlistSubject[]>(loadSubjects)

  const [isSignalPanelOpen, setIsSignalPanelOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [trainingComplete, setTrainingComplete] = useState(loadTrainingComplete)
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(loadDomainConfig)
  const [domainSetupPhase, setDomainSetupPhase] = useState<'industry' | 'tracking' | 'awaiting_approval' | null>(null)
  const [pendingIndustry, setPendingIndustry] = useState<string | null>(null)
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<WatchlistSubject | null>(null)

  // Cost evaporation notification state
  const [costEvaporation, setCostEvaporation] = useState<{
    savings: number
    skillName: string
  } | null>(null)
  const [prevSkillCount, setPrevSkillCount] = useState(appState.skills.length)

  // Detect when a new skill is added (the "ratchet" moment)
  useEffect(() => {
    if (appState.skills.length > prevSkillCount) {
      // A new skill was just approved
      const newSkill = appState.skills[appState.skills.length - 1]
      if (newSkill) {
        // Calculate estimated future savings per use
        const estimatedSavings = 0.01 // Tier 2 cost that will be saved
        setCostEvaporation({
          savings: estimatedSavings,
          skillName: newSkill.intentMatch,
        })
      }
    }
    setPrevSkillCount(appState.skills.length)
  }, [appState.skills.length, prevSkillCount])

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(BRIEFINGS_STORAGE_KEY, JSON.stringify(briefings))
  }, [briefings])

  useEffect(() => {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects))
  }, [subjects])

  // Persist domain config
  useEffect(() => {
    if (domainConfig) {
      localStorage.setItem(DOMAIN_CONFIG_KEY, JSON.stringify(domainConfig))
    }
  }, [domainConfig])

  // Initialize domain setup phase on mount
  // Skip if subjects already exist (data recovery case)
  useEffect(() => {
    if (!domainConfig && domainSetupPhase === null && subjects.length === 0) {
      setDomainSetupPhase('industry')
    }
  }, [domainConfig, domainSetupPhase, subjects.length])

  // Add telemetry entry
  const addTelemetry = (entry: Omit<TelemetryEntry, 'id' | 'timestamp'>) => {
    dispatch({
      type: 'ADD_TELEMETRY',
      entry: {
        id: `tel-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...entry,
      },
    })
  }

  // Animate pipeline stages — returns function to complete execution when LLM returns
  const animatePipeline = async (): Promise<() => void> => {
    const preExecution: Array<'telemetry' | 'recognition' | 'compilation' | 'approval'> = [
      'telemetry', 'recognition', 'compilation', 'approval'
    ]
    // Quick animation through pre-execution stages
    for (const stage of preExecution) {
      dispatch({ type: 'SET_PIPELINE_STAGE', stage, state: 'active' })
      await sleep(200)
      dispatch({ type: 'SET_PIPELINE_STAGE', stage, state: 'complete' })
    }
    // Set execution to ACTIVE — stays glowing until LLM returns
    dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'execution', state: 'active' })

    // Return function to complete pipeline when LLM responds
    return () => {
      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'execution', state: 'complete' })
      setTimeout(() => dispatch({ type: 'RESET_PIPELINE' }), 500)
    }
  }

  // Handle ad-hoc scan
  const handleScan = async (query: string) => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY)

    if (!apiKey) {
      addTelemetry({
        intent: 'ad_hoc_scan',
        tier: 0,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs: 0,
        humanFeedback: null,
        skillMatch: null,
        message: `Scan failed: No API key configured. Click "Configure" in header.`,
      })
      return
    }

    setIsProcessing(true)
    const startTime = Date.now()

    addTelemetry({
      intent: 'ad_hoc_scan',
      tier: 2,
      zone: 'yellow',
      confidence: 0.8,
      cost: 0.01,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Ad-hoc scan initiated: "${query}"`,
    })

    // Start pipeline animation — execution stage stays active until LLM returns
    const completePipeline = await animatePipeline()

    // Build structured scan request using versioned template
    const scanRequest = {
      query,
      timestamp: new Date().toISOString(),
      subjects,
    }
    const scanPrompt = serializeScanPrompt(defaultScanTemplate, scanRequest, appState.voicePreset)
    const templateHash = hashScanConfig(defaultScanTemplate)

    try {
      // Use research-enabled request with web search
      const result: ResearchResult = await executeResearchRequest(scanPrompt, {
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        apiKey,
      })

      // LLM returned — complete the pipeline
      completePipeline()
      const latencyMs = Date.now() - startTime

      // Parse the response using template parser
      const parsed = parseScanResponse(result.text)

      // Build research section from real web search sources
      const research: ResearchSection | undefined = (parsed.research || (result.sources && result.sources.length > 0))
        ? {
            analysis: parsed.research?.analysis || parsed.summary,
            keyFindings: parsed.research?.keyFindings || [],
            sources: (result.sources || []).map(s => ({
              url: s.url,
              title: s.title,
              citedText: s.citedText,
              pageAge: s.pageAge,
            })),
            searchCount: result.searchCount || 0,
            templateHash,
          }
        : undefined

      // Build pending adjustments if any
      const pendingAdjustments: ScoreAdjustment[] = (parsed.adjustments || []).map((adj, i) => ({
        id: `adj-${Date.now()}-${i}`,
        subjectId: adj.subjectId,
        subjectName: adj.subjectName,
        currentScore: adj.currentScore,
        proposedScore: adj.proposedScore,
        delta: adj.delta,
        reason: adj.reason,
        confidence: adj.confidence,
        signalIds: [],
        triggeredBy: 'ad_hoc_scan',
        zone: Math.abs(adj.delta) >= 0.15 ? 'red' as const : Math.abs(adj.delta) >= 0.05 ? 'yellow' as const : 'green' as const,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        decidedAt: null,
        decidedBy: null,
      }))

      // Create briefing with research section
      const newBriefing: Briefing = {
        id: `brief-${Date.now()}`,
        title: `Scan: ${query}`,
        type: parsed.zone === 'red' ? 'strategic' : parsed.zone === 'yellow' ? 'significant' : 'routine',
        timestamp: new Date().toISOString(),
        tier: 2,
        signalCount: research?.sources.length || parsed.highlights.length,
        summary: parsed.summary,
        highlights: parsed.highlights,
        research,  // Real sources from web search
        zone: parsed.zone,
        status: 'delivered',
        pendingAdjustments: pendingAdjustments.length > 0 ? pendingAdjustments : undefined,
      }

      setBriefings(prev => [newBriefing, ...prev])

      // Build telemetry message with research info
      const researchInfo = research
        ? ` | ${research.searchCount} search${research.searchCount !== 1 ? 'es' : ''}, ${research.sources.length} source${research.sources.length !== 1 ? 's' : ''}`
        : ''

      // Track cost in metrics for Ratchet chart
      const scanCost = 0.01  // Tier 2 cost
      dispatch({
        type: 'UPDATE_METRICS',
        delta: {
          totalCost: scanCost,
          interactionCount: 1,
          costHistory: [{
            timestamp: new Date().toISOString(),
            cost: scanCost,
            tier: 2,
            intent: 'ad_hoc_scan',
            skillMatch: false,
          }],
          tierHistory: [{
            timestamp: new Date().toISOString(),
            tier: 2,
            intent: 'ad_hoc_scan',
          }],
        },
      })

      addTelemetry({
        intent: 'ad_hoc_scan',
        tier: 2,
        zone: parsed.zone,
        confidence: 0.85,
        cost: scanCost,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Research complete: "${query}" — ${parsed.zone.toUpperCase()} zone${researchInfo} #${templateHash}`,
      })

      // =========================================================================
      // FLYWHEEL: Track "brief me on" pattern for skill promotion
      // =========================================================================
      const briefMePattern = getBriefMeOnPatternKey(query, subjects)
      if (briefMePattern) {
        dispatch({ type: 'INCREMENT_PATTERN', intent: briefMePattern })

        const newCount = (appState.patternCounts[briefMePattern] || 0) + 1
        if (shouldProposeSkill(briefMePattern, { ...appState.patternCounts, [briefMePattern]: newCount }, appState.skills, appState.routingConfig)) {
          dispatch({
            type: 'PROPOSE_SKILL',
            intent: briefMePattern,
            pattern: generatePatternDescription(briefMePattern),
            count: newCount,
          })
        }
      }

    } catch (error) {
      completePipeline()
      const latencyMs = Date.now() - startTime
      const message = error instanceof Error ? error.message : String(error)

      addTelemetry({
        intent: 'ad_hoc_scan',
        tier: 2,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Scan failed: ${message}`,
      })
    }

    setIsProcessing(false)
  }

  // Handle adding a subject to watchlist (training mode)
  const handleAddSubject = async (name: string) => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY)

    if (!apiKey) {
      addTelemetry({
        intent: 'add_subject',
        tier: 0,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs: 0,
        humanFeedback: null,
        skillMatch: null,
        message: `Research failed: No API key configured. Click "Configure" in header.`,
      })
      return
    }

    setIsProcessing(true)
    const startTime = Date.now()

    // TIER 1: Fast entity extraction with Haiku
    addTelemetry({
      intent: 'extract_entity',
      tier: 1,
      zone: 'green',
      confidence: 0.9,
      cost: HAIKU_EXTRACTION_COST,
      mode: 'demo',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Extracting entity from: "${name}"`,
    })

    const extraction = await extractSubjectEntity(name, apiKey)
    const extractionLatency = Date.now() - startTime

    addTelemetry({
      intent: 'extract_entity',
      tier: 1,
      zone: 'green',
      confidence: extraction.confidence,
      cost: HAIKU_EXTRACTION_COST,
      mode: 'demo',
      latencyMs: extractionLatency,
      humanFeedback: null,
      skillMatch: null,
      message: `Extracted: "${extraction.name}"${extraction.typeHint ? ` (${extraction.typeHint})` : ''}${extraction.tierHint ? ` [${extraction.tierHint}]` : ''}`,
    })

    // Track Tier 1 cost in metrics for Ratchet/Flywheel
    dispatch({
      type: 'UPDATE_METRICS',
      delta: {
        totalCost: HAIKU_EXTRACTION_COST,
        interactionCount: 0, // Don't double-count, Tier 2 will add 1
        costHistory: [{
          timestamp: new Date().toISOString(),
          cost: HAIKU_EXTRACTION_COST,
          tier: 1,
          intent: 'extract_entity',
          skillMatch: false,
        }],
        tierHistory: [{
          timestamp: new Date().toISOString(),
          tier: 1,
          intent: 'extract_entity',
        }],
      },
    })

    // TIER 2: Deep research with Sonnet
    addTelemetry({
      intent: 'add_subject',
      tier: 2,
      zone: 'yellow',
      confidence: 0.8,
      cost: 0.01,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Researching subject: "${extraction.name}"`,
    })

    const completePipeline = await animatePipeline()

    // Build structured research request using versioned template
    // Include domain context and Tier 1 hints so research is grounded
    const subjectRequest = {
      name: extraction.name,
      timestamp: new Date().toISOString(),
      domainContext: domainConfig ? {
        domainName: domainConfig.domain.name,
        domainDescription: domainConfig.domain.description,
        scoringFactors: domainConfig.scoringRubric.factors,
        signalTypes: domainConfig.signalTypes.map(s => ({ label: s.label, keywords: s.keywords })),
        domainKeywords: domainConfig.domainKeywords,
      } : undefined,
      // Pass hints from Tier 1 extraction
      typeHint: extraction.typeHint,
      tierHint: extraction.tierHint,
    }
    const subjectPrompt = serializeSubjectPrompt(defaultSubjectTemplate, subjectRequest)
    const templateHash = hashSubjectConfig(defaultSubjectTemplate)

    try {
      // Use research-enabled request with web search for real-time intel
      const result: ResearchResult = await executeResearchRequest(subjectPrompt, {
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        apiKey,
      })

      completePipeline()
      const latencyMs = Date.now() - startTime

      const parsed = parseSubjectResponse(result.text)

      if (!parsed) {
        addTelemetry({
          intent: 'add_subject',
          tier: 2,
          zone: 'red',
          confidence: 0,
          cost: 0.01,
          mode: 'interactive',
          latencyMs,
          humanFeedback: null,
          skillMatch: null,
          message: `Research failed: Could not parse response for "${name}"`,
        })
        setIsProcessing(false)
        return
      }

      // Create proposed subject
      const proposedSubject: ProposedSubject = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: parsed.name,
        type: parsed.type,
        tier: parsed.tier,
        keywords: parsed.keywords,
        aliases: parsed.aliases,
        initialScore: parsed.initialScore,
        rationale: parsed.rationale,
      }

      // Extract key sections from rationale for highlights
      // Looks for patterns like "MARKET DISRUPTION (28%):" or "TECHNICAL ADVANCEMENT:"
      const sectionPattern = /([A-Z][A-Z\s]+)\s*(?:\((\d+%)\))?:\s*([^A-Z]+?)(?=[A-Z][A-Z\s]+(?:\(\d+%\))?:|$)/g
      const highlights: Array<{ text: string; zone: 'green' | 'yellow' | 'red' }> = []
      let match
      while ((match = sectionPattern.exec(parsed.rationale)) !== null) {
        const header = match[1].trim()
        const pct = match[2] || ''
        const content = match[3].trim().slice(0, 200) // Truncate long content
        highlights.push({
          text: `${header}${pct ? ` (${pct})` : ''}: ${content}`,
          zone: 'green',
        })
      }

      // Fallback if no sections found - use first 3 sentences
      if (highlights.length === 0) {
        const sentences = parsed.rationale.split(/[.!?]+/).filter(s => s.trim()).slice(0, 3)
        sentences.forEach(s => highlights.push({ text: s.trim(), zone: 'green' }))
      }

      // Create YELLOW briefing with pending subject
      const newBriefing: Briefing = {
        id: `brief-${Date.now()}`,
        title: `Add Subject: ${parsed.name}`,
        type: 'significant',
        timestamp: new Date().toISOString(),
        tier: 2,
        signalCount: 0,
        summary: `${parsed.type} · ${parsed.tier} · Score: ${Math.round(parsed.initialScore * 100)}/100`,
        highlights,
        pendingSubject: proposedSubject,
        zone: 'yellow',
        status: 'delivered',
      }

      setBriefings(prev => [newBriefing, ...prev])

      // Track cost in metrics for Ratchet chart
      const subjectCost = 0.01
      dispatch({
        type: 'UPDATE_METRICS',
        delta: {
          totalCost: subjectCost,
          interactionCount: 1,
          costHistory: [{
            timestamp: new Date().toISOString(),
            cost: subjectCost,
            tier: 2,
            intent: 'add_subject',
            skillMatch: false,
          }],
          tierHistory: [{
            timestamp: new Date().toISOString(),
            tier: 2,
            intent: 'add_subject',
          }],
        },
      })

      addTelemetry({
        intent: 'add_subject',
        tier: 2,
        zone: 'yellow',
        confidence: 0.85,
        cost: subjectCost,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Subject researched: ${parsed.name} — awaiting approval #${templateHash}`,
      })

    } catch (error) {
      completePipeline()
      const latencyMs = Date.now() - startTime
      const message = error instanceof Error ? error.message : String(error)

      addTelemetry({
        intent: 'add_subject',
        tier: 2,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Research failed: ${message}`,
      })
    }

    setIsProcessing(false)
  }

  /**
   * Handle domain configuration (Phase 1 of training)
   * Called after user answers both domain questions
   */
  const handleConfigureDomain = async (industry: string, trackingPrefs: string) => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (!apiKey) {
      addTelemetry({
        intent: 'configure_domain',
        tier: 0,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs: 0,
        humanFeedback: null,
        skillMatch: null,
        message: 'API key required for domain configuration',
      })
      return
    }

    setIsProcessing(true)
    const startTime = Date.now()

    addTelemetry({
      intent: 'configure_domain',
      tier: 2,
      zone: 'yellow',
      confidence: 0.8,
      cost: 0.01,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Configuring domain: "${industry}" with preferences: "${trackingPrefs}"`,
    })

    const completePipeline = await animatePipeline()

    // Build structured domain request using versioned template
    const domainRequest = {
      industry,
      trackingPrefs,
      timestamp: new Date().toISOString(),
    }
    const domainPrompt = serializeDomainPrompt(defaultDomainTemplate, domainRequest)
    const templateHash = hashDomainConfig({ version: '1.0.0' } as DomainConfig)

    try {
      const result = await executeCognitiveRequest(domainPrompt, {
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        apiKey,
      })

      completePipeline()
      const latencyMs = Date.now() - startTime

      const parsed = parseDomainResponse(result.text, domainRequest)

      if (!parsed) {
        addTelemetry({
          intent: 'configure_domain',
          tier: 2,
          zone: 'red',
          confidence: 0,
          cost: 0.01,
          mode: 'interactive',
          latencyMs,
          humanFeedback: null,
          skillMatch: null,
          message: 'Failed to parse domain configuration response',
        })
        setIsProcessing(false)
        return
      }

      // Create YELLOW briefing with pending domain config
      const newBriefing: Briefing = {
        id: `brief-domain-${Date.now()}`,
        title: `Domain Configuration: ${parsed.domain.name}`,
        type: 'significant',
        timestamp: new Date().toISOString(),
        tier: 2,
        signalCount: 0,
        summary: `Proposed configuration for tracking ${parsed.domain.name}. ${parsed.signalTypes.length} signal types, ${parsed.scoringRubric.factors.length} scoring factors.`,
        highlights: [
          { text: `Signal types: ${parsed.signalTypes.map(s => s.label).join(', ')}`, zone: 'green' },
          { text: `Subject categories: ${parsed.subjectTypes.map(s => s.label).join(', ')}`, zone: 'green' },
          { text: `Domain keywords: ${parsed.domainKeywords.slice(0, 5).join(', ')}...`, zone: 'green' },
        ],
        pendingDomainConfig: parsed,
        zone: 'yellow',
        status: 'draft',
      }

      setBriefings(prev => [newBriefing, ...prev])

      // Track cost in metrics for Ratchet chart
      const domainCost = 0.01
      dispatch({
        type: 'UPDATE_METRICS',
        delta: {
          totalCost: domainCost,
          interactionCount: 1,
          costHistory: [{
            timestamp: new Date().toISOString(),
            cost: domainCost,
            tier: 2,
            intent: 'configure_domain',
            skillMatch: false,
          }],
          tierHistory: [{
            timestamp: new Date().toISOString(),
            tier: 2,
            intent: 'configure_domain',
          }],
        },
      })

      addTelemetry({
        intent: 'configure_domain',
        tier: 2,
        zone: 'yellow',
        confidence: 0.85,
        cost: domainCost,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Domain configured: ${parsed.domain.name} — awaiting approval #${templateHash}`,
      })

    } catch (error) {
      completePipeline()
      const latencyMs = Date.now() - startTime
      const message = error instanceof Error ? error.message : String(error)

      addTelemetry({
        intent: 'configure_domain',
        tier: 2,
        zone: 'red',
        confidence: 0,
        cost: 0,
        mode: 'interactive',
        latencyMs,
        humanFeedback: null,
        skillMatch: null,
        message: `Domain configuration failed: ${message}`,
      })
    }

    setIsProcessing(false)
  }

  // Handle domain config approval
  const handleApproveDomainConfig = (briefingId: string) => {
    const briefing = briefings.find(b => b.id === briefingId)
    if (!briefing?.pendingDomainConfig) return

    const config = briefing.pendingDomainConfig

    // Save domain config
    setDomainConfig(config)
    setDomainSetupPhase(null)
    setPendingIndustry(null)

    // Remove from briefings or mark as approved
    setBriefings(prev => prev.filter(b => b.id !== briefingId))

    addTelemetry({
      intent: 'approve_domain_config',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'approved',
      skillMatch: null,
      message: `Domain configuration approved: ${config.domain.name} [${config.hash}]`,
    })
  }

  // Handle domain config rejection
  const handleRejectDomainConfig = (briefingId: string) => {
    const briefing = briefings.find(b => b.id === briefingId)
    if (!briefing?.pendingDomainConfig) return

    // Remove briefing, reset to industry phase
    setBriefings(prev => prev.filter(b => b.id !== briefingId))
    setDomainSetupPhase('industry')
    setPendingIndustry(null)

    addTelemetry({
      intent: 'reject_domain_config',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'rejected',
      skillMatch: null,
      message: 'Domain configuration rejected — restart setup',
    })
  }

  // Training phases
  const needsSubjectTraining = domainConfig && !trainingComplete && subjects.length < 10

  // Training mode: persists until user types "done"
  const isTrainingMode = needsSubjectTraining

  // Handle training completion
  const handleCompleteTraining = () => {
    setTrainingComplete(true)
    localStorage.setItem(TRAINING_COMPLETE_KEY, 'true')
    addTelemetry({
      intent: 'complete_training',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Training complete. Watchlist has ${subjects.length} subjects.`,
    })
  }

  // Handle briefing drill-down
  const handleDrillDown = (briefing: Briefing) => {
    setSelectedBriefing(briefing)
    setSelectedSubject(null)
    setIsSignalPanelOpen(true)
  }

  // Handle subject selection from watchlist
  const handleSubjectSelect = (subject: WatchlistSubject) => {
    setSelectedSubject(subject)
    setSelectedBriefing(null)
    setIsSignalPanelOpen(true)

    addTelemetry({
      intent: 'view_subject',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: null,
      skillMatch: null,
      message: `Viewing signals for: ${subject.name}`,
    })
  }

  // Handle approval
  const handleApprove = (adjustmentId: string) => {
    // Find the adjustment across all briefings
    let adjustment: any = null
    let briefingId: string | null = null

    for (const b of briefings) {
      const adj = b.pendingAdjustments?.find(a => a.id === adjustmentId)
      if (adj) {
        adjustment = adj
        briefingId = b.id
        break
      }
    }

    if (!adjustment || !briefingId) return

    // Get subject type for flywheel pattern
    const subject = subjects.find(s => s.id === adjustment.subjectId)
    const subjectType = subject?.type || 'competitor'

    // Update briefing - remove the adjustment
    setBriefings(prev => prev.map(b => {
      if (b.id !== briefingId) return b
      const newAdjustments = b.pendingAdjustments?.filter(a => a.id !== adjustmentId) || []
      // If no more pending adjustments in a yellow briefing, it becomes green
      const newZone = newAdjustments.length === 0 && b.zone === 'yellow' ? 'green' : b.zone
      return {
        ...b,
        pendingAdjustments: newAdjustments,
        zone: newZone,
      }
    }))

    // Update watchlist subject score
    setSubjects(prev => prev.map(s => {
      if (s.id !== adjustment.subjectId) return s
      const newEntry: ScoreHistoryEntry = {
        timestamp: new Date().toISOString(),
        score: adjustment.proposedScore,
        delta: adjustment.delta,
        reason: `Approved: ${adjustment.reason}`,
        signalId: adjustment.signalIds?.[0] || null,
        approvedBy: 'human',
      }
      return {
        ...s,
        baselineScore: adjustment.proposedScore,
        history: [...s.history, newEntry],
      }
    }))

    // =========================================================================
    // FLYWHEEL: Track pattern for skill learning (3 approvals → auto-approve)
    // =========================================================================
    const patternKey = getAdjustmentPatternKey(subjectType, adjustment.delta)

    if (patternKey) {
      // Increment pattern count
      dispatch({ type: 'INCREMENT_PATTERN', intent: patternKey })

      // Check if we should propose a skill (threshold from routingConfig)
      const newCount = (appState.patternCounts[patternKey] || 0) + 1
      if (shouldProposeSkill(patternKey, { ...appState.patternCounts, [patternKey]: newCount }, appState.skills, appState.routingConfig)) {
        dispatch({
          type: 'PROPOSE_SKILL',
          intent: patternKey,
          pattern: generatePatternDescription(patternKey),
          count: newCount,
        })
      }
    }

    // Log to telemetry
    addTelemetry({
      intent: patternKey || 'approve_adjustment',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'approved',
      skillMatch: null,
      message: `Approved: ${adjustment.subjectName} score ${(adjustment.currentScore * 100).toFixed(0)} → ${(adjustment.proposedScore * 100).toFixed(0)}`,
    })
  }

  // Handle rejection
  const handleReject = (adjustmentId: string) => {
    // Find the adjustment
    let adjustment: any = null
    let briefingId: string | null = null

    for (const b of briefings) {
      const adj = b.pendingAdjustments?.find(a => a.id === adjustmentId)
      if (adj) {
        adjustment = adj
        briefingId = b.id
        break
      }
    }

    if (!adjustment || !briefingId) return

    // Update briefing - remove the adjustment
    setBriefings(prev => prev.map(b => {
      if (b.id !== briefingId) return b
      const newAdjustments = b.pendingAdjustments?.filter(a => a.id !== adjustmentId) || []
      const newZone = newAdjustments.length === 0 && b.zone === 'yellow' ? 'green' : b.zone
      return {
        ...b,
        pendingAdjustments: newAdjustments,
        zone: newZone,
      }
    }))

    // Log to telemetry
    addTelemetry({
      intent: 'reject_adjustment',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'rejected',
      skillMatch: null,
      message: `Rejected: ${adjustment.subjectName} adjustment — human override`,
    })
  }

  // Handle subject approval (add to watchlist)
  const handleApproveSubject = (briefingId: string) => {
    const briefing = briefings.find(b => b.id === briefingId)
    if (!briefing?.pendingSubject) return

    const proposed = briefing.pendingSubject

    // Create new watchlist subject from proposal
    const newSubject: WatchlistSubject = {
      id: proposed.id,
      name: proposed.name,
      type: proposed.type,
      tier: proposed.tier,
      baselineScore: proposed.initialScore,
      keywords: proposed.keywords,
      aliases: proposed.aliases,
      sources: [],
      lastUpdated: new Date().toISOString(),
      history: [{
        timestamp: new Date().toISOString(),
        score: proposed.initialScore,
        delta: 0,
        reason: 'Initial assessment',
        signalId: null,
        approvedBy: 'human',
      }],
    }

    // Add to watchlist
    setSubjects(prev => [...prev, newSubject])

    // Update briefing - mark as complete
    setBriefings(prev => prev.map(b => {
      if (b.id !== briefingId) return b
      return {
        ...b,
        pendingSubject: undefined,
        zone: 'green' as const,
      }
    }))

    // Log to telemetry
    addTelemetry({
      intent: 'approve_subject',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'approved',
      skillMatch: null,
      message: `Added to watchlist: ${proposed.name} (${proposed.type}, ${proposed.tier})`,
    })
  }

  // Handle subject rejection
  const handleRejectSubject = (briefingId: string) => {
    const briefing = briefings.find(b => b.id === briefingId)
    if (!briefing?.pendingSubject) return

    const proposed = briefing.pendingSubject

    // Update briefing - remove pending subject
    setBriefings(prev => prev.map(b => {
      if (b.id !== briefingId) return b
      return {
        ...b,
        pendingSubject: undefined,
        zone: 'green' as const,
      }
    }))

    // Log to telemetry
    addTelemetry({
      intent: 'reject_subject',
      tier: 0,
      zone: 'green',
      confidence: 1,
      cost: 0,
      mode: 'interactive',
      latencyMs: 0,
      humanFeedback: 'rejected',
      skillMatch: null,
      message: `Rejected subject: ${proposed.name} — human override`,
    })
  }

  // View navigation
  const handleViewChange = (view: CurrentView) => {
    dispatch({ type: 'SET_VIEW', view })
  }

  // CommandBar submit handler (extracted for reuse)
  // ALL operations flow through pipeline stages with zone governance
  const handleCommandBarSubmit = async (input: string) => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY)

    // Helper: Animate through pipeline stages (every operation is an Autonomaton)
    const animatePipeline = async (
      intent: string,
      tier: 0 | 1 | 2 | 3,
      zone: 'green' | 'yellow' | 'red',
      requiresApiKey: boolean
    ) => {
      // Reset and start pipeline
      dispatch({ type: 'RESET_PIPELINE' })

      // Stage 1: Telemetry
      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'telemetry', state: 'active' })
      await new Promise(r => setTimeout(r, 150))
      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'telemetry', state: 'complete' })

      // Stage 2: Recognition
      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'recognition', state: 'active' })
      await new Promise(r => setTimeout(r, 200))
      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'recognition', state: 'complete' })

      // Stage 3: Compilation — ANDON GATE
      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'compilation', state: 'active' })
      await new Promise(r => setTimeout(r, 150))

      // Andon Gate: Check API key if required
      if (requiresApiKey && !apiKey) {
        dispatch({
          type: 'HALT_PIPELINE',
          reason: {
            stage: 'compilation',
            error: `Missing API Key: ${intent} requires Anthropic credentials`,
            expected: 'Anthropic API key configured in header',
            proposedFix: 'Click "Configure" in the header (upper right) to add your Anthropic API key',
          },
        })
        return false // Halt — don't proceed
      }

      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'compilation', state: 'complete' })

      // Stage 4: Approval (zone-dependent)
      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'approval', state: 'active' })
      await new Promise(r => setTimeout(r, zone === 'yellow' ? 300 : 100))
      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'approval', state: 'complete' })

      // Stage 5: Execution
      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'execution', state: 'active' })

      // Log telemetry
      addTelemetry({
        intent,
        tier,
        zone,
        confidence: 0.9,
        cost: tier === 0 ? 0 : tier === 1 ? 0.001 : tier === 2 ? 0.01 : 0.1,
        mode: apiKey ? 'interactive' : 'demo',
        latencyMs: 0,
        humanFeedback: null,
        skillMatch: null,
      })

      return true // Proceed
    }

    // Phase 1: Domain setup
    if (domainSetupPhase === 'industry') {
      const proceed = await animatePipeline('configure_domain', 1, 'green', true)
      if (!proceed) return

      dispatch({ type: 'SET_PIPELINE_STAGE', stage: 'execution', state: 'complete' })
      setPendingIndustry(input)
      setDomainSetupPhase('tracking')
    } else if (domainSetupPhase === 'tracking' && pendingIndustry) {
      const proceed = await animatePipeline('configure_domain', 2, 'yellow', true)
      if (!proceed) return

      handleConfigureDomain(pendingIndustry, input)
      setDomainSetupPhase('awaiting_approval')
      dispatch({ type: 'SET_VIEW', view: 'briefings' })
    } else if (domainSetupPhase === 'awaiting_approval') {
      // User must approve domain config before continuing
    }
    // Phase 2: Subject training
    else if (isTrainingMode && input.toLowerCase().trim() === 'done') {
      if (subjects.length === 0) return
      handleCompleteTraining()
    } else if (isTrainingMode) {
      const lowerInput = input.toLowerCase()
      const briefTriggers = ['brief me on', 'brief me about', 'what about', 'update on', 'news on', 'tell me about']
      const isBriefRequest = briefTriggers.some(t => lowerInput.includes(t))
      const matchesExistingSubject = subjects.some(s =>
        s.keywords.some(kw => lowerInput.includes(kw.toLowerCase())) ||
        lowerInput.includes(s.name.toLowerCase())
      )
      if (isBriefRequest && matchesExistingSubject) {
        handleScan(input)
      } else {
        handleAddSubject(input)
      }
    }
    // Phase 3: Operational
    else {
      handleScan(input)
    }
  }

  // CommandBar placeholder (extracted for reuse)
  const getCommandBarPlaceholder = () => {
    if (domainSetupPhase === 'industry') {
      return 'What industry or domain are you monitoring? (e.g., AI/ML, Healthcare, Fintech)'
    }
    if (domainSetupPhase === 'tracking') {
      return `Tracking ${pendingIndustry}. What signals matter? (e.g., funding, launches, pricing, partnerships...)`
    }
    if (domainSetupPhase === 'awaiting_approval') {
      return '↑ Review and approve domain configuration above to continue'
    }
    if (isTrainingMode) {
      return subjects.length === 0
        ? `Add your first subject (e.g., "Anthropic as a direct competitor")`
        : `Added ${subjects.length}. Try: "Deepseek as emerging player" or "done" to start`
    }
    return 'Brief me on... (e.g., "Anthropic this week", "OpenAI pricing changes")'
  }

  // Render view content based on currentView
  const renderViewContent = () => {
    switch (appState.currentView) {
      case 'dashboard':
        return (
          <DashboardView
            subjects={subjects}
            briefings={briefings}
            costHistory={appState.metrics.costHistory}
            tierHistory={appState.metrics.tierHistory}
            onSubjectClick={handleSubjectSelect}
            onBriefingClick={handleDrillDown}
            onViewBriefings={() => handleViewChange('briefings')}
          />
        )

      case 'briefings':
        return (
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* LEFT: Signal Feed (collapsible drill-down) */}
            <div
              className={`border-r border-grove-border transition-all duration-300 flex-shrink-0 ${
                isSignalPanelOpen ? 'w-72' : 'w-0'
              } overflow-hidden`}
            >
              <div className="w-72 h-full flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-grove-border bg-grove-bg2">
                  <span className="text-sm font-mono text-grove-text-dim truncate">
                    {selectedSubject
                      ? selectedSubject.name
                      : selectedBriefing
                        ? selectedBriefing.title
                        : 'Signal Feed'}
                  </span>
                  <button
                    onClick={() => {
                      setIsSignalPanelOpen(false)
                      setSelectedSubject(null)
                      setSelectedBriefing(null)
                    }}
                    className="text-grove-text-dim hover:text-grove-text ml-2"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  {selectedSubject ? (
                    <SubjectDetailPane subject={selectedSubject} />
                  ) : selectedBriefing ? (
                    <BriefingDetailPane briefing={selectedBriefing} />
                  ) : (
                    <SignalFeed />
                  )}
                </div>
              </div>
            </div>

            {/* CENTER: Briefing Inbox + CommandBar (2/3 of remaining space) */}
            <div className="flex-[2] min-w-0 border-r border-grove-border flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto">
                {/* Andon Gate — DiagnosticCard for pipeline halts (appears in inbox) */}
                {pipeline.halted && pipeline.haltReason && (
                  <div className="p-4">
                    <DiagnosticCard
                      reason={pipeline.haltReason}
                      onReset={() => dispatch({ type: 'RESET_PIPELINE' })}
                    />
                  </div>
                )}
                <BriefingInbox
                  briefings={briefings}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onApproveSubject={handleApproveSubject}
                  onRejectSubject={handleRejectSubject}
                  onApproveDomainConfig={handleApproveDomainConfig}
                  onRejectDomainConfig={handleRejectDomainConfig}
                  onDrillDown={handleDrillDown}
                />
              </div>
              {/* CommandBar inside briefing column */}
              <CommandBar
                onSubmit={handleCommandBarSubmit}
                isProcessing={isProcessing}
                placeholder={getCommandBarPlaceholder()}
              />
            </div>

            {/* RIGHT: Watchlist Scorecard (1/3 of remaining space) */}
            <div className="flex-1 min-w-0">
              <WatchlistDashboard
                subjects={subjects}
                onSubjectSelect={handleSubjectSelect}
              />
            </div>
          </div>
        )

      case 'config':
        return (
          <ConfigPanel
            subjects={subjects}
            onRemoveSubject={(id) => {
              setSubjects(prev => prev.filter(s => s.id !== id))
              addTelemetry({
                intent: 'remove_subject',
                tier: 0,
                zone: 'green',
                confidence: 1,
                cost: 0,
                mode: 'interactive',
                latencyMs: 0,
                humanFeedback: null,
                skillMatch: null,
                message: `Removed subject: ${id}`,
              })
            }}
          />
        )

      case 'flywheel':
        return <FlywheelView />

      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-grove-bg text-grove-text flex flex-col overflow-hidden">
      <Header />
      <NavBar currentView={appState.currentView} onViewChange={handleViewChange} />
      <PipelineVisualization />

      {/* Main Content */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {renderViewContent()}
      </main>

      {/* Command Bar - only show globally when NOT on briefings view (briefings has it inline) */}
      {appState.currentView !== 'briefings' && (
        <CommandBar
          onSubmit={handleCommandBarSubmit}
          isProcessing={isProcessing}
          placeholder={getCommandBarPlaceholder()}
        />
      )}

      <TelemetryStream />

      {/* Cost Evaporation Notification - subtle "ratchet" feel */}
      {costEvaporation && (
        <CostEvaporation
          savings={costEvaporation.savings}
          skillName={costEvaporation.skillName}
          onComplete={() => setCostEvaporation(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-grove-border px-6 py-2 text-center text-xs text-grove-text-dim font-mono">
        Signal Watch • Built on{' '}
        <a
          href="https://the-grove.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-grove-text transition-colors"
        >
          Grove Autonomaton Pattern
        </a>
        {' '}• v{APP_VERSION}{' '}
        <span className="text-grove-text-dim">#{__COMMIT_HASH__}</span>
      </footer>
    </div>
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
