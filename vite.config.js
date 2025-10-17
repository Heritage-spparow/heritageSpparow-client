import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true, // auto-open browser on dev start (optional)
  },
  css: {
    devSourcemap: true, // helpful for debugging Tailwind styles
  },
})
