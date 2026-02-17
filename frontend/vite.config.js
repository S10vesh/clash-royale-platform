import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/clash-royale-platform/',  // ТОЧНОЕ название твоего репозитория!
  plugins: [react()],
})