import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IDAGDAG ANG LINYA NA ITO PARA AYUSIN ANG ASSET LOADING SA NETLIFY
  base: '/', 
})