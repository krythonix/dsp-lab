import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Production build for GitHub Pages project site: https://krythonix.github.io/dsp-lab/
  base: process.env.NODE_ENV === 'production' ? '/dsp-lab/' : '/',
})
