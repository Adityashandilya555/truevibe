import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',

  plugins: [
    react(),

    nodePolyfills({
      include: ['crypto', 'buffer', 'stream', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),

    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Enable PWA in development
      },
      manifest: {
        name: 'TrueVibe - Emotion-Aware Social Media',
        short_name: 'TrueVibe',
        description: 'Connect authentically through emotion-aware interactions',
        theme_color: '#4169E1',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Based on search results for PWA caching best practices
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/gfzuisdpkdshzqxoissu\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes for API calls
              },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    }
  },

  define: {
    global: 'globalThis',
  },

  optimizeDeps: {
    include: ['uuid', 'crypto-js', 'lodash.debounce', '@emotion/is-prop-valid'],
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: 'all'
  }
});