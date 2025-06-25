import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}']
      },
      manifest: {
        name: 'Project Daedalus SIGMA.EXE',
        short_name: 'Daedalus',
        description: 'Quantum-Ethical Recursive Intelligence (Mobile-First)',
        theme_color: '#8b5cf6',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'quantum-core': ['./src/core/enon/QuantumSandbox.ts'],
          'ethics-engine': ['./src/core/ethics/SigmaMatrix.ts'],
          'cultural-intelligence': ['./src/core/cultural/MythosCore.ts'],
          'security-cortex': ['./src/core/security/SecurityCortex.ts']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  },
  server: {
    port: 3000,
    host: true
  }
});