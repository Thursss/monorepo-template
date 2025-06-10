import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [WindiCSS(), vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  server: {
    port: 5174,
  },
})
