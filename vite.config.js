import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // The single-file HTML preview (VITE_HASH_ROUTER=true) bundles everything into one file.
    rollupOptions: { output: { inlineDynamicImports: process.env.VITE_HASH_ROUTER === 'true' } },
  },
})
