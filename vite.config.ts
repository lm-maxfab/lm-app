import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  root: mode === 'production' ? '.temp' : '',
  plugins: [
    preact()
  ],
  resolve: {
    alias: {
      react: 'preact/compat'
    }
  },
  build: {
    sourcemap: true,
    outDir: mode === 'production' ? '2a908cd8c20b-temp-current-build' : 'build',
    assetsDir: '8b575a2c19a9-temp-assets'
  }
}))
