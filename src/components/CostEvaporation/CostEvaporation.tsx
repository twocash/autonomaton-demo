/**
 * CostEvaporation — Subtle notification when skill fires
 *
 * Shows briefly when a Tier 0 skill fires instead of a higher tier.
 * Displays the cost delta with a fade-out animation.
 *
 * This is a "feel" detail — proves Claim #6: The Ratchet.
 */

import { useEffect, useState } from 'react'

interface CostEvaporationProps {
  savings: number
  skillName: string
  onComplete: () => void
}

export function CostEvaporation({ savings, skillName, onComplete }: CostEvaporationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Start fade-out after brief display
    const fadeTimer = setTimeout(() => {
      setIsVisible(false)
    }, 1500)

    // Cleanup after animation
    const cleanupTimer = setTimeout(() => {
      onComplete()
    }, 2300)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(cleanupTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed bottom-20 right-6 z-40 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-grove-bg2 border border-tier-0/30 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-tier-0 animate-pulse" />
          <div>
            <div className="text-xs text-grove-text-dim font-mono uppercase tracking-wider">
              Skill Fired
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-grove-text font-mono">{skillName}</span>
              <span className="text-xs text-grove-text-dim">→</span>
              <span className="text-sm font-mono text-tier-0 font-medium">
                -${savings.toFixed(4)} saved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostEvaporation
