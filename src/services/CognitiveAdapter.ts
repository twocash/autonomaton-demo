/**
 * CognitiveAdapter — Dynamic Provider Factory
 *
 * This proves Claim #8: Model Independence.
 * The pipeline doesn't know how to talk to Claude or Gemini;
 * it hands the prompt and tier config to this factory.
 *
 * BYOK (Bring Your Own Key) Architecture:
 * - API keys stay in browser memory, never persisted
 * - Uses official SDKs with browser-safe flags
 * - Graceful degradation triggers Jidoka on failure
 */

import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import type { ModelConfig } from '../state/types'

export interface CognitiveResult {
  text: string
  tokensIn?: number
  tokensOut?: number
}

/**
 * Execute a cognitive request against the configured provider.
 * Throws on missing API key or provider errors (triggers Jidoka).
 */
export async function executeCognitiveRequest(
  prompt: string,
  tierConfig: ModelConfig
): Promise<CognitiveResult> {
  const { provider, model, apiKey } = tierConfig

  // Check for missing API key (except local_memory)
  if (provider !== 'local_memory' && (!apiKey || apiKey.trim() === '')) {
    throw new Error(`Missing API Key for provider: ${provider}. Update models.config.`)
  }

  try {
    switch (provider.toLowerCase()) {
      case 'anthropic':
        return await executeAnthropic(prompt, model, apiKey!)

      case 'google':
        return await executeGoogle(prompt, model, apiKey!)

      case 'openai':
        return await executeOpenAI(prompt, model, apiKey!)

      case 'local_memory':
        // Tier 0 / Cached Skills — instant local response
        return {
          text: `[Cached Skill Execution]: Processed "${prompt}" automatically.`,
          tokensIn: 0,
          tokensOut: 0,
        }

      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  } catch (error) {
    // Re-throw with provider context for Jidoka display
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Provider API Error (${provider}): ${message}`)
  }
}

// =============================================================================
// PROVIDER IMPLEMENTATIONS
// =============================================================================

async function executeAnthropic(
  prompt: string,
  model: string,
  apiKey: string
): Promise<CognitiveResult> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for BYOK local apps
  })

  const response = await client.messages.create({
    model: model || 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  // Extract text from response using type predicate for proper narrowing
  const textBlock = response.content.find((block): block is Anthropic.TextBlock => block.type === 'text')
  const text = textBlock?.text ?? ''

  return {
    text,
    tokensIn: response.usage?.input_tokens,
    tokensOut: response.usage?.output_tokens,
  }
}

async function executeGoogle(
  prompt: string,
  model: string,
  apiKey: string
): Promise<CognitiveResult> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const geminiModel = genAI.getGenerativeModel({
    model: model || 'gemini-1.5-pro',
  })

  const result = await geminiModel.generateContent(prompt)
  const response = result.response
  const text = response.text()

  // Gemini exposes token counts via usageMetadata
  const usage = response.usageMetadata
  return {
    text,
    tokensIn: usage?.promptTokenCount,
    tokensOut: usage?.candidatesTokenCount,
  }
}

async function executeOpenAI(
  prompt: string,
  model: string,
  apiKey: string
): Promise<CognitiveResult> {
  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for BYOK local apps
  })

  const response = await client.chat.completions.create({
    model: model || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.choices[0]?.message?.content || ''

  return {
    text,
    tokensIn: response.usage?.prompt_tokens,
    tokensOut: response.usage?.completion_tokens,
  }
}

// =============================================================================
// STREAMING IMPLEMENTATIONS (v0.9.0 — Foundry)
// =============================================================================

/**
 * Stream a cognitive request for real-time display.
 * Used by the Foundry for live PRD generation.
 */
export async function* streamCognitiveRequest(
  prompt: string,
  systemPrompt: string,
  tierConfig: ModelConfig
): AsyncGenerator<string, void, unknown> {
  const { provider, model, apiKey } = tierConfig

  if (!apiKey || apiKey.trim() === '') {
    throw new Error(`Missing API Key for provider: ${provider}. Update models.config.`)
  }

  switch (provider.toLowerCase()) {
    case 'anthropic':
      yield* streamAnthropic(prompt, systemPrompt, model, apiKey)
      break
    case 'openai':
      yield* streamOpenAI(prompt, systemPrompt, model, apiKey)
      break
    case 'google':
      yield* streamGoogle(prompt, systemPrompt, model, apiKey)
      break
    default:
      throw new Error(`Streaming not supported for provider: ${provider}`)
  }
}

async function* streamAnthropic(
  prompt: string,
  systemPrompt: string,
  model: string,
  apiKey: string
): AsyncGenerator<string, void, unknown> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const stream = client.messages.stream({
    model: model || 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text
    }
  }
}

async function* streamOpenAI(
  prompt: string,
  systemPrompt: string,
  model: string,
  apiKey: string
): AsyncGenerator<string, void, unknown> {
  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const stream = await client.chat.completions.create({
    model: model || 'gpt-4o',
    max_tokens: 4096,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) yield content
  }
}

async function* streamGoogle(
  prompt: string,
  systemPrompt: string,
  model: string,
  apiKey: string
): AsyncGenerator<string, void, unknown> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const gemini = genAI.getGenerativeModel({
    model: model || 'gemini-1.5-pro',
    systemInstruction: systemPrompt,
  })

  const result = await gemini.generateContentStream(prompt)
  for await (const chunk of result.stream) {
    yield chunk.text()
  }
}
