import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
})
