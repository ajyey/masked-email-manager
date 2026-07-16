# Repository Guide

## Toolchain and Checks

- Use Yarn 4 (`yarn.lock` format); `yarn install` also applies the checked-in `patch-package` patch required by the Firefox release plugin.
- Match CI with Node 24. `.nvmrc` still names Node 16.13.0, while `.github/workflows/release.yml` installs and builds with Node 24.
- `yarn lint` is not read-only: ESLint runs with `--fix` on `src/**/*.ts(x)` and Prettier rewrites `src/**/*.html`. Inspect its diff.
- There is no test suite or `test` script. Use `yarn tsc --noEmit` for a non-mutating type check, then `yarn build` for the CI-equivalent lint plus both production builds.
- Build one target with `yarn build:production:chrome` or `yarn build:production:firefox`. Outputs are `dist/` and `dist-firefox/`, respectively.
- `yarn dev` is a Nodemon packaging loop, not a Vite dev server: each change builds Chrome and Firefox, normalizes manifest versions, and creates `dist-firefox/dist.zip`.

## Extension Structure

- Vite's root is `src/` and it has two HTML entrypoints: `src/pages/popup/index.html` and `src/pages/options/index.html`. The popup is the real application; the options page is currently only a placeholder.
- `src/contexts/AuthContext.tsx` owns login state. `src/service.ts` lazily initializes the `fastmail-masked-email` client, while `utils/storageUtil.ts` persists the API token, session, favorites, and default filter in `browser.storage.sync`.
- Import aliases are shared by `tsconfig.json` and `vite.config.ts`: `@src`, `@assets`, and `@pages`.

## Build and Release Gotchas

- Edit `src/manifest.ts`, not ignored `public/manifest.json`; the `make-manifest` Vite plugin generates the latter. `BROWSER=firefox` adds Gecko metadata and selects `dist-firefox/`.
- Vite sets `emptyOutDir: false`; old files can survive rebuilds. Remove `dist/` and `dist-firefox/` before checking deleted or renamed build artifacts.
- Do not remove `patches/semantic-release-firefox-add-on+0.2.8.patch`; it changes Firefox publishing so the manifest's Gecko ID, rather than the release plugin's `extensionId`, controls signing.
- Commit messages are checked against Conventional Commits. Pushes to `main` release publicly; `develop` produces the `beta` prerelease channel. The `no-release` scope suppresses release generation.
