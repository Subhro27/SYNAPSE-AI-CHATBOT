import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/SYNAPSE-AI-CHATBOT/', 
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'pdfjs-dist': path.resolve(__dirname, 'node_modules/pdfjs-dist'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdfjs-dist': ['pdfjs-dist'],
        },
      },
    },
  },
});
