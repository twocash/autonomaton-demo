/**
 * Deck Slides — All 13 slides as React components
 *
 * NOTE: Copy is preserved exactly from grove-autonomaton-deck.html
 * Only framing and end card may be modified per user constraint.
 */

import { Slide, Display, Headline, Subtitle, Lodestar, BodyText, Divider, Tag } from '../Slide'
import {
  DeckCard,
  CodeBlock,
  Kw,
  Val,
  Cmt,
  Str,
  ZoneCard,
  TierRow,
  FlywheelStep,
  StatBox,
  Highlight,
  DeckPipeline,
  PrincipleRow,
} from '../primitives'

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 0: TITLE
// ─────────────────────────────────────────────────────────────────────────────
function SlideTitle({ active }: { active: boolean }) {
  return (
    <Slide active={active} variant="title" eyebrow="Architectural Pattern — Release 1.3" maxWidth="860px">
      <Display>
        The Grove<br /><em>Autonomaton</em><br />Pattern
      </Display>
      <Subtitle>
        Software that identifies its own issues, proposes its own fixes, and authors its own evolution — always inside zones you control.
      </Subtitle>
      <Lodestar>"Design is philosophy expressed through constraint."</Lodestar>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1: THE PROBLEM
// ─────────────────────────────────────────────────────────────────────────────
function SlideProblem({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part I — The Problem">
      <Headline>
        The reactive assistant<br /><em>paradigm is broken</em>
      </Headline>
      <div className="grid grid-cols-2 gap-12 mt-8">
        <div>
          <BodyText className="mb-4">
            Every agent story ends the same way: the agent wiped a database, exposed credentials, took unauthorized action — no audit trail, no governance, no way to explain what happened.
          </BodyText>
          <BodyText>
            An entire industry is bolting transparency onto architectures that were never designed for it. Observability platforms. Compliance layers. Post-hoc monitoring dashboards.
          </BodyText>
          <Highlight className="mt-5">
            <p><strong>This is not a tooling problem.</strong> It is an architecture problem. You can't observe your way out of a system designed to be opaque.</p>
          </Highlight>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-5">
            <StatBox num="55%" label="of IT teams concerned about sensitive data exposure from AI agents" />
            <StatBox num="52%" label="concerned about unauthorized agent actions with no human checkpoint" />
            <StatBox num="<50%" label="confident they could pass a compliance review on agent behavior" />
            <StatBox num="95%" label="of $30–40B enterprise GenAI investment showing zero measurable P&L return" />
          </div>
          <p className="font-mono text-[10px] text-grove-text-dim mt-2.5">
            Sources: Cloud Security Alliance 2025 · MIT Research · Dave Mariani / AtScale
          </p>
        </div>
      </div>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2: THE PROMISE
// ─────────────────────────────────────────────────────────────────────────────
function SlidePromise({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part II — The Promise" maxWidth="860px">
      <Headline>
        What the Autonomaton<br /><em>actually delivers</em>
      </Headline>
      <Divider />
      <div className="grid grid-cols-3 gap-8">
        <DeckCard num="01" title="Self-Identifying">
          Detects its own quality degradation through Digital Jidoka. Stops, surfaces diagnostic context, and pulls its own andon cord.
        </DeckCard>
        <DeckCard num="02" title="Self-Fixing">
          Analyzes failure patterns and proposes structured repairs. You review and approve. The fix deploys. Kaizen as architecture.
        </DeckCard>
        <DeckCard num="03" title="Self-Authoring">
          Observes production interactions, detects opportunities, drafts new capability specs, and builds them when approved.
        </DeckCard>
      </div>
      <Highlight className="mt-7">
        <p>The <strong>inside zones you control</strong> part is structural, not aspirational. The system cannot grant itself new authority. It can only propose expanding boundaries — a Yellow-zone action. Sovereignty is a schema, not a setting.</p>
      </Highlight>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3: THREE FOUNDATIONS
// ─────────────────────────────────────────────────────────────────────────────
function SlideFoundations({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part III — The Lineage">
      <Headline>
        Three intellectual<br /><em>foundations</em>
      </Headline>
      <div className="grid grid-cols-3 gap-8 mt-7">
        <DeckCard className="p-7">
          <div className="text-grove-text-dim text-[10px] font-mono tracking-[0.15em] mb-3.5">Clark &amp; Chalmers, 1998</div>
          <div className="font-serif text-[22px] text-grove-text mb-3">The Extended Mind</div>
          <div className="text-[13.5px] leading-relaxed text-grove-text-mid font-light">
            Otto's notebook <em className="text-grove-text">is</em> his memory. If it's reliably available, automatically consulted, and populated by him — it's cognition. The Autonomaton is not a tool you operate. It is part of how you think.
          </div>
          <div className="mt-4 font-mono text-[11px] text-grove-amber">STRUCTURAL PROPERTY → Extended cognition</div>
        </DeckCard>
        <DeckCard className="p-7">
          <div className="text-grove-text-dim text-[10px] font-mono tracking-[0.15em] mb-3.5">Toyota Production System</div>
          <div className="font-serif text-[22px] text-grove-text mb-3">Jidoka + Kaizen</div>
          <div className="text-[13.5px] leading-relaxed text-grove-text-mid font-light">
            Jidoka: stop the line when quality degrades. Kaizen: propose the fix. Together: manufacturing-grade quality discipline for AI cognition. The Grove Autonomaton does what neither did alone — it compounds.
          </div>
          <div className="mt-4 font-mono text-[11px] text-grove-amber">STRUCTURAL PROPERTY → Self-improvement</div>
        </DeckCard>
        <DeckCard className="p-7">
          <div className="text-grove-text-dim text-[10px] font-mono tracking-[0.15em] mb-3.5">IBM, 2001 + Comp. Reflection</div>
          <div className="font-serif text-[22px] text-grove-text mb-3">Autonomic Computing</div>
          <div className="text-[13.5px] leading-relaxed text-grove-text-mid font-light">
            Self-configuring, self-healing, self-optimizing, self-protecting systems. Combined with Computational Reflection — systems that can inspect and modify their own execution. The CS lineage for software that improves itself.
          </div>
          <div className="mt-4 font-mono text-[11px] text-grove-amber">STRUCTURAL PROPERTY → Self-management</div>
        </DeckCard>
      </div>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4: THE PIPELINE
// ─────────────────────────────────────────────────────────────────────────────
function SlidePipeline({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part IV — The Architecture">
      <Headline>
        The five-stage<br /><em>invariant pipeline</em>
      </Headline>
      <DeckPipeline />
      <div className="grid grid-cols-2 gap-8 mt-5">
        <div>
          <div className="py-4 border-b border-grove-border">
            <Tag>01</Tag>
            <span className="text-[13px] text-grove-text">Telemetry</span>
            <span className="block text-[12px] text-grove-text-dim mt-1.5">Zero-friction capture. System comes to the human. Every interaction is a structured entry.</span>
          </div>
          <div className="py-4 border-b border-grove-border">
            <Tag>02</Tag>
            <span className="text-[13px] text-grove-text">Recognition</span>
            <span className="block text-[12px] text-grove-text-dim mt-1.5">Intent classification, context enrichment, confidence scoring, risk assessment. The Cognitive Router decides tier + zone.</span>
          </div>
          <div className="py-4">
            <Tag>03</Tag>
            <span className="text-[13px] text-grove-text">Compilation</span>
            <span className="block text-[12px] text-grove-text-dim mt-1.5">Assembles context from memory, relevant skills, historical patterns, external enrichment. Complete picture before inference.</span>
          </div>
        </div>
        <div>
          <div className="py-4 border-b border-grove-border">
            <Tag>04</Tag>
            <span className="text-[13px] text-grove-text">Approval</span>
            <span className="block text-[12px] text-grove-text-dim mt-1.5">The sovereignty checkpoint. Green passes. Yellow surfaces a proposal and waits. Red surfaces information only. Always explicit.</span>
          </div>
          <div className="py-4">
            <Tag>05</Tag>
            <span className="text-[13px] text-grove-text">Execution</span>
            <span className="block text-[12px] text-grove-text-dim mt-1.5">The system acts. Every stage produces a trace — not because you added tracing, but because the pipeline uses its own trace data to improve.</span>
          </div>
          <Highlight className="mt-0">
            <p><strong>The pipeline is the invariant.</strong> Surfaces, models, skills, and capabilities change. The pipeline doesn't.</p>
          </Highlight>
        </div>
      </div>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5: COGNITIVE ROUTER
// ─────────────────────────────────────────────────────────────────────────────
function SlideRouter({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part V — The Cognitive Router">
      <Headline>
        Rightsize compute.<br /><em>Every. Single. Call.</em>
      </Headline>
      <div className="mt-7">
        <TierRow
          tier={0}
          name="Pattern Cache"
          description="Matched from previously confirmed skills. No model call."
          cost="FREE · instant"
          note="Runs on your hardware. Zero external dependency."
          isFirst
        />
        <TierRow
          tier={1}
          name="Cheap Cognition"
          description="Small, fast models — locally or inexpensive cloud."
          cost="~$0.001 / turn"
          note="Handles ~70% of requests. Today: cloud API. 2027: your laptop."
        />
        <TierRow
          tier={2}
          name="Premium Cognition"
          description="Larger models for nuanced analysis and multi-step reasoning."
          cost="~$0.01 / turn"
          note="Handles ~20% of requests. Cloud APIs earn their keep here."
        />
        <TierRow
          tier={3}
          name="Apex Cognition"
          description="Full agentic — file ops, code exec, multi-tool orchestration."
          cost="~$0.10 / turn"
          note="Reserved for ~10% of requests. Maximum capability and cost."
        />
      </div>
      <Highlight className="mt-6">
        <p><strong>The insight most agent architectures miss:</strong> every Tier 3 interaction that becomes a recognized pattern can migrate to Tier 0 — 100× cheaper, infinitely more private, zero external dependency. The architecture's natural dynamic is downward migration. The reverse tax.</p>
      </Highlight>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 6: SOVEREIGNTY GUARDRAILS
// ─────────────────────────────────────────────────────────────────────────────
function SlideZones({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part VI — Sovereignty Guardrails" maxWidth="900px">
      <Headline>
        Zone boundaries are<br /><em>declarative, not aspirational</em>
      </Headline>
      <div className="grid grid-cols-3 gap-5 mt-6">
        <ZoneCard
          zone="green"
          label="Green Zone"
          meaning="Autonomous Routine"
          description="Execute without asking. Confirmed patterns, low-risk operations. Things you've blessed by pattern or precedent. The system has earned this authority."
        />
        <ZoneCard
          zone="yellow"
          label="Yellow Zone"
          meaning="Supervised Proposals"
          description="Propose, but you approve. New skills, medium-risk operations, below confidence threshold. The system does the thinking; you make the call."
        />
        <ZoneCard
          zone="red"
          label="Red Zone"
          meaning="Human-Only"
          description="Architecture decisions, security changes, production deployments. The system surfaces information and waits. It does not propose here."
        />
      </div>
      <div className="mt-6">
        <CodeBlock label="zones.schema — your sovereignty guardrail">
          <Kw>zones:</Kw>{'\n'}
          {'  '}<Kw>green:</Kw>   <Cmt># execute_confirmed_skills · write_telemetry</Cmt>{'\n'}
          {'  '}<Kw>yellow:</Kw>  <Cmt># propose_new_skill · propose_rule_change</Cmt>{'\n'}
          {'  '}<Kw>red:</Kw>     <Cmt># surface_information_only</Cmt>
        </CodeBlock>
      </div>
      <p className="text-[13px] text-grove-text-dim mt-4 leading-relaxed">
        Zone boundaries are declared in config, not hardcoded. As trust develops, actions migrate Yellow → Green. The system <em className="text-grove-text">earns</em> autonomy through demonstrated reliability — not by assertion.
      </p>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 7: SKILL FLYWHEEL
// ─────────────────────────────────────────────────────────────────────────────
function SlideFlywheel({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part VII — The Skill Flywheel">
      <Headline>
        Approve the <em>pattern</em>,<br />not the instance
      </Headline>
      <div className="grid grid-cols-3 gap-3 mt-6">
        <FlywheelStep num={1} title="OBSERVE" description="Log every interaction with structured metadata: intent, tier, zone, cost, human feedback." />
        <FlywheelStep num={2} title="DETECT" description="Same normalized intent pattern 3+ times in 14 days → surface as candidate skill." />
        <FlywheelStep num={3} title="PROPOSE" description={`"I noticed you always deep-dive GitHub repos before meetings. Want me to do that automatically?"`} />
        <FlywheelStep num={4} title="APPROVE" description="One approval enables unlimited future executions. You bless the pattern. Yellow-zone action." />
        <FlywheelStep num={5} title="EXECUTE" description="Skill runs automatically on matching future intents. Now a Green-zone action. Tier 0 cache." />
        <FlywheelStep num={6} title="REFINE" description="Usage data and corrections improve the skill. Stale skills deprecate. Evolved skills update." />
      </div>
      <Highlight className="mt-5">
        <p>The system's intelligence is <strong>a library with a card catalog, not a black box with a confidence score</strong>. Every skill is inspectable, correctable, deletable. You own the model of how you work.</p>
      </Highlight>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 8: TRANSPARENCY BY CONSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────
function SlideTransparency({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part VIII — Transparency as Architecture">
      <Headline>
        Governance comes<br /><em>free with the architecture</em>
      </Headline>
      <div className="grid grid-cols-2 gap-10 mt-7">
        <div>
          <BodyText className="mb-5">
            Every architectural commitment produces inherent auditability. This is not bolted-on compliance. It is a structural consequence of how the system works.
          </BodyText>
          <div className="py-3.5 border-b border-grove-border">
            <div className="font-mono text-[11px] text-grove-amber mb-1.5">DECLARATIVE GOVERNANCE</div>
            <div className="text-[13px] text-grove-text-mid">Every decision traces to an explicit, version-controlled rule. "Why did the system do that?" → point to a config file anyone can read.</div>
          </div>
          <div className="py-3.5 border-b border-grove-border">
            <div className="font-mono text-[11px] text-grove-amber mb-1.5">FEED-FIRST TELEMETRY</div>
            <div className="text-[13px] text-grove-text-mid">The audit trail isn't something you add. It's something the system produces as a byproduct of operating.</div>
          </div>
          <div className="py-3.5 border-b border-grove-border">
            <div className="font-mono text-[11px] text-grove-amber mb-1.5">SOVEREIGNTY GUARDRAILS</div>
            <div className="text-[13px] text-grove-text-mid">"What can the agent do without human approval?" → hand them a document, not a codebase walkthrough.</div>
          </div>
          <div className="py-3.5">
            <div className="font-mono text-[11px] text-grove-amber mb-1.5">DIGITAL JIDOKA</div>
            <div className="text-[13px] text-grove-text-mid">System surfaces its own failures with diagnostic context. No silent degradation. No confident output from an uncertain pipeline.</div>
          </div>
        </div>
        <div>
          <DeckCard className="mb-5">
            <div className="text-[10px] font-mono text-[#8B3D10] tracking-[0.15em] mb-3">Regulatory Timeline</div>
            <div className="text-[13.5px] leading-[1.8] text-grove-text-mid">
              <span className="text-grove-amber">Jun 30, 2026</span> — Colorado AI Act effective<br />
              <span className="text-grove-amber">Aug 2, 2026</span> — EU AI Act full enforcement<br />
              <span className="text-grove-amber">2026</span> — Texas TRAIGA live<br />
              <span className="text-grove-amber">2026</span> — SEC makes AI governance top priority
            </div>
          </DeckCard>
          <Highlight className="mt-0">
            <p>Every property regulators demand — traceability, explainability, risk classification, audit trails, human oversight — is a <strong>structural consequence</strong> of how the Grove Autonomaton works. The governance is done. It came with the architecture.</p>
          </Highlight>
        </div>
      </div>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 9: THE RATCHET
// ─────────────────────────────────────────────────────────────────────────────
function SlideRatchet({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part IX — The Ratchet" maxWidth="920px">
      <Headline>
        The reverse tax:<br /><em>more use = lower cost</em>
      </Headline>
      {/* Ratchet visual */}
      <div className="flex items-stretch gap-0 mt-7 h-20">
        <div className="flex-1 flex flex-col justify-center items-center font-mono text-[11px] border border-grove-border bg-[rgba(212,98,26,0.18)]">
          <div className="text-grove-text text-[12px]">TIER 3</div>
          <div className="text-grove-text-dim text-[10px] mt-1">Apex · ~$0.10</div>
        </div>
        <div className="flex items-center px-2 text-[14px] text-[#8B3D10]">↓</div>
        <div className="flex-1 flex flex-col justify-center items-center font-mono text-[11px] border border-grove-border bg-[rgba(212,98,26,0.10)]">
          <div className="text-grove-text text-[12px]">TIER 2</div>
          <div className="text-grove-text-dim text-[10px] mt-1">Premium · ~$0.01</div>
        </div>
        <div className="flex items-center px-2 text-[14px] text-[#8B3D10]">↓</div>
        <div className="flex-1 flex flex-col justify-center items-center font-mono text-[11px] border border-grove-border bg-[rgba(212,98,26,0.05)]">
          <div className="text-grove-text text-[12px]">TIER 1</div>
          <div className="text-grove-text-dim text-[10px] mt-1">Cheap · ~$0.001</div>
        </div>
        <div className="flex items-center px-2 text-[14px] text-[#8B3D10]">↓</div>
        <div className="flex-1 flex flex-col justify-center items-center font-mono text-[11px] border border-grove-border bg-[rgba(76,175,114,0.12)]">
          <div className="text-grove-green text-[12px]">TIER 0</div>
          <div className="text-grove-text-dim text-[10px] mt-1">Cache · FREE</div>
        </div>
      </div>
      <div className="mt-2 font-mono text-[11px] text-grove-amber text-center tracking-[0.1em]">
        EVERY MIGRATION IMPROVES ALL FOUR SIMULTANEOUSLY
      </div>
      <div className="grid grid-cols-4 gap-3 mt-5">
        <DeckCard className="p-4">
          <div className="font-mono text-[18px] text-grove-amber mb-1.5">$</div>
          <div className="text-[13px] text-grove-text mb-1">Cheaper</div>
          <div className="text-[12px] text-grove-text-dim">Cost curve bends down automatically</div>
        </DeckCard>
        <DeckCard className="p-4">
          <div className="font-mono text-[18px] text-grove-amber mb-1.5">P</div>
          <div className="text-[13px] text-grove-text mb-1">More Private</div>
          <div className="text-[12px] text-grove-text-dim">Local execution, no external call</div>
        </DeckCard>
        <DeckCard className="p-4">
          <div className="font-mono text-[18px] text-grove-amber mb-1.5">S</div>
          <div className="text-[13px] text-grove-text mb-1">More Sovereign</div>
          <div className="text-[12px] text-grove-text-dim">Less dependent on rented compute</div>
        </DeckCard>
        <DeckCard className="p-4">
          <div className="font-mono text-[18px] text-grove-amber mb-1.5">◎</div>
          <div className="text-[13px] text-grove-text mb-1">More Traceable</div>
          <div className="text-[12px] text-grove-text-dim">Cached skills are maximally auditable</div>
        </DeckCard>
      </div>
      <p className="text-[13px] text-grove-text-dim mt-4.5 leading-relaxed">
        METR data: frontier AI capabilities propagate to consumer hardware on a <strong className="text-grove-text">21-month lag</strong> with a <strong className="text-grove-text">constant 8× performance gap</strong>. What requires cloud-scale inference today runs locally in 2027. Six years of data. Exponential fit. R² &gt; 0.95. The router doesn't change when models improve — it's a config update.
      </p>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 10: BUILD IT THIS WEEKEND
// ─────────────────────────────────────────────────────────────────────────────
function SlideBuild({ active }: { active: boolean }) {
  return (
    <Slide active={active} eyebrow="Part X — Build It This Weekend">
      <Headline>
        Three files.<br /><em>One loop. Done.</em>
      </Headline>
      <div className="grid grid-cols-3 gap-5 mt-6">
        <CodeBlock label="File 1 — routing.config">
          <Cmt># routing.config</Cmt>{'\n'}
          <Kw>intents:</Kw>{'\n'}
          {'  '}<Kw>capture_idea:</Kw>{'\n'}
          {'    '}<Kw>tier:</Kw> <Val>1</Val>{'\n'}
          {'    '}<Kw>zone:</Kw> <Val>green</Val>{'\n'}
          {'  '}<Kw>propose_skill:</Kw>{'\n'}
          {'    '}<Kw>tier:</Kw> <Val>2</Val>{'\n'}
          {'    '}<Kw>zone:</Kw> <Val>yellow</Val>{'\n'}
          {'  '}<Kw>deploy_production:</Kw>{'\n'}
          {'    '}<Kw>tier:</Kw> <Val>3</Val>{'\n'}
          {'    '}<Kw>zone:</Kw> <Val>red</Val>
        </CodeBlock>
        <CodeBlock label="File 2 — zones.schema">
          <Cmt># zones.schema</Cmt>{'\n'}
          <Kw>zones:</Kw>{'\n'}
          {'  '}<Kw>green:</Kw>{'\n'}
          {'    '}<Kw>allows:</Kw>{'\n'}
          {'      '}- <Val>execute_confirmed_skills</Val>{'\n'}
          {'      '}- <Val>write_telemetry</Val>{'\n'}
          {'  '}<Kw>yellow:</Kw>{'\n'}
          {'    '}<Kw>allows:</Kw>{'\n'}
          {'      '}- <Val>propose_new_skill</Val>{'\n'}
          {'  '}<Kw>red:</Kw>{'\n'}
          {'    '}<Kw>allows:</Kw>{'\n'}
          {'      '}- <Val>surface_information_only</Val>
        </CodeBlock>
        <CodeBlock label="File 3 — telemetry.log">
          <Str>{`{
  "ts": "2026-02-28T17:02Z",
  "intent": "propose_skill",
  "tier": 2,
  "zone": "yellow",
  "pattern_hash": "b1c2…",
  "confidence": 0.78,
  "cost_usd": 0.012,
  "feedback": "approved"
}`}</Str>
        </CodeBlock>
      </div>
      <div className="grid grid-cols-4 gap-3 mt-5">
        <div className="border border-grove-border p-3.5">
          <div className="font-mono text-[10px] text-grove-amber mb-1.5">SAT MORNING</div>
          <div className="text-[12px] text-grove-text-dim">Define routing config + zone schema. List 5–10 intents. Classify each by tier + zone.</div>
        </div>
        <div className="border border-grove-border p-3.5">
          <div className="font-mono text-[10px] text-grove-amber mb-1.5">SAT AFTERNOON</div>
          <div className="text-[12px] text-grove-text-dim">Build the router. Read config, classify intent, check zone, dispatch. Log every decision.</div>
        </div>
        <div className="border border-grove-border p-3.5">
          <div className="font-mono text-[10px] text-grove-amber mb-1.5">SUN MORNING</div>
          <div className="text-[12px] text-grove-text-dim">Build Flywheel detector. Read telemetry, group by pattern hash, surface proposals.</div>
        </div>
        <div className="border border-grove-border p-3.5">
          <div className="font-mono text-[10px] text-grove-amber mb-1.5">SUN AFTERNOON</div>
          <div className="text-[12px] text-grove-text-dim">Wire approval flow. Approved skills → skills dir → Tier 0 cache. You're done.</div>
        </div>
      </div>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 11: SEVEN PRINCIPLES
// ─────────────────────────────────────────────────────────────────────────────
function SlidePrinciples({ active }: { active: boolean }) {
  return (
    <Slide active={active} variant="scroll" eyebrow="Part XI — The Quality Bar">
      <Headline>
        Seven principles.<br /><em>Every architectural decision.</em>
      </Headline>
      <div className="mt-5">
        <PrincipleRow
          title="Extended Mind"
          description="Does this decision complete the cognitive architecture — or add to the cognitive burden? Build for the person with the least overhead to spare. The result works better for everyone."
          isFirst
        />
        <PrincipleRow
          title="Pattern-Based Approval"
          description="Approve categories of action, not individual instances. One approval enables unlimited future executions. Decide once, trust the execution."
        />
        <PrincipleRow
          title="Feed-First"
          description="Every interaction generates structured telemetry. Without it, the system can't learn. Without learning, it can't improve. Without the audit trail, it can't be trusted at scale."
        />
        <PrincipleRow
          title="Async-First"
          description="State persists in durable storage, not ephemeral memory. Sessions resume. Context carries across devices. The system never forces the human to reconstruct what happened before."
        />
        <PrincipleRow
          title="Self-Improving"
          description="The system identifies its own limitations, surfaces them, and dispatches fixes. A system that can't evolve is a static tool with a depreciation curve."
        />
        <PrincipleRow
          title="Composable"
          description="Capabilities are pluggable modules, not monolithic features. The architecture is designed for capabilities that don't exist yet, not just the ones that do."
        />
        <PrincipleRow
          title="Model Independence as Architecture"
          description="The cognitive layer is a swappable dependency. The moment your architecture assumes a specific model, you've handed your system's future to whoever controls that model. This is not a design preference. It's a sovereignty guarantee."
        />
      </div>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 12: THE BIGGER PICTURE (End Card)
// ─────────────────────────────────────────────────────────────────────────────
function SlideFinal({ active }: { active: boolean }) {
  return (
    <Slide active={active} variant="last" eyebrow="Part XII — The Bigger Picture" maxWidth="900px">
      <Headline>
        Models are seeds.<br /><em>Architecture is soil.</em>
      </Headline>
      <div className="grid grid-cols-2 gap-10 mt-7 items-start">
        <div>
          <BodyText className="mb-4">
            The current AI buildout is mainframe thinking. $650 billion. Four companies. One year. Whoever controls the frontier controls AI.
          </BodyText>
          <BodyText className="mb-4">
            What if that assumption is wrong — and the money gets spent anyway?
          </BodyText>
          <BodyText>
            Two billion personal computers exist worldwide. Hundreds of millions can run local AI today. This distributed compute <em className="text-grove-text">already dwarfs any planned data center buildout</em> — deployed, powered, and owned by the people who benefit from what it produces.
          </BodyText>
          <Highlight className="mt-6">
            <p>The internet didn't beat mainframes by being more powerful. <strong>It beat them by being architecturally uncontrollable.</strong> The Grove Autonomaton Pattern is the internet play for AI.</p>
          </Highlight>
        </div>
        <div>
          <DeckCard className="mb-5 p-6">
            <div className="text-[10px] font-mono text-[#8B3D10] tracking-[0.15em] mb-3">The Test</div>
            <div className="text-[13.5px] leading-[1.9] text-grove-text-mid">
              ☐ Behavior governance in declarative config?<br />
              ☐ Cognitive Router enables downward migration?<br />
              ☐ Every action explicitly zone-classified?<br />
              ☐ New surface without writing cognitive code?<br />
              ☐ System learns from telemetry and proposes?<br />
              ☐ System fails honestly with diagnostic context?<br />
              ☐ Auditor can reconstruct any decision from telemetry?
            </div>
          </DeckCard>
          <p className="font-mono text-[12px] text-grove-amber">All yes → You built a Grove Autonomaton.</p>
          <p className="font-mono text-[12px] text-grove-text-dim mt-2">Any no → You know exactly what to fix.</p>
          <div className="mt-6 p-4 border border-grove-border">
            <div className="font-mono text-[10px] text-grove-amber mb-2">REFERENCE IMPLEMENTATION</div>
            <div className="font-mono text-[12px] text-grove-text-dim">Autonomaton Demo — github.com/twocash/autonomaton-demo</div>
            <div className="text-[12px] text-grove-text-dim mt-2">License: CC BY 4.0 — The pattern is open because the thesis requires it.</div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ALL SLIDES
// ─────────────────────────────────────────────────────────────────────────────
export const slideComponents = [
  SlideTitle,
  SlideProblem,
  SlidePromise,
  SlideFoundations,
  SlidePipeline,
  SlideRouter,
  SlideZones,
  SlideFlywheel,
  SlideTransparency,
  SlideRatchet,
  SlideBuild,
  SlidePrinciples,
  SlideFinal,
]

// Metadata for left navigation
export const slideMetadata = [
  { id: 'title', title: 'Introduction' },
  { id: 'problem', title: 'The Problem' },
  { id: 'promise', title: 'The Promise' },
  { id: 'foundations', title: 'The Lineage' },
  { id: 'pipeline', title: 'The Pipeline' },
  { id: 'router', title: 'Cognitive Router' },
  { id: 'zones', title: 'Sovereignty' },
  { id: 'flywheel', title: 'Skill Flywheel' },
  { id: 'transparency', title: 'Transparency' },
  { id: 'ratchet', title: 'The Ratchet' },
  { id: 'build', title: 'Build It' },
  { id: 'principles', title: 'Principles' },
  { id: 'final', title: 'Bigger Picture' },
]
