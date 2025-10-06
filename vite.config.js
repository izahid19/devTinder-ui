import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// No HTTPS — plain localhost:5173
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    https: false, // explicitly disable https
    proxy: {
      '/api': {
        target: 'https://learnbackend-production-ab05.up.railway.app',
        changeOrigin: true,
        secure: true, // keep true for trusted HTTPS servers
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
