import { defineConfig } from 'vite'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  root: resolve(import.meta.dirname, 'terminal'),

  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'terminal/src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    outDir: resolve(import.meta.dirname, '../dist'), 
    assetsDir: 'assets',  
    sourcemap: false,
    minify: 'esbuild',  
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
    
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  plugins: [
    nodePolyfills({
      include: ['buffer', 'path', 'stream', 'util'],
      globals: {
        Buffer: true,
        process: true,
      },
    }),
  ],
});
