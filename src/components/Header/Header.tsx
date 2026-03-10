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
    localStorage.setItem(API_KEY_STORAGE_KEY, tempKey)
    setApiKey(tempKey)
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
          <p className="text-xs text-grove-text-dim">Competitive Intelligence Monitor</p>
        </div>

        {/* RIGHT: API Key */}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
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
            <>
              <span className="text-sm text-grove-text-dim">API Key:</span>
              {apiKey ? (
                <span className="font-mono text-sm text-grove-text">
                  {maskKey(apiKey)}
                </span>
              ) : (
                <span className="font-mono text-sm text-zone-yellow">
                  Not configured
                </span>
              )}
              <button
                onClick={handleStartEdit}
                className="px-2 py-1 text-sm font-mono text-grove-amber hover:text-grove-amber-bright border border-grove-border hover:border-grove-amber transition-colors"
              >
                {apiKey ? 'Edit' : 'Configure'}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
