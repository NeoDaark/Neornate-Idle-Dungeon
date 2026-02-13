import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Para Capacitor (Android/iOS), usar base '/'
// Para GitHub Pages, usar '/Neornate-Idle-Dungeon/'
const isCapacitor = process.env.BUILD_TARGET === 'capacitor' || !process.env.BUILD_TARGET
const base = isCapacitor ? '/' : '/Neornate-Idle-Dungeon/'

export default defineConfig({
  base: base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  json: {
    stringify: false,
  },
  server: {
    port: 5174,
    open: false,
  },
})
