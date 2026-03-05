/**
 * Provenance Hash Generator
 *
 * Generates deterministic pseudo-hashes simulating an immutable audit trail.
 * In a production backend, this would be SHA-256 of the prompt, model version,
 * and config state — cryptographically proving which model processed each request.
 *
 * This proves Claim #9: Provenance as Infrastructure
 * A fact without a root is a weed — every interaction is traceable.
 */

export function generateProvenanceHash(
  interactionId: string,
  intent: string,
  model: string
): string {
  const payload = `${interactionId}:${intent}:${model}`
  let hash = 0
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  // Return a clean 7-character hex string (like a git commit hash)
  return Math.abs(hash).toString(16).substring(0, 7).padStart(7, '0')
}
