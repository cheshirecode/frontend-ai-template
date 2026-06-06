import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/lib': path.resolve(__dirname, './app/lib'),
      '@/store': path.resolve(__dirname, './app/store'),
      '@/hooks': path.resolve(__dirname, './app/hooks'),
      '@/components': path.resolve(__dirname, './app/components'),
      '@': path.resolve(__dirname, '.'),
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    globals: true,
    css: true,
  }
})
