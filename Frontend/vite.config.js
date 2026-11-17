import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        businesses: resolve(__dirname, 'businesses.html'),
        bloggers: resolve(__dirname, 'bloggers.html'),
        campaigns: resolve(__dirname, 'campaigns.html'),
        postStats: resolve(__dirname, 'post-stats.html'),
        register: resolve(__dirname, 'register.html'),
        guide: resolve(__dirname, 'guide.html'),
      },
    },
  },
});
