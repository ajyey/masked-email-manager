import type { Manifest } from 'webextension-polyfill';
import pkg from '../package.json';

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  options_ui: {
    page: 'src/pages/options/index.html'
  },
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module'
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon34.png'
  },
  icons: {
    '34': 'icon34.png',
    '48': 'icon48.png',
    '128': 'icon128.png'
  },
  permissions: ['activeTab', 'storage', 'tabs'],
  devtools_page: 'src/pages/devtools/index.html',
  web_accessible_resources: [
    {
      resources: [
        'contentStyle.css',
        'icon128.png',
        'icon34.png',
        'icon48.png'
      ],
      matches: []
    }
  ]
};

const isFirefox = process.env.BROWSER === 'firefox';
// Firefox does not support background.service_worker, so convert to the firefox compatible background.scripts
if (isFirefox) {
  const extensionId = 'c48d361c-1173-11ee-be56-0242ac120002';
  manifest.background = {
    scripts: ['src/pages/background/index.js']
  };
  manifest.browser_specific_settings = {
    gecko: {
      id: `{${extensionId}}`
    }
  };
}
export default manifest;
