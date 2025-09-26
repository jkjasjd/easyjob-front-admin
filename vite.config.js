import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 3001,
    hmr: true,
  proxy: {
      '/api': {
        target: 'http://localhost:9091', // 后端 API 地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 如果需要去掉 /api 前缀
      },
    },
  }
})
