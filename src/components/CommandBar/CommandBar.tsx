/**
 * CommandBar — Ad-hoc scan input
 *
 * "Brief me on Anthropic this week" → triggers ad_hoc_scan intent
 * Flows through the 5-stage pipeline like everything else.
 */

import { useState, useRef, useEffect } from 'react'

interface CommandBarProps {
  onSubmit: (query: string) => void
  isProcessing?: boolean
  placeholder?: string
}

export function CommandBar({
  onSubmit,
  isProcessing = false,
  placeholder = 'Brief me on... (e.g., "Anthropic this week", "OpenAI pricing changes")',
}: CommandBarProps) {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isProcessing) {
      onSubmit(value.trim())
      setValue('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`border-y transition-colors ${
        isFocused ? 'border-grove-amber bg-grove-bg' : 'border-grove-border bg-grove-bg2'
      }`}
    >
      <div className="max-w-[65%] mx-auto">
        <div className="flex items-center gap-3 px-4 py-2">
          <span className={`font-mono text-lg ${isFocused ? 'text-grove-amber' : 'text-grove-text-dim'}`}>
            /
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isProcessing}
            className="flex-1 bg-transparent text-grove-text placeholder-grove-text-dim focus:outline-none font-mono"
          />
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-grove-amber border-t-transparent animate-spin" />
              <span className="text-grove-amber text-sm font-mono">
                Scanning...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <kbd className="px-1.5 py-0.5 text-xs font-mono text-grove-text-dim bg-grove-bg border border-grove-border">
                ⌘K
              </kbd>
              <button
                type="submit"
                disabled={!value.trim()}
                className={`px-4 py-1.5 text-sm font-mono transition-colors ${
                  value.trim()
                    ? 'bg-grove-amber text-grove-bg hover:bg-grove-amber-bright'
                    : 'bg-grove-bg3 text-grove-text-dim cursor-not-allowed'
                }`}
              >
                Scan
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}

export default CommandBar
