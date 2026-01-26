import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['smash-portfolio.local', 'localhost','lzxvr-77-127-128-46.a.free.pinggy.link']
  }
})
