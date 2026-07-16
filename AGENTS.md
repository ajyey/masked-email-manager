# Repository Guide

## Toolchain and Checks

- Use Yarn 4 (`yarn.lock` format); `yarn install` also applies the checked-in `patch-package` patch required by the Firefox release plugin.
- Use Node 24, as pinned by `.nvmrc`, `package.json`, and CI.
- `yarn lint` is read-only; use `yarn lint:fix` to rewrite TypeScript and HTML files.
- Use `yarn test` for the Vitest suite, `yarn typecheck` for a focused type check, or `yarn check` for the CI-equivalent lint, typecheck, tests, and both production builds.
- Build one target with `yarn build:production:chrome` or `yarn build:production:firefox`. Outputs are `dist/` and `dist-firefox/`, respectively.
- Run `yarn verify:build` after focused builds when both output directories exist; `yarn build` runs it automatically.
- `yarn dev` runs parallel Vite watch builds for Chrome and Firefox; it does not package ZIP/XPI artifacts or reload installed extensions.

## Extension Structure

- Vite's root is `src/`; the extension application entrypoint is `src/pages/popup/index.html`.
- `src/contexts/AuthContext.tsx` owns login state. `src/service.ts` lazily initializes the `fastmail-masked-email` client, while `utils/storageUtil.ts` persists the API token, session, favorites, and default filter in `browser.storage.sync`.
- Import aliases are shared by `tsconfig.json` and `vite.config.ts`: `@src`, `@assets`, and `@pages`.

## Build and Release Gotchas

- Edit `src/manifest.ts`; the `make-manifest` Vite plugin emits `manifest.json` directly into the selected build output. `BROWSER=firefox` adds Gecko metadata and selects `dist-firefox/`.
- Do not remove `patches/semantic-release-firefox-add-on+0.2.8.patch`; it changes Firefox publishing so the manifest's Gecko ID, rather than the release plugin's `extensionId`, controls signing.
- Use Conventional Commits because semantic-release derives versions from them: `feat` is minor, `fix` is patch, and `BREAKING CHANGE` is major. Custom rules make `refactor` a patch, `refactor(types)` and `feat(major)` a minor and major respectively, and `chore(deps)` a patch; use the `no-release` scope for commits that must not publish a release.
- Pushes to `main` release publicly; `develop` produces the `beta` prerelease channel.
