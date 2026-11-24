import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'onnxruntime-web': path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/ort.es6.min.js'),
    },
  },
  optimizeDeps: {
    exclude: ['@xenova/transformers'],
  },
  server: {
    port: 3000,
    host: true,
  },
  worker: {
    format: 'es',
  },
});
