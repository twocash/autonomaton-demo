import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

// Get git commit hash at build time
const commitHash = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig({
  plugins: [react()],
  base: '/autonomaton-demo/',
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
})
