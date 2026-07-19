import manifest from '../../src/manifest';
import type { PluginOption } from 'vite';

export default function makeManifest(): PluginOption {
  return {
    name: 'make-manifest',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: `${JSON.stringify(manifest, null, 2)}\n`
      });
    }
  };
}
