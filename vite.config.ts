import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurar base según el target de build
// Para Capacitor (Android/iOS), usar base '/'
// Para GitHub Pages (default), usar '/Neornate-Idle-Dungeon/'
const isCapacitor = process.env.BUILD_TARGET === 'capacitor'
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
    middlewareMode: false,
  },
  hmr: {
    protocol: 'ws',
    host: 'localhost',
    port: 5174,
    timeout: 60000,
  },
  build: {
    chunkSizeWarningLimit: 1000, // Aumentar límite a 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar librerías grandes en chunks independientes
          'vendor': [
            'vue',
            'vue-router',
            'pinia',
          ],
          'fontawesome': [
            '@fortawesome/vue-fontawesome',
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-brands-svg-icons',
          ],
        },
      },
    },
  },
})
