import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { createMpaPlugin } from 'vite-plugin-virtual-mpa';
import vitePluginRequire from 'vite-plugin-require';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createMpaPlugin({
      verbose: false,
      pages: [
        {
          name: 'index',
          template: 'public/index.html',
          filename: 'index.html',
        },
      ],
    }),
    vitePluginRequire(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
