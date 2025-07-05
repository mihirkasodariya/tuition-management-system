import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.xlsx'],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    sourcemap: true,
    publicDir: './src/assets',
    assetsDir: './src/assets',
  },
  server: {
    host: '0.0.0.0', // This is crucial for Docker
    port: 5173,
  },
});
