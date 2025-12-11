import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  server: {
    port: 10000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})