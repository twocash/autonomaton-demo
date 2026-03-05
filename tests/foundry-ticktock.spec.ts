/**
 * Foundry Ticktock Test — v0.9.3
 *
 * Verifies that the Compiler Ledger (preflight telemetry) appears
 * before the LLM stream begins.
 *
 * Run headed: npx playwright test tests/foundry-ticktock.spec.ts --headed
 */

import { test, expect } from '@playwright/test'

test.describe('Foundry Compiler Ledger', () => {
  test('should show ticktock logs before LLM stream', async ({ page }) => {
    // Navigate to Foundry
    await page.goto('http://localhost:5180/autonomaton/')

    // Wait for page to load
    await page.waitForSelector('text=Grove Autonomaton Pattern')

    // Click on Foundry tab
    await page.click('text=The Foundry')

    // Wait for Foundry pane to load
    await page.waitForSelector('text=The Architect\'s Foundry')

    // User needs to enter API key in the Sandbox → Model Config
    // Give user time to do this
    console.log('\n===========================================')
    console.log('ACTION REQUIRED: Enter your Tier 3 API key')
    console.log('1. Click "Interactive Sandbox" tab')
    console.log('2. Find the API Key input and enter your key')
    console.log('3. Return to "The Foundry" tab')
    console.log('===========================================\n')

    // Wait for user to configure API key (60 seconds)
    await page.waitForTimeout(60000)

    // Enter app description
    await page.fill('textarea', 'A simple todo list application with task priorities')

    // Click compile button
    await page.click('button:has-text("Compile Architecture")')

    // Wait for compiler ledger to appear in TelemetryStream section
    const ledger = page.locator('.terminal-stream >> text=Compiler Ledger')
    await expect(ledger).toBeVisible({ timeout: 5000 })

    // Check that we see the ticktock logs in the TelemetryStream
    const telemetrySection = page.locator('.terminal-stream')
    await expect(telemetrySection.locator('text=[SYSTEM]')).toBeVisible({ timeout: 5000 })
    await expect(telemetrySection.locator('text=[CONFIG]')).toBeVisible({ timeout: 5000 })
    await expect(telemetrySection.locator('text=[PROVENANCE]')).toBeVisible({ timeout: 5000 })
    await expect(telemetrySection.locator('text=[NETWORK]')).toBeVisible({ timeout: 5000 })
    await expect(telemetrySection.locator('text=[STREAM]')).toBeVisible({ timeout: 5000 })

    console.log('✅ All 5 ticktock log lines appeared!')

    // Wait for streaming to start
    await expect(page.locator('text=Streaming Architecture')).toBeVisible({ timeout: 10000 })

    // Wait for completion (up to 2 minutes)
    await expect(page.locator('text=Architecture Compiled')).toBeVisible({ timeout: 120000 })

    console.log('✅ Compilation completed successfully!')

    // Verify the download button appears
    await expect(page.locator('text=Download Sovereign Manifesto')).toBeVisible()

    console.log('✅ Download button visible - test passed!')
  })
})
