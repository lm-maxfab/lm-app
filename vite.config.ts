import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: mode === 'production' ? '.build/source' : '',
  plugins: [preact()],
  resolve: { alias: { react: 'preact/compat' } },
  build: {
    sourcemap: true,
    outDir: '../destination',
    assetsDir: 'assets'
  }
}))
