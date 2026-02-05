import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

// https://vite.dev/config/
export default defineConfig({
  base: '/ventas/',
  plugins: [react()],
  server: {
    middlewareMode: false,
    proxy: {
      '/api': {
        target: 'https://oracleapex.com/ords/josegalvez/ventas',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        agent: new https.Agent({ rejectUnauthorized: false }),
        logLevel: 'debug',
        onProxyRes(proxyRes) {
          proxyRes.headers['Access-Control-Allow-Origin'] = '*'
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type'
          proxyRes.headers['Content-Type'] = 'application/json; charset=utf-8'
        }
      }
    }
  }
})
