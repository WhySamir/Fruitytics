import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

/**
 * Vite configuration with security enhancements
 */
export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    react(),
    // Bundle analyzer (only in analyze mode)
    mode === 'analyze' &&
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },

  // Security: Disable source maps in production, enable in development
  build: {
    sourcemap: mode === 'development', // Enable source maps in dev for debugging
    minify: 'esbuild', // Use esbuild for minification (faster, secure)
    rollupOptions: {
      output: {
        // Obfuscate chunk names in production
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
        // Optimize chunk splitting for better caching
        manualChunks: (id) => {
          // Vendor chunks — order matters: specific checks before broad ones
          if (id.includes('node_modules')) {
            // Router (must precede react check — react-router contains 'react')
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Redux (must precede react check — react-redux contains 'react')
            if (id.includes('redux') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            // React and React DOM
            if (id.includes('/react/') || id.includes('/react-dom/')) {
              return 'vendor-react';
            }
            // Form libraries
            if (id.includes('formik') || id.includes('yup')) {
              return 'vendor-forms';
            }
            // Other large vendors
            if (id.includes('axios') || id.includes('dompurify')) {
              return 'vendor-utils';
            }
            // All other node_modules
            return 'vendor';
          }
        },
      },
    },
    // Performance budgets
    chunkSizeWarningLimit: 1000, // 1MB warning
  },

  // Security: Server configuration
  server: {
    headers: {
      // Security headers for development
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Note: CSP should be set in index.html meta tag
      // Full CSP headers should be set by production server (nginx, etc.)
    },
  },

  // Security: Preview server configuration
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
}));
