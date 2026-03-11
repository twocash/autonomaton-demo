/**
 * Demo Briefings — Sample briefing inbox entries
 *
 * Shows the three zone states:
 * - GREEN: Routine landscape scans, collapsible
 * - YELLOW: Significant changes requiring approval
 * - RED: Strategic shifts requiring human decision
 */

import type { Briefing } from '../../state/types'

const now = new Date()
const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000)

export const demoBriefings: Briefing[] = [
  // RED ZONE — Strategic decision required
  {
    id: 'brief-001',
    title: 'OpenAI Announces GPT-5 Launch',
    type: 'strategic',
    timestamp: hourAgo.toISOString(),
    tier: 3,
    signalCount: 12,
    summary: 'OpenAI has announced GPT-5 with reported 10x capability improvements across reasoning benchmarks. This represents a potential structural shift in the competitive landscape requiring strategic reassessment.',
    highlights: [
      {
        text: 'GPT-5 shows 10x improvement on GPQA and MATH benchmarks, potentially obsoleting current-gen model positioning',
        zone: 'red',
        subjectId: 'openai',
        type: 'product_launch',
      },
      {
        text: 'Pricing announced at $0.03/1K tokens — aggressive positioning against Claude Opus tier',
        zone: 'red',
        subjectId: 'openai',
      },
      {
        text: 'Enterprise rollout begins in 2 weeks; consumer access in 30 days',
        zone: 'yellow',
        subjectId: 'openai',
      },
    ],
    recommendations: [
      {
        priority: 'high',
        action: 'Accelerate Claude 4 timeline assessment',
        rationale: 'Current roadmap may need compression if capability claims hold',
      },
      {
        priority: 'high',
        action: 'Commission independent benchmark validation',
        rationale: 'Historical precedent of inflated launch claims; verify before strategic pivot',
      },
      {
        priority: 'medium',
        action: 'Monitor enterprise customer sentiment',
        rationale: 'Early signals of switching intent will inform retention strategy',
      },
    ],
    research: {
      analysis: 'Multiple credible sources confirm GPT-5 announcement with significant capability claims. OpenAI positioning this as a generational leap, though independent verification is pending. Market reaction has been substantial.',
      keyFindings: [
        'GPT-5 reportedly achieves 10x improvement on GPQA, MATH, and HumanEval benchmarks',
        'Enterprise pricing at $0.03/1K tokens undercuts current Claude Opus pricing by 40%',
        'Sam Altman describes GPT-5 as "the first truly useful AI" in keynote',
        'Microsoft Azure integration confirmed for day-one availability',
      ],
      sources: [
        {
          url: 'https://techcrunch.com/2026/03/09/openai-announces-gpt-5-launch',
          title: 'OpenAI Announces GPT-5 with Reported 10x Capability Improvements',
          citedText: 'OpenAI unveiled GPT-5 today, claiming breakthrough performance across all major benchmarks...',
          pageAge: '2 hours ago',
        },
        {
          url: 'https://www.reuters.com/technology/openai-gpt5-enterprise-pricing',
          title: 'OpenAI Sets Aggressive Enterprise Pricing for GPT-5 Launch',
          citedText: 'The new pricing structure positions GPT-5 competitively against Anthropic Claude...',
          pageAge: '3 hours ago',
        },
        {
          url: 'https://openai.com/blog/gpt-5-announcement',
          title: 'Introducing GPT-5 | OpenAI',
          citedText: 'Today we announce GPT-5, our most capable model yet...',
          pageAge: '4 hours ago',
        },
        {
          url: 'https://www.bloomberg.com/news/openai-gpt5-market-reaction',
          title: 'OpenAI GPT-5 Announcement Sends Ripples Through AI Industry',
          citedText: 'Analysts are reassessing competitive dynamics in the AI foundation model market...',
          pageAge: '1 hour ago',
        },
      ],
      searchCount: 3,
      templateHash: 'demo-001',
    },
    pendingAdjustments: [
      {
        id: 'adj-001',
        subjectId: 'openai',
        subjectName: 'OpenAI',
        currentScore: 0.82,
        proposedScore: 0.95,
        delta: 0.13,
        reason: 'GPT-5 launch represents significant capability advancement pending verification',
        signalIds: ['sig-001'],
        triggeredBy: 'GPT-5 announcement (TechCrunch, Reuters, official blog)',
        confidence: 0.78,
        zone: 'yellow',
        status: 'pending',
        createdAt: hourAgo.toISOString(),
        decidedAt: null,
        decidedBy: null,
      },
    ],
    zone: 'red',
    status: 'delivered',
  },

  // YELLOW ZONE — Approval required
  {
    id: 'brief-002',
    title: 'Anthropic Series D Funding Round',
    type: 'significant',
    timestamp: twoHoursAgo.toISOString(),
    tier: 2,
    signalCount: 8,
    summary: 'Anthropic has raised $2B in Series D funding led by Google, with Amazon participating. Valuation reportedly at $18B. This strengthens their competitive position and extends runway significantly.',
    highlights: [
      {
        text: '$2B raise at $18B valuation — 2x increase from Series C',
        zone: 'yellow',
        subjectId: 'anthropic',
        type: 'funding',
      },
      {
        text: 'Google deepening strategic partnership; potential exclusive cloud deal implications',
        zone: 'yellow',
        subjectId: 'anthropic',
      },
      {
        text: 'Hiring targets increased to 500 new roles in 2024',
        zone: 'green',
        subjectId: 'anthropic',
        type: 'talent',
      },
    ],
    pendingAdjustments: [
      {
        id: 'adj-002',
        subjectId: 'anthropic',
        subjectName: 'Anthropic',
        currentScore: 0.75,
        proposedScore: 0.82,
        delta: 0.07,
        reason: 'Significant funding extends runway and enables aggressive R&D expansion',
        signalIds: ['sig-002', 'sig-003'],
        triggeredBy: 'Series D announcement (WSJ, Bloomberg)',
        confidence: 0.92,
        zone: 'yellow',
        status: 'pending',
        createdAt: twoHoursAgo.toISOString(),
        decidedAt: null,
        decidedBy: null,
      },
    ],
    zone: 'yellow',
    status: 'delivered',
  },

  // GREEN ZONE — Routine scan
  {
    id: 'brief-003',
    title: 'Routine Landscape Scan',
    type: 'routine',
    timestamp: fourHoursAgo.toISOString(),
    tier: 1,
    signalCount: 23,
    summary: 'Landscape stable. 23 signals processed, no score adjustments triggered. Minor product updates from secondary competitors.',
    highlights: [
      {
        text: 'Meta released Llama 3 8B fine-tuned variant — incremental, no competitive impact',
        zone: 'green',
        subjectId: 'meta',
      },
      {
        text: 'Mistral blog post on training efficiency — interesting but no immediate threat',
        zone: 'green',
        subjectId: 'mistral',
      },
      {
        text: 'Google DeepMind published Gemini safety paper — alignment with industry norms',
        zone: 'green',
        subjectId: 'deepmind',
      },
    ],
    zone: 'green',
    status: 'delivered',
  },

  // GREEN ZONE — Earlier routine scan
  {
    id: 'brief-004',
    title: 'Routine Landscape Scan',
    type: 'routine',
    timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    tier: 1,
    signalCount: 18,
    summary: 'Landscape stable. 18 signals processed, no material changes detected.',
    highlights: [
      {
        text: 'Industry conference announcements — mostly roadmap reiterations',
        zone: 'green',
      },
      {
        text: 'Regulatory comment period opened for EU AI Act implementation',
        zone: 'green',
        type: 'regulatory',
      },
    ],
    zone: 'green',
    status: 'delivered',
  },
]
