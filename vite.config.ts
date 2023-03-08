import { defineConfig, normalizePath } from 'vite';
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
      template: 'public/index.html',
      pages: [{ name: 'index', filename: 'index.html' }],
      rewrites: [
        // {
        //   from: new RegExp(normalizePath('/')),
        //   to: () => normalizePath('/public/index.html'),
        // },
        { from: /.*/, to: '/public/index.html' },
      ],
    }),
    createMpaPlugin({
      verbose: false,
      pages: [
        {
          name: 'index',
          filename: 'index.html',
          template: 'public/index.html',
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
