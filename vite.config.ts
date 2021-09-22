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
    outDir: mode === 'production' ? '../build' : 'build'
  }
}))

