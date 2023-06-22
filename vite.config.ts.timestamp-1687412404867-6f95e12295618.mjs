// vite.config.ts
import react from "file:///Users/AJ/Development/masked-email-manager/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve as resolve3 } from "path";
import { defineConfig } from "file:///Users/AJ/Development/masked-email-manager/node_modules/vite/dist/node/index.js";

// utils/constants.ts
var outputFolderName = "dist";

// utils/log.ts
function colorLog(message, type) {
  let color = type || COLORS.FgBlack;
  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
  }
  console.log(color, message);
}
var COLORS = {
  Reset: "\x1B[0m",
  Bright: "\x1B[1m",
  Dim: "\x1B[2m",
  Underscore: "\x1B[4m",
  Blink: "\x1B[5m",
  Reverse: "\x1B[7m",
  Hidden: "\x1B[8m",
  FgBlack: "\x1B[30m",
  FgRed: "\x1B[31m",
  FgGreen: "\x1B[32m",
  FgYellow: "\x1B[33m",
  FgBlue: "\x1B[34m",
  FgMagenta: "\x1B[35m",
  FgCyan: "\x1B[36m",
  FgWhite: "\x1B[37m",
  BgBlack: "\x1B[40m",
  BgRed: "\x1B[41m",
  BgGreen: "\x1B[42m",
  BgYellow: "\x1B[43m",
  BgBlue: "\x1B[44m",
  BgMagenta: "\x1B[45m",
  BgCyan: "\x1B[46m",
  BgWhite: "\x1B[47m"
};

// utils/plugins/build-content-script.ts
import { build } from "file:///Users/AJ/Development/masked-email-manager/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import cssInjectedByJsPlugin from "file:///Users/AJ/Development/masked-email-manager/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
var __vite_injected_original_dirname = "/Users/AJ/Development/masked-email-manager/utils/plugins";
var packages = [
  {
    content: resolve(__vite_injected_original_dirname, "../../", "src/pages/content/index.tsx")
  }
];
var outDir = resolve(__vite_injected_original_dirname, "../../", outputFolderName);
function buildContentScript() {
  return {
    name: "build-content",
    async buildEnd() {
      for (const _package of packages) {
        await build({
          publicDir: false,
          plugins: [cssInjectedByJsPlugin()],
          build: {
            outDir,
            sourcemap: process.env.__DEV__ === "true",
            emptyOutDir: false,
            rollupOptions: {
              input: _package,
              output: {
                entryFileNames: (chunk) => {
                  return `src/pages/${chunk.name}/index.js`;
                }
              }
            }
          },
          configFile: false
        });
      }
      colorLog("Content code build sucessfully", "success");
    }
  };
}

// utils/plugins/make-manifest.ts
import * as fs from "fs";
import * as path from "path";

// package.json
var package_default = {
  name: "masked-email-manager",
  displayName: "Fastmail Masked Email Manager",
  version: "1.0.0-beta.17",
  description: "A web extension to manage your fastmail masked emails",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/ajyey/masked-email-manager.git"
  },
  type: "module",
  scripts: {
    build: "run-s lint build:*",
    "build:production": "vite build",
    lint: "run-s lint:*",
    "lint:ts": "eslint src --ext .ts,.tsx --fix",
    "lint:html": "prettier --config .prettierrc 'src/**/*.html' --write",
    dev: "nodemon",
    "semantic-release": "semantic-release",
    "upgrade-packages": "npx npm-check-updates -u && yarn",
    "update-version": "node utils/update-version.js"
  },
  dependencies: {
    "fastmail-masked-email": "^1.3.1",
    "fuse.js": "^6.6.2",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "vite-plugin-css-injected-by-js": "^3.1.1",
    "webextension-polyfill": "^0.10.0"
  },
  devDependencies: {
    "@commitlint/cli": "^17.6.5",
    "@commitlint/config-conventional": "^17.6.5",
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/commit-analyzer": "^10.0.1",
    "@semantic-release/git": "^10.0.1",
    "@semantic-release/github": "^9.0.3",
    "@semantic-release/npm": "^10.0.4",
    "@semantic-release/release-notes-generator": "^11.0.3",
    "@types/chrome": "^0.0.237",
    "@types/node": "^20.3.1",
    "@types/react": "^18.2.13",
    "@types/react-dom": "^18.2.6",
    "@types/webextension-polyfill": "^0.10.0",
    "@typescript-eslint/eslint-plugin": "^5.60.0",
    "@typescript-eslint/parser": "^5.60.0",
    "@vitejs/plugin-react-swc": "^3.3.2",
    autoprefixer: "^10.4.14",
    eslint: "^8.43.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-simple-import-sort": "^10.0.0",
    "fs-extra": "^11.1.1",
    husky: "^8.0.3",
    nodemon: "^2.0.22",
    "npm-run-all": "^4.1.5",
    postcss: "^8.4.24",
    prettier: "^2.8.8",
    rimraf: "^5.0.1",
    "run-script-os": "^1.1.6",
    "semantic-release": "^21.0.5",
    "semantic-release-chrome": "^3.2.0",
    tailwindcss: "^3.3.2",
    "ts-node": "^10.9.1",
    typescript: "^5.1.3",
    vite: "^4.3.9"
  }
};

// src/manifest.ts
var manifest = {
  manifest_version: 3,
  name: package_default.displayName,
  version: package_default.version,
  description: package_default.description,
  options_ui: {
    page: "src/pages/options/index.html"
  },
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon34.png"
  },
  icons: {
    "34": "icon34.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },
  permissions: ["activeTab", "storage"],
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],
      css: ["contentStyle.css"]
    }
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "contentStyle.css",
        "icon128.png",
        "icon34.png",
        "icon48.png"
      ],
      matches: []
    }
  ]
};
var manifest_default = manifest;

// utils/plugins/make-manifest.ts
var __vite_injected_original_dirname2 = "/Users/AJ/Development/masked-email-manager/utils/plugins";
var { resolve: resolve2 } = path;
var outDir2 = resolve2(__vite_injected_original_dirname2, "..", "..", "public");
function makeManifest() {
  return {
    name: "make-manifest",
    buildEnd() {
      if (!fs.existsSync(outDir2)) {
        fs.mkdirSync(outDir2);
      }
      const manifestPath = resolve2(outDir2, "manifest.json");
      fs.writeFileSync(manifestPath, JSON.stringify(manifest_default, null, 2));
      colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname3 = "/Users/AJ/Development/masked-email-manager";
var root = resolve3(__vite_injected_original_dirname3, "src");
var pagesDir = resolve3(root, "pages");
var assetsDir = resolve3(root, "assets");
var outDir3 = resolve3(__vite_injected_original_dirname3, outputFolderName);
var publicDir = resolve3(__vite_injected_original_dirname3, "public");
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir
    }
  },
  plugins: [react(), makeManifest(), buildContentScript()],
  publicDir,
  build: {
    outDir: outDir3,
    sourcemap: process.env.__DEV__ === "true",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        devtools: resolve3(pagesDir, "devtools", "index.html"),
        panel: resolve3(pagesDir, "panel", "index.html"),
        background: resolve3(pagesDir, "background", "index.ts"),
        popup: resolve3(pagesDir, "popup", "index.html"),
        newtab: resolve3(pagesDir, "newtab", "index.html"),
        options: resolve3(pagesDir, "options", "index.html")
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidXRpbHMvY29uc3RhbnRzLnRzIiwgInV0aWxzL2xvZy50cyIsICJ1dGlscy9wbHVnaW5zL2J1aWxkLWNvbnRlbnQtc2NyaXB0LnRzIiwgInV0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdC50cyIsICJwYWNrYWdlLmpzb24iLCAic3JjL21hbmlmZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL0FKL0RldmVsb3BtZW50L21hc2tlZC1lbWFpbC1tYW5hZ2VyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvQUovRGV2ZWxvcG1lbnQvbWFza2VkLWVtYWlsLW1hbmFnZXIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL0FKL0RldmVsb3BtZW50L21hc2tlZC1lbWFpbC1tYW5hZ2VyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcblxuaW1wb3J0IHsgb3V0cHV0Rm9sZGVyTmFtZSB9IGZyb20gJy4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCBidWlsZENvbnRlbnRTY3JpcHQgZnJvbSAnLi91dGlscy9wbHVnaW5zL2J1aWxkLWNvbnRlbnQtc2NyaXB0JztcbmltcG9ydCBtYWtlTWFuaWZlc3QgZnJvbSAnLi91dGlscy9wbHVnaW5zL21ha2UtbWFuaWZlc3QnO1xuXG5jb25zdCByb290ID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKTtcbmNvbnN0IHBhZ2VzRGlyID0gcmVzb2x2ZShyb290LCAncGFnZXMnKTtcbmNvbnN0IGFzc2V0c0RpciA9IHJlc29sdmUocm9vdCwgJ2Fzc2V0cycpO1xuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIG91dHB1dEZvbGRlck5hbWUpO1xuY29uc3QgcHVibGljRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQHNyYyc6IHJvb3QsXG4gICAgICAnQGFzc2V0cyc6IGFzc2V0c0RpcixcbiAgICAgICdAcGFnZXMnOiBwYWdlc0RpclxuICAgIH1cbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIG1ha2VNYW5pZmVzdCgpLCBidWlsZENvbnRlbnRTY3JpcHQoKV0sXG4gIHB1YmxpY0RpcixcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXIsXG4gICAgc291cmNlbWFwOiBwcm9jZXNzLmVudi5fX0RFVl9fID09PSAndHJ1ZScsXG4gICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIGRldnRvb2xzOiByZXNvbHZlKHBhZ2VzRGlyLCAnZGV2dG9vbHMnLCAnaW5kZXguaHRtbCcpLFxuICAgICAgICBwYW5lbDogcmVzb2x2ZShwYWdlc0RpciwgJ3BhbmVsJywgJ2luZGV4Lmh0bWwnKSxcbiAgICAgICAgYmFja2dyb3VuZDogcmVzb2x2ZShwYWdlc0RpciwgJ2JhY2tncm91bmQnLCAnaW5kZXgudHMnKSxcbiAgICAgICAgcG9wdXA6IHJlc29sdmUocGFnZXNEaXIsICdwb3B1cCcsICdpbmRleC5odG1sJyksXG4gICAgICAgIG5ld3RhYjogcmVzb2x2ZShwYWdlc0RpciwgJ25ld3RhYicsICdpbmRleC5odG1sJyksXG4gICAgICAgIG9wdGlvbnM6IHJlc29sdmUocGFnZXNEaXIsICdvcHRpb25zJywgJ2luZGV4Lmh0bWwnKVxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogKGNodW5rKSA9PiBgc3JjL3BhZ2VzLyR7Y2h1bmsubmFtZX0vaW5kZXguanNgXG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL0FKL0RldmVsb3BtZW50L21hc2tlZC1lbWFpbC1tYW5hZ2VyL3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvQUovRGV2ZWxvcG1lbnQvbWFza2VkLWVtYWlsLW1hbmFnZXIvdXRpbHMvY29uc3RhbnRzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9BSi9EZXZlbG9wbWVudC9tYXNrZWQtZW1haWwtbWFuYWdlci91dGlscy9jb25zdGFudHMudHNcIjtleHBvcnQgY29uc3Qgb3V0cHV0Rm9sZGVyTmFtZSA9ICdkaXN0JztcbmV4cG9ydCBjb25zdCBGQVNUTUFJTF9TRVNTSU9OX0tFWSA9ICdmYXN0bWFpbF9zZXNzaW9uJztcbmV4cG9ydCBjb25zdCBGQVZPUklURV9FTUFJTFNfS0VZID0gJ2Zhdm9yaXRlX2VtYWlscyc7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9BSi9EZXZlbG9wbWVudC9tYXNrZWQtZW1haWwtbWFuYWdlci91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL0FKL0RldmVsb3BtZW50L21hc2tlZC1lbWFpbC1tYW5hZ2VyL3V0aWxzL2xvZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvQUovRGV2ZWxvcG1lbnQvbWFza2VkLWVtYWlsLW1hbmFnZXIvdXRpbHMvbG9nLnRzXCI7dHlwZSBDb2xvclR5cGUgPSAnc3VjY2VzcycgfCAnaW5mbycgfCAnZXJyb3InIHwgJ3dhcm5pbmcnIHwga2V5b2YgdHlwZW9mIENPTE9SUztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29sb3JMb2cobWVzc2FnZTogc3RyaW5nLCB0eXBlPzogQ29sb3JUeXBlKSB7XG4gIGxldCBjb2xvcjogc3RyaW5nID0gdHlwZSB8fCBDT0xPUlMuRmdCbGFjaztcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdzdWNjZXNzJzpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnR3JlZW47XG4gICAgICBicmVhaztcbiAgICBjYXNlICdpbmZvJzpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnQmx1ZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGNvbG9yID0gQ09MT1JTLkZnUmVkO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnd2FybmluZyc6XG4gICAgICBjb2xvciA9IENPTE9SUy5GZ1llbGxvdztcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgY29uc29sZS5sb2coY29sb3IsIG1lc3NhZ2UpO1xufVxuXG5jb25zdCBDT0xPUlMgPSB7XG4gIFJlc2V0OiAnXFx4MWJbMG0nLFxuICBCcmlnaHQ6ICdcXHgxYlsxbScsXG4gIERpbTogJ1xceDFiWzJtJyxcbiAgVW5kZXJzY29yZTogJ1xceDFiWzRtJyxcbiAgQmxpbms6ICdcXHgxYls1bScsXG4gIFJldmVyc2U6ICdcXHgxYls3bScsXG4gIEhpZGRlbjogJ1xceDFiWzhtJyxcbiAgRmdCbGFjazogJ1xceDFiWzMwbScsXG4gIEZnUmVkOiAnXFx4MWJbMzFtJyxcbiAgRmdHcmVlbjogJ1xceDFiWzMybScsXG4gIEZnWWVsbG93OiAnXFx4MWJbMzNtJyxcbiAgRmdCbHVlOiAnXFx4MWJbMzRtJyxcbiAgRmdNYWdlbnRhOiAnXFx4MWJbMzVtJyxcbiAgRmdDeWFuOiAnXFx4MWJbMzZtJyxcbiAgRmdXaGl0ZTogJ1xceDFiWzM3bScsXG4gIEJnQmxhY2s6ICdcXHgxYls0MG0nLFxuICBCZ1JlZDogJ1xceDFiWzQxbScsXG4gIEJnR3JlZW46ICdcXHgxYls0Mm0nLFxuICBCZ1llbGxvdzogJ1xceDFiWzQzbScsXG4gIEJnQmx1ZTogJ1xceDFiWzQ0bScsXG4gIEJnTWFnZW50YTogJ1xceDFiWzQ1bScsXG4gIEJnQ3lhbjogJ1xceDFiWzQ2bScsXG4gIEJnV2hpdGU6ICdcXHgxYls0N20nLFxufSBhcyBjb25zdDtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL0FKL0RldmVsb3BtZW50L21hc2tlZC1lbWFpbC1tYW5hZ2VyL3V0aWxzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9BSi9EZXZlbG9wbWVudC9tYXNrZWQtZW1haWwtbWFuYWdlci91dGlscy9wbHVnaW5zL2J1aWxkLWNvbnRlbnQtc2NyaXB0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9BSi9EZXZlbG9wbWVudC9tYXNrZWQtZW1haWwtbWFuYWdlci91dGlscy9wbHVnaW5zL2J1aWxkLWNvbnRlbnQtc2NyaXB0LnRzXCI7aW1wb3J0IGNvbG9yTG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQgeyBQbHVnaW5PcHRpb24sIGJ1aWxkIH0gZnJvbSAndml0ZSc7IFxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgb3V0cHV0Rm9sZGVyTmFtZSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLWNzcy1pbmplY3RlZC1ieS1qcydcblxuY29uc3QgcGFja2FnZXMgPSBbXG4gIHtcbiAgICBjb250ZW50OiAgcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi8nLCAnc3JjL3BhZ2VzL2NvbnRlbnQvaW5kZXgudHN4JylcbiAgfSxcbl07XG5cbmNvbnN0IG91dERpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vJywgIG91dHB1dEZvbGRlck5hbWUpOyBcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRDb250ZW50U2NyaXB0KCk6IFBsdWdpbk9wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2J1aWxkLWNvbnRlbnQnLFxuICAgIGFzeW5jIGJ1aWxkRW5kKCkge1xuICAgICAgZm9yIChjb25zdCBfcGFja2FnZSBvZiBwYWNrYWdlcykge1xuICAgICAgICBhd2FpdCBidWlsZCh7XG4gICAgICAgICAgcHVibGljRGlyOiBmYWxzZSxcbiAgICAgICAgICBwbHVnaW5zOiBbIGNzc0luamVjdGVkQnlKc1BsdWdpbigpIF0sXG4gICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIG91dERpcixcbiAgICAgICAgICAgIHNvdXJjZW1hcDogcHJvY2Vzcy5lbnYuX19ERVZfXyA9PT0gJ3RydWUnLFxuICAgICAgICAgICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICBpbnB1dDogX3BhY2thZ2UsXG4gICAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAoY2h1bmspID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBgc3JjL3BhZ2VzLyR7Y2h1bmsubmFtZX0vaW5kZXguanNgO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29uZmlnRmlsZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29sb3JMb2coJ0NvbnRlbnQgY29kZSBidWlsZCBzdWNlc3NmdWxseScsICdzdWNjZXNzJyk7XG4gICAgfSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL0FKL0RldmVsb3BtZW50L21hc2tlZC1lbWFpbC1tYW5hZ2VyL3V0aWxzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9BSi9EZXZlbG9wbWVudC9tYXNrZWQtZW1haWwtbWFuYWdlci91dGlscy9wbHVnaW5zL21ha2UtbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL0FKL0RldmVsb3BtZW50L21hc2tlZC1lbWFpbC1tYW5hZ2VyL3V0aWxzL3BsdWdpbnMvbWFrZS1tYW5pZmVzdC50c1wiO2ltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY29sb3JMb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuLi8uLi9zcmMvbWFuaWZlc3QnO1xuaW1wb3J0IHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSc7XG5cbmNvbnN0IHsgcmVzb2x2ZSB9ID0gcGF0aDtcblxuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicsICdwdWJsaWMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZU1hbmlmZXN0KCk6IFBsdWdpbk9wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ21ha2UtbWFuaWZlc3QnLFxuICAgIGJ1aWxkRW5kKCkge1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKG91dERpcikpIHtcbiAgICAgICAgZnMubWtkaXJTeW5jKG91dERpcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hbmlmZXN0UGF0aCA9IHJlc29sdmUob3V0RGlyLCAnbWFuaWZlc3QuanNvbicpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG1hbmlmZXN0UGF0aCwgSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QsIG51bGwsIDIpKTtcblxuICAgICAgY29sb3JMb2coYE1hbmlmZXN0IGZpbGUgY29weSBjb21wbGV0ZTogJHttYW5pZmVzdFBhdGh9YCwgJ3N1Y2Nlc3MnKTtcbiAgICB9LFxuICB9O1xufVxuIiwgIntcbiAgXCJuYW1lXCI6IFwibWFza2VkLWVtYWlsLW1hbmFnZXJcIixcbiAgXCJkaXNwbGF5TmFtZVwiOiBcIkZhc3RtYWlsIE1hc2tlZCBFbWFpbCBNYW5hZ2VyXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuMC4wLWJldGEuMTdcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkEgd2ViIGV4dGVuc2lvbiB0byBtYW5hZ2UgeW91ciBmYXN0bWFpbCBtYXNrZWQgZW1haWxzXCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2FqeWV5L21hc2tlZC1lbWFpbC1tYW5hZ2VyLmdpdFwiXG4gIH0sXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJydW4tcyBsaW50IGJ1aWxkOipcIixcbiAgICBcImJ1aWxkOnByb2R1Y3Rpb25cIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJsaW50XCI6IFwicnVuLXMgbGludDoqXCIsXG4gICAgXCJsaW50OnRzXCI6IFwiZXNsaW50IHNyYyAtLWV4dCAudHMsLnRzeCAtLWZpeFwiLFxuICAgIFwibGludDpodG1sXCI6IFwicHJldHRpZXIgLS1jb25maWcgLnByZXR0aWVycmMgJ3NyYy8qKi8qLmh0bWwnIC0td3JpdGVcIixcbiAgICBcImRldlwiOiBcIm5vZGVtb25cIixcbiAgICBcInNlbWFudGljLXJlbGVhc2VcIjogXCJzZW1hbnRpYy1yZWxlYXNlXCIsXG4gICAgXCJ1cGdyYWRlLXBhY2thZ2VzXCI6IFwibnB4IG5wbS1jaGVjay11cGRhdGVzIC11ICYmIHlhcm5cIixcbiAgICBcInVwZGF0ZS12ZXJzaW9uXCI6IFwibm9kZSB1dGlscy91cGRhdGUtdmVyc2lvbi5qc1wiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImZhc3RtYWlsLW1hc2tlZC1lbWFpbFwiOiBcIl4xLjMuMVwiLFxuICAgIFwiZnVzZS5qc1wiOiBcIl42LjYuMlwiLFxuICAgIFwicmVhY3RcIjogXCJeMTguMi4wXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMi4wXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1jc3MtaW5qZWN0ZWQtYnktanNcIjogXCJeMy4xLjFcIixcbiAgICBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiOiBcIl4wLjEwLjBcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAY29tbWl0bGludC9jbGlcIjogXCJeMTcuNi41XCIsXG4gICAgXCJAY29tbWl0bGludC9jb25maWctY29udmVudGlvbmFsXCI6IFwiXjE3LjYuNVwiLFxuICAgIFwiQHNlbWFudGljLXJlbGVhc2UvY2hhbmdlbG9nXCI6IFwiXjYuMC4zXCIsXG4gICAgXCJAc2VtYW50aWMtcmVsZWFzZS9jb21taXQtYW5hbHl6ZXJcIjogXCJeMTAuMC4xXCIsXG4gICAgXCJAc2VtYW50aWMtcmVsZWFzZS9naXRcIjogXCJeMTAuMC4xXCIsXG4gICAgXCJAc2VtYW50aWMtcmVsZWFzZS9naXRodWJcIjogXCJeOS4wLjNcIixcbiAgICBcIkBzZW1hbnRpYy1yZWxlYXNlL25wbVwiOiBcIl4xMC4wLjRcIixcbiAgICBcIkBzZW1hbnRpYy1yZWxlYXNlL3JlbGVhc2Utbm90ZXMtZ2VuZXJhdG9yXCI6IFwiXjExLjAuM1wiLFxuICAgIFwiQHR5cGVzL2Nocm9tZVwiOiBcIl4wLjAuMjM3XCIsXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yMC4zLjFcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjEzXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjIuNlwiLFxuICAgIFwiQHR5cGVzL3dlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiOiBcIl4wLjEwLjBcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjUuNjAuMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl41LjYwLjBcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjMuMlwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTRcIixcbiAgICBcImVzbGludFwiOiBcIl44LjQzLjBcIixcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOC44LjBcIixcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwiXjIuMjcuNVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1qc3gtYTExeVwiOiBcIl42LjcuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1wcmV0dGllclwiOiBcIl40LjIuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdFwiOiBcIl43LjMyLjJcIixcbiAgICBcImVzbGludC1wbHVnaW4tcmVhY3QtaG9va3NcIjogXCJeNC42LjBcIixcbiAgICBcImVzbGludC1wbHVnaW4tc2ltcGxlLWltcG9ydC1zb3J0XCI6IFwiXjEwLjAuMFwiLFxuICAgIFwiZnMtZXh0cmFcIjogXCJeMTEuMS4xXCIsXG4gICAgXCJodXNreVwiOiBcIl44LjAuM1wiLFxuICAgIFwibm9kZW1vblwiOiBcIl4yLjAuMjJcIixcbiAgICBcIm5wbS1ydW4tYWxsXCI6IFwiXjQuMS41XCIsXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC4yNFwiLFxuICAgIFwicHJldHRpZXJcIjogXCJeMi44LjhcIixcbiAgICBcInJpbXJhZlwiOiBcIl41LjAuMVwiLFxuICAgIFwicnVuLXNjcmlwdC1vc1wiOiBcIl4xLjEuNlwiLFxuICAgIFwic2VtYW50aWMtcmVsZWFzZVwiOiBcIl4yMS4wLjVcIixcbiAgICBcInNlbWFudGljLXJlbGVhc2UtY2hyb21lXCI6IFwiXjMuMi4wXCIsXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl4zLjMuMlwiLFxuICAgIFwidHMtbm9kZVwiOiBcIl4xMC45LjFcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4xLjNcIixcbiAgICBcInZpdGVcIjogXCJeNC4zLjlcIlxuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9BSi9EZXZlbG9wbWVudC9tYXNrZWQtZW1haWwtbWFuYWdlci9zcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9BSi9EZXZlbG9wbWVudC9tYXNrZWQtZW1haWwtbWFuYWdlci9zcmMvbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL0FKL0RldmVsb3BtZW50L21hc2tlZC1lbWFpbC1tYW5hZ2VyL3NyYy9tYW5pZmVzdC50c1wiO2ltcG9ydCB0eXBlIHsgTWFuaWZlc3QgfSBmcm9tICd3ZWJleHRlbnNpb24tcG9seWZpbGwnO1xuaW1wb3J0IHBrZyBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuXG5jb25zdCBtYW5pZmVzdDogTWFuaWZlc3QuV2ViRXh0ZW5zaW9uTWFuaWZlc3QgPSB7XG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXG4gIG5hbWU6IHBrZy5kaXNwbGF5TmFtZSxcbiAgdmVyc2lvbjogcGtnLnZlcnNpb24sXG4gIGRlc2NyaXB0aW9uOiBwa2cuZGVzY3JpcHRpb24sXG4gIG9wdGlvbnNfdWk6IHtcbiAgICBwYWdlOiAnc3JjL3BhZ2VzL29wdGlvbnMvaW5kZXguaHRtbCdcbiAgfSxcbiAgYmFja2dyb3VuZDoge1xuICAgIHNlcnZpY2Vfd29ya2VyOiAnc3JjL3BhZ2VzL2JhY2tncm91bmQvaW5kZXguanMnLFxuICAgIHR5cGU6ICdtb2R1bGUnXG4gIH0sXG4gIGFjdGlvbjoge1xuICAgIGRlZmF1bHRfcG9wdXA6ICdzcmMvcGFnZXMvcG9wdXAvaW5kZXguaHRtbCcsXG4gICAgZGVmYXVsdF9pY29uOiAnaWNvbjM0LnBuZydcbiAgfSxcbiAgaWNvbnM6IHtcbiAgICAnMzQnOiAnaWNvbjM0LnBuZycsXG4gICAgJzQ4JzogJ2ljb240OC5wbmcnLFxuICAgICcxMjgnOiAnaWNvbjEyOC5wbmcnXG4gIH0sXG4gIHBlcm1pc3Npb25zOiBbJ2FjdGl2ZVRhYicsICdzdG9yYWdlJ10sXG4gIGNvbnRlbnRfc2NyaXB0czogW1xuICAgIHtcbiAgICAgIG1hdGNoZXM6IFsnaHR0cDovLyovKicsICdodHRwczovLyovKicsICc8YWxsX3VybHM+J10sXG4gICAgICBqczogWydzcmMvcGFnZXMvY29udGVudC9pbmRleC5qcyddLFxuICAgICAgY3NzOiBbJ2NvbnRlbnRTdHlsZS5jc3MnXVxuICAgIH1cbiAgXSxcbiAgZGV2dG9vbHNfcGFnZTogJ3NyYy9wYWdlcy9kZXZ0b29scy9pbmRleC5odG1sJyxcbiAgd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbXG4gICAge1xuICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICdjb250ZW50U3R5bGUuY3NzJyxcbiAgICAgICAgJ2ljb24xMjgucG5nJyxcbiAgICAgICAgJ2ljb24zNC5wbmcnLFxuICAgICAgICAnaWNvbjQ4LnBuZydcbiAgICAgIF0sXG4gICAgICBtYXRjaGVzOiBbXVxuICAgIH1cbiAgXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFuaWZlc3Q7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULE9BQU8sV0FBVztBQUNsVSxTQUFTLFdBQUFBLGdCQUFlO0FBQ3hCLFNBQVMsb0JBQW9COzs7QUNGd1MsSUFBTSxtQkFBbUI7OztBQ0UvVSxTQUFSLFNBQTBCLFNBQWlCLE1BQWtCO0FBQ2xFLE1BQUksUUFBZ0Is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UTtBQUU3QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxVQUFVO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxNQUFNLEdBQUcsYUFBYSxHQUFHLG1CQUFtQixDQUFDO0FBQUEsRUFDdkQ7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQUFDO0FBQUEsSUFDQSxXQUFXLFFBQVEsSUFBSSxZQUFZO0FBQUEsSUFDbkMsYUFBYTtBQUFBLElBQ2IsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsVUFBVUYsU0FBUSxVQUFVLFlBQVksWUFBWTtBQUFBLFFBQ3BELE9BQU9BLFNBQVEsVUFBVSxTQUFTLFlBQVk7QUFBQSxRQUM5QyxZQUFZQSxTQUFRLFVBQVUsY0FBYyxVQUFVO0FBQUEsUUFDdEQsT0FBT0EsU0FBUSxVQUFVLFNBQVMsWUFBWTtBQUFBLFFBQzlDLFFBQVFBLFNBQVEsVUFBVSxVQUFVLFlBQVk7QUFBQSxRQUNoRCxTQUFTQSxTQUFRLFVBQVUsV0FBVyxZQUFZO0FBQUEsTUFDcEQ7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQixDQUFDLFVBQVUsYUFBYSxNQUFNO0FBQUEsTUFDaEQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInJlc29sdmUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJvdXREaXIiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJvdXREaXIiXQp9Cg==
