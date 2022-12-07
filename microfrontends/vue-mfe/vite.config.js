import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
      outDir: 'build',
      lib: {
        entry: path.resolve(__dirname, './src/main.js'),
        name: 'vue-mfe',
        formats: ['umd'],
        fileName: format => `vue-mfe.${format}.js`
      }
  }
})
