import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: ['azotic-pseudoartistically-angla.ngrok-free.dev'],
        proxy: {
          '/api': {
            target: 'https://azotic-pseudoartistically-angla.ngrok-free.dev',
            changeOrigin: true,
            secure: false,
          },
        },
      },
      css: {
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      },
      build: {
        chunkSizeWarningLimit: 1000,
        target: 'es2015',
        rollupOptions: {
          output: {
            format: 'es',
            manualChunks: undefined
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
