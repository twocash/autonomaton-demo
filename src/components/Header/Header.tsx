/**
 * Header — Logo and API Key Configuration
 *
 * Simple header with API key input stored in localStorage.
 * No mode toggle, no view tabs — this is Signal Watch, not a playground.
 */

import { useState, useEffect } from 'react'

const API_KEY_STORAGE_KEY = 'signal_watch_api_key'

export function Header() {
  const [apiKey, setApiKey] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [tempKey, setTempKey] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (stored) {
      setApiKey(stored)
    }
  }, [])

  const handleSave = () => {
    if (tempKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, tempKey.trim())
      setApiKey(tempKey.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempKey(apiKey)
    setIsEditing(false)
  }

  const handleStartEdit = () => {
    setTempKey(apiKey)
    setIsEditing(true)
  }

  // Auto-save on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Auto-save on blur if key looks valid
  const handleBlur = () => {
    if (tempKey.trim() && tempKey.trim().startsWith('sk-')) {
      handleSave()
    }
  }

  const maskKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return '••••••••'
    return key.slice(0, 7) + '••••' + key.slice(-4)
  }

  return (
    <header className="border-b border-grove-border px-4 py-2 bg-grove-bg2">
      <div className="flex items-center justify-between">
        {/* LEFT: Logo */}
        <div>
          <h1 className="text-lg font-serif text-grove-text leading-tight">
            Signal Watch
          </h1>
          <p className="text-xs text-grove-text-dim">Competitive Research Pipeline Autonomaton Demo</p>
        </div>

        {/* CENTER: GitHub CTA */}
        <a
          href="https://github.com/twocash/autonomaton-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-grove-text-dim hover:text-grove-amber transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Fork this Autonomaton
        </a>

        {/* RIGHT: API Key */}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder="sk-ant-api03-..."
                  className="w-64 px-2 py-1 text-sm font-mono bg-grove-bg border border-grove-border text-grove-text placeholder-grove-text-dim focus:outline-none focus:border-grove-amber"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="px-2 py-1 text-sm font-mono text-grove-amber hover:text-grove-amber-bright"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-2 py-1 text-sm font-mono text-grove-text-dim hover:text-grove-text"
                >
                  Cancel
                </button>
              </div>
              <span className="text-xs text-grove-text-dim">
                Stored locally in browser. Sent only to Anthropic API.
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-3">
                <span className="text-sm text-grove-text-dim">Anthropic API Key:</span>
                {apiKey ? (
                  <span className="font-mono text-sm text-grove-text">
                    {maskKey(apiKey)}
                  </span>
                ) : (
                  <span className="font-mono text-sm text-zone-yellow">
                    Required for live research
                  </span>
                )}
                <button
                  onClick={handleStartEdit}
                  className="px-2 py-1 text-sm font-mono text-grove-amber hover:text-grove-amber-bright border border-grove-border hover:border-grove-amber transition-colors"
                >
                  {apiKey ? 'Edit' : 'Configure'}
                </button>
              </div>
              {!apiKey && (
                <span className="text-xs text-grove-text-dim">
                  Demo mode available without key
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
