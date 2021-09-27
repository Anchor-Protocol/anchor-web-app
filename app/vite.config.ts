import reactRefresh from '@vitejs/plugin-react-refresh';
import * as path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@terra-money/terra.js': '@terra-money/terra.js/dist/bundle.js',
      'styled-components':
        'styled-components/dist/styled-components.browser.esm.js',
      'process': path.resolve(__dirname, 'src/polyfills/process-es6.js'),
      //'react-csv': 'react-csv/lib/index.js',
    },
  },
  define: {
    'process.env.VITE_CRYPTOCOMPARE': JSON.stringify(process.env.VITE_CRYPTOCOMPARE),
    'process.env.VITE_CLOUD_FLARE_TOKEN': JSON.stringify(process.env.VITE_CLOUD_FLARE_TOKEN),
    'process.env.VITE_GA_TRACKING_ID': JSON.stringify(process.env.VITE_GA_TRACKING_ID),
    'process.env.VITE_SENTRY_DSN': JSON.stringify(process.env.VITE_SENTRY_DSN),
  },
  server: {
    https: {
      cert: process.env.LOCALHOST_HTTPS_CERT,
      key: process.env.LOCALHOST_HTTPS_KEY,
      //@ts-ignore
      maxSessionMemory: 100,
      peerMaxConcurrentStreams: 300,
    },
  },
  plugins: [reactRefresh(), tsconfigPaths(), svgr()],
  build: {
    sourcemap: true,
    outDir: 'build',
    //  rollupOptions: {
    //    input: {
    //      main: path.resolve(__dirname, 'index.html'),
    //      subpage: path.resolve(__dirname, 'subpage.html'),
    //    },
    //  },
  },
});
