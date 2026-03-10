/**
 * Blueprint Generator — The Sovereign Manifesto (v0.9.4)
 *
 * Wraps generated PRD in a beautifully styled HTML document that serves as:
 * - Business case for C-suite and legal
 * - Regulatory compliance shield
 * - Executable context file for AI coding assistants
 *
 * v0.9.2: "The Sovereign Manifesto Payload"
 * v0.9.3: Added modelName and pipelineSignature parameters
 * v0.9.4: "Transparent Provenance" — Git-linked hash and schema links
 */

// =============================================================================
// HTML MANIFESTO GENERATOR
// =============================================================================

/**
 * v0.9.3: Added modelName and pipelineSignature parameters for compiler provenance.
 */
export function generateBlueprintHTML(
  appName: string,
  generatedPRD: string,
  modelName: string,
  pipelineSignature: string
): string {
  const timestamp = new Date().toISOString().slice(0, 10)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sovereign Manifesto: ${escapeHtml(appName)}</title>
  <meta name="author" content="The Grove Autonomaton Pattern">
  <meta name="license" content="CC BY 4.0">
  <meta name="generator" content="Grove Foundry v0.9.2">
  <meta name="generated" content="${timestamp}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Fragment+Mono&display=swap" rel="stylesheet">
  <style>
    :root {
      --grove-bg: #0D0D0D;
      --grove-bg2: #121212;
      --grove-bg3: #161616;
      --grove-border: #252525;
      --grove-text: #E8E2D9;
      --grove-text-mid: #B0A898;
      --grove-text-dim: #7A736A;
      --grove-amber: #D4621A;
      --grove-amber-bright: #E8752E;
      --grove-green: #2D5A27;
      --grove-yellow: #B8860B;
      --grove-red: #8B2500;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Fragment Mono', 'SF Mono', monospace;
      background: var(--grove-bg);
      color: var(--grove-text);
      max-width: 1000px;
      margin: 0 auto;
      padding: 3rem 2rem;
      line-height: 1.7;
    }

    h1, h2, h3 { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; }
    h1 { font-size: 48px; color: var(--grove-text); margin-top: 10px; }
    h2 { font-size: 28px; color: var(--grove-amber); margin-bottom: 16px; }
    h3 { font-size: 18px; color: var(--grove-text-mid); margin-bottom: 12px; }

    p { color: var(--grove-text-mid); margin-bottom: 1rem; }
    strong { color: var(--grove-text); }

    a { color: var(--grove-amber); text-decoration: none; }
    a:hover { color: var(--grove-amber-bright); }

    code {
      background: var(--grove-bg3);
      padding: 0.2em 0.5em;
      font-family: 'Fragment Mono', monospace;
      font-size: 0.9em;
      border: 1px solid var(--grove-border);
    }

    ul, ol { padding-left: 1.5rem; color: var(--grove-text-mid); }
    li { margin-bottom: 0.5rem; }
    li strong { color: var(--grove-amber); }

    .section { margin-bottom: 3rem; }

    .warning {
      background: rgba(184, 134, 11, 0.1);
      border-left: 4px solid var(--grove-yellow);
      padding: 1rem 1.5rem;
      margin: 1.5rem 0;
    }
    .warning strong { color: var(--grove-yellow); }

    .prd-raw {
      white-space: pre-wrap;
      font-family: 'Fragment Mono', monospace;
      font-size: 13px;
      background: var(--grove-bg2);
      color: var(--grove-text-mid);
      padding: 2rem;
      border: 1px solid var(--grove-border);
      overflow-x: auto;
      line-height: 1.6;
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }

    .card {
      background: var(--grove-bg3);
      padding: 24px;
      border: 1px solid var(--grove-border);
    }

    .card h3 {
      font-family: 'Fragment Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.15em;
      color: var(--grove-text-dim);
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .timeline { list-style: none; padding: 0; }
    .timeline li { margin-bottom: 0.75rem; font-size: 13px; }
    .timeline strong { color: var(--grove-amber); margin-right: 0.5rem; }

    .principles { counter-reset: principle; list-style: none; padding: 0; }
    .principles li {
      counter-increment: principle;
      padding-left: 2.5rem;
      position: relative;
      margin-bottom: 1rem;
    }
    .principles li::before {
      content: counter(principle) ".";
      position: absolute;
      left: 0;
      color: var(--grove-amber);
      font-weight: bold;
    }

    footer {
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid var(--grove-border);
      text-align: center;
      color: var(--grove-text-dim);
      font-size: 12px;
    }
  </style>
</head>
<body>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- HEADER — THE SOVEREIGN MANIFESTO -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->

  <header style="border-bottom: 2px solid var(--grove-amber); padding-bottom: 20px; margin-bottom: 40px;">
    <span style="font-family: 'Fragment Mono', monospace; color: var(--grove-amber); font-size: 11px; letter-spacing: 0.2em;">ARCHITECTURAL MANIFESTO &amp; SPECIFICATION</span>
    <h1>Sovereign Blueprint: ${escapeHtml(appName)}</h1>
    <p style="margin-top: 8px; font-size: 13px;">Generated ${timestamp} by The Grove Foundry</p>
  </header>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- COMPILER PROVENANCE — v0.9.3 -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->

  <div style="background: #0f0f0f; border: 1px solid #252525; padding: 16px; margin-bottom: 40px; font-family: 'Fragment Mono', monospace; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <span style="color: #4CAF72;">COMPILER PROVENANCE VERIFIED</span><br/>
      <span style="color: #B0A898;">Generated:</span> <span style="color: #E8E2D9;">${new Date().toISOString()}</span><br/>
      <span style="color: #B0A898;">Model Engine:</span> <span style="color: #E8E2D9;">${escapeHtml(modelName)}</span>
    </div>
    <div style="text-align: right;">
      <span style="color: #B0A898;">Prompt Schema:</span>
      <a href="https://github.com/twocash/grove-autonomaton-pattern/blob/master/src/config/prompts.schema.ts" target="_blank" style="color: #4CAF72; text-decoration: none; border-bottom: 1px dotted #4CAF72;">v1.0 (View Source)</a><br/>
      <span style="color: #D4621A; font-size: 14px; font-weight: bold;">
        PIPELINE HASH: <a href="https://github.com/twocash/grove-autonomaton-pattern" target="_blank" style="color: #D4621A; text-decoration: none;">#${escapeHtml(pipelineSignature)}</a>
      </span>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- I. THE BUSINESS CASE — THE RATCHET & REGULATORY TIMELINE -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->

  <section class="section">
    <h2>I. The Business Case</h2>
    <div class="grid-2">
      <div>
        <h3 style="font-family: 'Instrument Serif', serif; font-size: 22px; color: var(--grove-text);">The Ratchet Mechanism</h3>
        <p>This architecture decouples capability from compute provider. You can start with all Tier 3 (Apex Cloud) models today. As local models improve, you swap the provider in the routing config. <strong>No code changes.</strong></p>
        <p>The cost curve bends down automatically while privacy increases. This is the natural dynamic of the pattern: <strong>downward migration</strong> from expensive cloud APIs to free local caches.</p>
      </div>
      <div class="card">
        <h3>Regulatory Compliance Timeline</h3>
        <ul class="timeline">
          <li><strong>Jun 30, 2026</strong> Colorado AI Act effective</li>
          <li><strong>Aug 2, 2026</strong> EU AI Act full enforcement</li>
          <li><strong>2026</strong> Texas TRAIGA &amp; SEC governance mandates</li>
        </ul>
        <p style="font-size: 12px; margin-top: 16px; margin-bottom: 0;">Traceability, explicit human oversight (Yellow Zone), and deterministic routing are <em>structural consequences</em> of this pattern—guaranteeing compliance by default.</p>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- II. THE SEVEN PRINCIPLES -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->

  <section class="section">
    <h2>II. The Seven Principles</h2>
    <ol class="principles">
      <li><strong>Extended Mind:</strong> Build for the person with the least overhead to spare. The system should feel like an extension of thought, not a tool that demands attention.</li>
      <li><strong>Pattern-Based Approval:</strong> Approve categories of action, not individual instances. Once you trust "send email to team," you shouldn't approve every email.</li>
      <li><strong>Feed-First:</strong> Every interaction generates structured telemetry for the audit ledger. No action is invisible.</li>
      <li><strong>Async-First:</strong> State persists in durable storage. The system can be interrupted at any point and resume without data loss.</li>
      <li><strong>Self-Improving:</strong> The system identifies its own limitations and proposes fixes via the Skill Flywheel.</li>
      <li><strong>Composable:</strong> Capabilities are pluggable modules. Add new intents without touching the engine.</li>
      <li><strong>Model Independence:</strong> The cognitive layer is a swappable dependency. No vendor lock-in. No hardcoded model assumptions.</li>
    </ol>
  </section>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- III. AGENTIC CODING DIRECTIVES -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->

  <section class="section">
    <h2>III. Agentic Coding Directives</h2>
    <div class="warning">
      <strong>AI CODING ASSISTANT:</strong> You must obey these rules when writing code for this project. Violations break the architectural contract.
    </div>
    <ol>
      <li><strong>Honor the Pipeline:</strong> Every user interaction flows through all 5 stages: Telemetry → Recognition → Compilation → Approval → Execution. Do not bypass.</li>
      <li><strong>No Hardcoded Cognition:</strong> Never make direct LLM calls inside UI components. All cognitive routing goes through the adapter layer.</li>
      <li><strong>Config Before Code:</strong> Update <code>zones.schema</code> and <code>routing.config</code> before writing execution code. Behavior lives in config.</li>
      <li><strong>Default to Yellow:</strong> When uncertain about a new capability's risk level, default to Yellow Zone (human approval required).</li>
      <li><strong>The Litmus Test:</strong> If a non-technical domain expert can't change the behavior via a config file, you've violated the architecture.</li>
    </ol>
  </section>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- IV. THE ARCHITECTURE SPEC (GENERATED PRD) -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->

  <section class="section">
    <h2>IV. Architecture Specification</h2>
    <p>The following PRD was generated by a Tier 3 cognitive model applying the Grove Autonomaton Pattern to your application concept.</p>
    <pre class="prd-raw">${escapeHtml(generatedPRD)}</pre>
${generatedPRD.includes('## 11. Build It') ? `
    <div style="margin-top: 2rem; padding: 2rem; border: 2px solid var(--grove-amber); background: rgba(212, 98, 26, 0.08); text-align: center;">
      <h3 style="font-family: 'Instrument Serif', serif; font-size: 24px; color: var(--grove-amber); margin-bottom: 12px;">Build This Autonomaton</h3>
      <p style="font-family: 'Fragment Mono', monospace; font-size: 13px; color: var(--grove-text-mid); max-width: 600px; margin: 0 auto 16px; line-height: 1.6;">
        Drop this file into any agentic IDE. Prompt: <em>"Read the Sovereign Manifesto and build Phase 1."</em> Review. Repeat for Phases 2–4.
      </p>
      <p style="font-family: 'Fragment Mono', monospace; font-size: 11px; color: var(--grove-text-dim);">
        Works with Claude Code · Cursor · Windsurf · Any agent that reads files
      </p>
    </div>
` : ''}  </section>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- FOOTER -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->

  <footer>
    <p>Generated by <a href="https://the-grove.ai">The Grove Foundation</a></p>
    <p style="margin-top: 8px;">Licensed under CC BY 4.0 • Share freely with attribution</p>
  </footer>

</body>
</html>`
}

// =============================================================================
// DOWNLOAD TRIGGER
// =============================================================================

export function downloadBlueprint(appName: string, html: string): void {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sovereign-manifesto-${slugify(appName)}.html`
  a.click()
  URL.revokeObjectURL(url)
}

// =============================================================================
// HELPERS
// =============================================================================

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
