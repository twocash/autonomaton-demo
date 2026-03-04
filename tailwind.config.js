/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"Fragment Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        // Grove Industrial Palette
        grove: {
          bg: '#080808',           // App root background
          bg2: '#0f0f0f',          // Panel background (chat, config)
          bg3: '#161616',          // Elevated cards (interaction bubbles)
          border: '#252525',       // Standard borders
          'border-light': '#333333', // Hover state borders
          amber: '#D4621A',        // Primary active color
          'amber-bright': '#F07030', // Hover active color
          text: '#E8E2D9',         // Primary text
          'text-dim': '#7A736A',   // Muted/Placeholder text
          'text-mid': '#B0A898',   // Secondary text
          green: '#4CAF72',        // Zone: Auto
          yellow: '#D4A017',       // Zone: Supervised
          red: '#C0392B',          // Zone: Human-Only
        },
        // Zone governance colors (aliased for semantic use)
        zone: {
          green: '#4CAF72',
          yellow: '#D4A017',
          red: '#C0392B',
        },
        // Tier colors — cognitive routing visualization
        tier: {
          0: '#a855f7',  // Purple: cached skill (local, free)
          1: '#3b82f6',  // Blue: cheap cognition
          2: '#f97316',  // Orange: premium cognition
          3: '#dc2626',  // Red: apex cognition
        },
        // Pipeline stage colors (using grove amber for active)
        pipeline: {
          idle: '#252525',
          active: '#D4621A',      // Grove amber
          complete: '#4CAF72',    // Grove green
          error: '#C0392B',       // Grove red
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 0.6s ease-out forwards',
        'evaporate': 'evaporate 0.8s ease-out forwards',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        evaporate: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
