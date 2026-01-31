import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
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
