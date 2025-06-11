import generouted from '@generouted/react-router/plugin'
import react from '@vitejs/plugin-react'
import WindiCSS from 'vite-plugin-windicss'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [WindiCSS(), react(), generouted()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  server: {
    port: 5173,
  },
})
