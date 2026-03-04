/**
 * PipelineVisualization — The Hero Element
 *
 * Every interaction traverses this five-stage pipeline.
 * This visual proves Claim #1: The pipeline is the invariant.
 *
 * The user watches their input flow through:
 * Telemetry → Recognition → Compilation → Approval → Execution
 *
 * Design: Strict geometry (no rounded), grove amber active state
 */

import { usePipeline, useAppDispatch } from '../../state/context'
import type { PipelineStage as PipelineStageType } from '../../state/types'
import { PipelineStage, STAGE_META } from './PipelineStage'
import { PipelineConnector } from './PipelineConnector'

const STAGES: PipelineStageType[] = [
  'telemetry',
  'recognition',
  'compilation',
  'approval',
  'execution',
]

export function PipelineVisualization() {
  const pipeline = usePipeline()
  const dispatch = useAppDispatch()

  return (
    <section className="border-b border-grove-border bg-grove-bg2 py-6">
      <div className="flex items-center justify-center">
        {STAGES.map((stage, idx) => (
          <div key={stage} className="flex items-center">
            <PipelineStage
              name={STAGE_META[stage].label}
              state={pipeline.stages[stage]}
              icon={STAGE_META[stage].icon}
            />

            {idx < STAGES.length - 1 && (
              <PipelineConnector
                fromState={pipeline.stages[stage]}
                toState={pipeline.stages[STAGES[idx + 1]]}
              />
            )}
          </div>
        ))}
      </div>

      {/* Halt reason display (Jidoka) */}
      {pipeline.halted && pipeline.haltReason && (
        <div className="mt-4 mx-auto max-w-2xl">
          <div className="bg-grove-red/10 border border-grove-red/50 p-4">
            <div className="flex items-center gap-2 text-grove-red font-medium mb-2">
              <span>🛑</span>
              <span>Pipeline Halted at {STAGE_META[pipeline.haltReason.stage]?.label}</span>
            </div>
            <p className="text-sm text-grove-red/80 mb-2">{pipeline.haltReason.error}</p>
            <div className="text-xs text-grove-text-dim">
              <span className="text-grove-text-dim">Expected: </span>
              {pipeline.haltReason.expected}
            </div>
            <div className="text-xs text-grove-amber mt-2">
              <span className="text-grove-text-dim">Proposed fix: </span>
              {pipeline.haltReason.proposedFix}
            </div>
            <button
              onClick={() => dispatch({ type: 'RESET_PIPELINE' })}
              className="mt-3 text-xs bg-grove-border hover:bg-grove-border-light text-grove-text px-3 py-1 transition-colors"
            >
              Clear &amp; Reset Pipeline
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
