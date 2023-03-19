import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { createLogger, defineConfig, Logger } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import vitePluginRequire from 'vite-plugin-require';
import { createMpaPlugin } from 'vite-plugin-virtual-mpa';

const customLogger = (): Logger => {
  const logger = createLogger();
  return {
    ...logger,
    warn: (message, options) => {
      const regexp = new RegExp('files in the public directory are served at the root path.', 'g');
      if (regexp.test(message)) return;
      logger.info(message, options);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  customLogger: customLogger(),
  plugins: [
    react(),
    createMpaPlugin({
      verbose: false,
      template: 'public/index.html',
      pages: [{ name: 'index', filename: 'index.html' }],
      rewrites: [{ from: /^(?!.*charting_library).*$/i, to: '/public/index.html' }],
    }),
    vitePluginRequire(),
    nodePolyfills({ protocolImports: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
