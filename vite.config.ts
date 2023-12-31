import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import { outputFolderName } from './utils/constants/constants';
import makeManifest from './utils/plugins/make-manifest';

const isFirefox = process.env.BROWSER === 'firefox';
const firefoxOutDir = resolve(__dirname, 'dist-firefox');

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const outDir = resolve(__dirname, outputFolderName);
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
      '@assets': assetsDir,
      '@pages': pagesDir
    }
  },
  plugins: [react(), makeManifest()],
  publicDir,
  build: {
    outDir: isFirefox ? firefoxOutDir : outDir,
    sourcemap: process.env.__DEV__ === 'true',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(pagesDir, 'popup', 'index.html'),
        options: resolve(pagesDir, 'options', 'index.html')
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`
      }
    }
  }
});
