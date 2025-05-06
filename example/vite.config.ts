import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias for the just-search-it package for live reloading
      'just-search-it': path.resolve(__dirname, '../just-search-it/src'),
    },
  },
})
