/**
 * ConfigEditor — Live-editable configuration files
 *
 * This proves Claim #3: Declarative configuration defines behavior.
 * Edit the config → behavior changes immediately → no deploy required.
 *
 * The "config ripple" animation is the proof: a visual pulse travels
 * from the editor to the interaction pane when changes are saved.
 *
 * Four tabs:
 * - routing.config: Intent routing rules
 * - zones.schema: Zone governance definitions
 * - models.config: Tier-to-model mappings (proves Claim #8)
 * - skills.library: Approved cached patterns
 *
 * Typography: Fragment Mono for all config content
 * Design: Strict geometry (no rounded)
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRoutingConfig, useZonesSchema, useAppDispatch, useAppState, useSkills } from '../../state/context'
import { serializeRoutingConfig, parseRoutingConfig } from '../../config/routing'
import { serializeZonesSchema } from '../../config/zones'
import { serializeModelsConfig, parseModelsConfig } from '../../config/models'
import { serializeSkills } from '../../config/skills'

/**
 * Applies syntax highlighting to YAML text
 */
function highlightYaml(text: string): string {
  return text
    // Comments first (preserves them from other replacements)
    .replace(/(#.*)$/gm, '<span class="yaml-comment">$1</span>')
    // Zone keywords (governance colors)
    .replace(/\b(green)\b/g, '<span class="yaml-zone-green">$1</span>')
    .replace(/\b(yellow)\b/g, '<span class="yaml-zone-yellow">$1</span>')
    .replace(/\b(red)\b/g, '<span class="yaml-zone-red">$1</span>')
    // Booleans
    .replace(/\b(true|false)\b/g, '<span class="yaml-boolean">$1</span>')
    // Numbers (including decimals)
    .replace(/:\s*(\d+\.?\d*)\b/g, ': <span class="yaml-number">$1</span>')
    // Strings in quotes
    .replace(/"([^"]*)"/g, '"<span class="yaml-string">$1</span>"')
    .replace(/'([^']*)'/g, "'<span class=\"yaml-string\">$1</span>'")
    // Keys (word followed by colon)
    .replace(/^(\s*)(\w[\w\s]*):/gm, '$1<span class="yaml-key">$2</span>:')
}

type Tab = 'routing' | 'zones' | 'models' | 'skills'

export function ConfigEditor() {
  const [activeTab, setActiveTab] = useState<Tab>('routing')
  const [error, setError] = useState<string | null>(null)
  const [hasEdited, setHasEdited] = useState(false)
  const routingConfig = useRoutingConfig()
  const zonesSchema = useZonesSchema()
  const state = useAppState()
  const skills = useSkills()
  const dispatch = useAppDispatch()
  const { configRipple, skillProposal } = state

  const [routingText, setRoutingText] = useState(serializeRoutingConfig(routingConfig))
  const [modelsText, setModelsText] = useState(serializeModelsConfig(state))
  const [skillsText, setSkillsText] = useState(serializeSkills(skills))

  // Zones is read-only, computed directly
  const zonesText = useMemo(() => serializeZonesSchema(zonesSchema), [zonesSchema])

  // Update skills text when skills change
  useEffect(() => {
    setSkillsText(serializeSkills(skills))
  }, [skills])

  // Auto-switch to skills tab when skill is approved
  useEffect(() => {
    if (!skillProposal.active && skills.length > 0) {
      const lastSkill = skills[skills.length - 1]
      const isRecent = Date.now() - new Date(lastSkill.approvedAt).getTime() < 2000
      if (isRecent) {
        setActiveTab('skills')
      }
    }
  }, [skills, skillProposal.active])

  const handleRoutingChange = (text: string) => {
    setRoutingText(text)
    setError(null)
    if (!hasEdited) setHasEdited(true)
  }

  const handleModelsChange = (text: string) => {
    setModelsText(text)
    setError(null)
    if (!hasEdited) setHasEdited(true)
  }

  const handleSaveRouting = () => {
    const result = parseRoutingConfig(routingText)
    if ('error' in result) {
      setError(result.error)
      return
    }

    dispatch({ type: 'UPDATE_ROUTING_CONFIG', config: result })
    dispatch({ type: 'TRIGGER_CONFIG_RIPPLE' })
    setTimeout(() => dispatch({ type: 'CLEAR_CONFIG_RIPPLE' }), 600)
    setError(null)
  }

  const handleSaveModels = () => {
    const result = parseModelsConfig(modelsText)
    if ('error' in result) {
      setError(result.error)
      return
    }

    // Apply each tier's config
    const { modelConfig } = result
    dispatch({ type: 'SET_MODEL_CONFIG', tier: 1, config: modelConfig.tier1 })
    dispatch({ type: 'SET_MODEL_CONFIG', tier: 2, config: modelConfig.tier2 })
    dispatch({ type: 'SET_MODEL_CONFIG', tier: 3, config: modelConfig.tier3 })
    dispatch({ type: 'TRIGGER_CONFIG_RIPPLE' })
    setTimeout(() => dispatch({ type: 'CLEAR_CONFIG_RIPPLE' }), 600)
    setError(null)
  }

  const isEditable = activeTab === 'routing' || activeTab === 'models'

  return (
    <div className="w-96 flex flex-col border-l border-grove-border bg-grove-bg2 relative">
      {/* Config Ripple Animation */}
      {configRipple && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-grove-amber/20 animate-ripple" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-grove-border overflow-x-auto">
        <TabButton
          label="routing.config"
          active={activeTab === 'routing'}
          onClick={() => setActiveTab('routing')}
        />
        <TabButton
          label="zones.schema"
          active={activeTab === 'zones'}
          onClick={() => setActiveTab('zones')}
        />
        <TabButton
          label="models.config"
          active={activeTab === 'models'}
          onClick={() => setActiveTab('models')}
          highlight={state.mode === 'interactive'}
        />
        <TabButton
          label="skills.library"
          active={activeTab === 'skills'}
          onClick={() => setActiveTab('skills')}
          badge={skills.length > 0 ? skills.length.toString() : undefined}
        />
      </div>

      {/* Editor */}
      <div className={`
        flex-1 p-4 overflow-y-auto
        ${!hasEdited && isEditable ? 'animate-pulse-border' : ''}
      `}>
        {activeTab === 'routing' && (
          <SyntaxHighlightedEditor
            value={routingText}
            onChange={handleRoutingChange}
          />
        )}
        {activeTab === 'zones' && (
          <SyntaxHighlightedYaml text={zonesText} />
        )}
        {activeTab === 'models' && (
          <SyntaxHighlightedEditor
            value={modelsText}
            onChange={handleModelsChange}
          />
        )}
        {activeTab === 'skills' && (
          <SyntaxHighlightedYaml text={skillsText} />
        )}
      </div>

      {/* Validation & Save */}
      <div className="border-t border-grove-border p-3 flex items-center justify-between">
        <div className="text-xs">
          {error ? (
            <span className="text-grove-red">✗ {error}</span>
          ) : isEditable ? (
            <span className="text-grove-green">✓ Valid</span>
          ) : (
            <span className="text-grove-text-dim">Read-only</span>
          )}
        </div>
        {activeTab === 'routing' && (
          <button
            onClick={handleSaveRouting}
            className="bg-grove-amber hover:bg-grove-amber-bright text-white px-4 py-1 text-sm font-medium transition-colors"
          >
            Apply Changes
          </button>
        )}
        {activeTab === 'models' && (
          <button
            onClick={handleSaveModels}
            className="bg-grove-amber hover:bg-grove-amber-bright text-white px-4 py-1 text-sm font-medium transition-colors"
          >
            Apply Changes
          </button>
        )}
      </div>

      {/* First-edit hint */}
      {!hasEdited && isEditable && (
        <div className="absolute top-12 right-4 bg-grove-amber text-white text-xs px-2 py-1 shadow-lg animate-bounce">
          Edit me — changes apply instantly!
        </div>
      )}
    </div>
  )
}

interface TabButtonProps {
  label: string
  active: boolean
  onClick: () => void
  highlight?: boolean
  badge?: string
}

function TabButton({ label, active, onClick, highlight, badge }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-3 py-2 text-xs font-mono font-medium transition-colors whitespace-nowrap
        ${active
          ? 'text-grove-amber border-b-2 border-grove-amber'
          : highlight
            ? 'text-grove-yellow hover:text-grove-yellow/80'
            : 'text-grove-text-dim hover:text-grove-text-mid'
        }
      `}
    >
      {label}
      {badge && (
        <span className="absolute -top-1 -right-1 bg-tier-0 text-black text-[10px] px-1.5 font-bold">
          {badge}
        </span>
      )}
    </button>
  )
}

// =============================================================================
// SYNTAX HIGHLIGHTED YAML (Read-only)
// =============================================================================

interface SyntaxHighlightedYamlProps {
  text: string
}

function SyntaxHighlightedYaml({ text }: SyntaxHighlightedYamlProps) {
  const highlightedHtml = useMemo(() => highlightYaml(text), [text])

  return (
    <div
      className="yaml-viewer w-full min-h-[300px] overflow-auto"
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  )
}

// =============================================================================
// SYNTAX HIGHLIGHTED EDITOR (Editable)
// =============================================================================

interface SyntaxHighlightedEditorProps {
  value: string
  onChange: (value: string) => void
}

function SyntaxHighlightedEditor({ value, onChange }: SyntaxHighlightedEditorProps) {
  const highlightedHtml = useMemo(() => highlightYaml(value), [value])
  const backdropRef = useRef<HTMLDivElement>(null)

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = e.currentTarget.scrollTop
      backdropRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  return (
    <div className="yaml-editor-container">
      {/* Syntax highlighted backdrop */}
      <div
        ref={backdropRef}
        className="yaml-editor-backdrop"
        dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }}
        aria-hidden="true"
      />
      {/* Transparent textarea for editing */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className="yaml-editor-input"
        spellCheck={false}
      />
    </div>
  )
}
