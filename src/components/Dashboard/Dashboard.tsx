/**
 * Dashboard — Real-time metrics proving the Ratchet
 *
 * Shows: Total Cost, Interaction Count, Average Tier, % Local, Skills Fired
 * The key insight: cost trends DOWN while capability stays flat.
 *
 * Typography: Instrument Serif for metric values
 * Design: Strict geometry (no rounded)
 */

import { useMetrics, useSkills } from '../../state/context'
import { formatCost } from '../../config/tiers'

export function Dashboard() {
  const metrics = useMetrics()
  const skills = useSkills()

  const avgTier = metrics.tierHistory.length > 0
    ? (metrics.tierHistory.reduce((a, b) => a + b, 0) / metrics.tierHistory.length)
    : null

  const pctLocal = metrics.interactionCount > 0
    ? Math.round((metrics.localCount / metrics.interactionCount) * 100)
    : 0

  // Calculate trends from recent history
  const tierTrend = getTrend(metrics.tierHistory)
  const costTrend = getCostTrend(metrics.costHistory)
  const localTrend = getLocalTrend(metrics.localCount, metrics.interactionCount)

  return (
    <section className="border-b border-grove-border px-6 py-4 bg-grove-bg2/50">
      <div className="flex items-center justify-center gap-4">
        <MetricCard
          label="Total Cost"
          value={formatCost(metrics.totalCost)}
          trend={costTrend}
          trendGoodDirection="down"
        />
        <MetricCard
          label="Interactions"
          value={metrics.interactionCount.toString()}
        />
        <MetricCard
          label="Avg Tier"
          value={avgTier !== null ? avgTier.toFixed(1) : '—'}
          trend={tierTrend}
          trendGoodDirection="down"
          sparkline={metrics.tierHistory.slice(-10)}
          highlight={avgTier !== null && avgTier < 1.5}
        />
        <MetricCard
          label="% Local"
          value={`${pctLocal}%`}
          trend={localTrend}
          trendGoodDirection="up"
          highlight={pctLocal > 50}
        />
        <MetricCard
          label="Skills"
          value={skills.length.toString()}
          highlight={skills.length > 0}
          accentColor="text-tier-0"
        />
      </div>
    </section>
  )
}

type TrendDirection = 'up' | 'down' | 'flat' | null

interface MetricCardProps {
  label: string
  value: string
  trend?: TrendDirection
  trendGoodDirection?: 'up' | 'down'
  sparkline?: number[]
  highlight?: boolean
  accentColor?: string
}

function MetricCard({
  label,
  value,
  trend,
  trendGoodDirection,
  sparkline,
  highlight,
  accentColor = 'text-grove-text'
}: MetricCardProps) {
  const trendColor = trend && trendGoodDirection
    ? (trend === trendGoodDirection ? 'text-grove-green' : trend === 'flat' ? 'text-grove-text-dim' : 'text-grove-amber')
    : 'text-grove-text-dim'

  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : trend === 'flat' ? '→' : ''

  return (
    <div className={`
      bg-grove-bg3 border border-grove-border px-4 py-3 min-w-[120px]
      ${highlight ? 'border-grove-green/30 bg-grove-green/5' : ''}
      transition-all duration-300
    `}>
      <div className="text-xs text-grove-text-dim mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <span className={`font-serif font-semibold text-lg ${highlight ? 'text-grove-green' : accentColor}`}>
          {value}
        </span>
        {trend && (
          <span className={`text-sm ${trendColor}`}>
            {trendArrow}
          </span>
        )}
      </div>
      {sparkline && sparkline.length > 1 && (
        <MiniSparkline data={sparkline} />
      )}
    </div>
  )
}

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const height = 16
  const width = 60

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="mt-1 opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-grove-text-dim"
      />
    </svg>
  )
}

function getTrend(history: number[]): TrendDirection {
  if (history.length < 3) return null
  const recent = history.slice(-3)
  const avg1 = recent.slice(0, 2).reduce((a, b) => a + b, 0) / 2
  const avg2 = recent[recent.length - 1]
  if (avg2 < avg1 - 0.1) return 'down'
  if (avg2 > avg1 + 0.1) return 'up'
  return 'flat'
}

function getCostTrend(history: number[]): TrendDirection {
  if (history.length < 3) return null
  const recent = history.slice(-3)
  const first = recent[0]
  const last = recent[recent.length - 1]
  if (last < first * 0.9) return 'down'
  if (last > first * 1.1) return 'up'
  return 'flat'
}

function getLocalTrend(localCount: number, totalCount: number): TrendDirection {
  if (totalCount < 3) return null
  const pct = localCount / totalCount
  if (pct > 0.6) return 'up'
  if (pct < 0.3) return 'down'
  return 'flat'
}
