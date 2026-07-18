# End-to-End Testing Improvements

## Overview

Masked Email Manager now has a deterministic browser-level test system for the
installed Chrome extension. The suite builds the production extension, loads
`dist/` into Playwright Chromium, opens the real `chrome-extension://` popup,
and exercises the real `fastmail-masked-email` client against a stateful local
JMAP mock.

Normal development and CI never contact Fastmail. Tests exercise the same
compiled popup that is shipped while keeping data, failures, and timing
deterministic. The work also strengthened accessibility, fixed product defects
found by browser tests, added release diagnostics, and made E2E success a
release requirement.

## Running The Checks

Use Node 24 and Yarn 4, as pinned by `.nvmrc` and `package.json`.

```bash
yarn install --immutable
yarn test:e2e:install
yarn test:e2e
```

Useful variants:

```bash
yarn test:e2e:run             # Run against the existing dist/ build
yarn test:e2e:headed          # Show Chromium while tests run
yarn test:e2e:debug           # Open the Playwright debugger
yarn check                    # Lint, typecheck, unit tests, and both builds
```

The normal E2E command builds Chrome first. It intentionally remains separate
from `yarn check` because browser installation and execution are a distinct CI
concern.

## Local Live Fastmail Test

An opt-in local suite exercises the production extension against the real
Fastmail JMAP service. It is separate from normal E2E discovery and is blocked
when the `CI` environment variable is present.

```bash
JMAP_TOKEN='your-fastmail-api-token' yarn test:e2e:live
```

The token must grant access to Fastmail's masked email JMAP capability.
Set `E2E_HEADED=1` as well to watch the browser. The test authenticates through
the popup, creates a uniquely marked masked email, edits it, disables and
enables it, favorites it, soft-deletes it, permanently deletes it, and logs
out. Server state is verified through direct JMAP requests after each mutation.

The suite removes stale records carrying the dedicated live-test description
marker before it starts and performs best-effort cleanup in `finally`. Do not
send mail to an address while the test is running because Fastmail may then
prevent permanent deletion. Playwright traces and screenshots follow the
normal local policy and can contain the supplied token or authenticated state;
keep those artifacts on the local machine.

## Test Architecture

### Installed Extension Harness

`tests/e2e/fixtures/extension.ts` launches a fresh persistent Chromium context
for every test with only the production extension enabled. It:

- Discovers the generated extension ID through `chrome://extensions/`.
- Opens the popup using its real extension URL.
- Reads and writes `chrome.storage.sync` through the extension origin.
- Captures unexpected `console.error` and `pageerror` events.
- Captures failed network requests and unexpected external requests.
- Requires negative tests to declare expected console errors explicitly.
- Fails teardown when an expected error was not observed.
- Uses a fresh profile and clears synchronized storage for test isolation.

The fixture uses headless Chromium by default. `E2E_HEADED=1`, exposed through
`yarn test:e2e:headed`, switches the custom persistent-context launcher to a
visible browser.

### Fastmail JMAP Mock

`tests/e2e/fixtures/fastmail.ts` intercepts only
`https://api.fastmail.com/**`. The production Fastmail client still creates the
actual session and JMAP requests.

The mock provides:

- A valid session for `valid-e2e-token` and deterministic `401` responses for
  invalid credentials.
- A fixed account ID and required JMAP capabilities.
- Stateful `MaskedEmail/get` and `MaskedEmail/set` behavior.
- Create, update, soft-delete, and permanent-delete mutations.
- Recorded tokens and request bodies for protocol assertions.
- Queued request delays for pending-state tests.
- Queued HTTP failures for retry and recovery tests.
- JMAP operation failures such as `notDestroyed`.
- Malformed create responses with a missing email address.

Canonical records in `tests/e2e/data/maskedEmails.ts` cover enabled, disabled,
deleted, protected, removable, favorite, and field-specific search cases with
fixed timestamps and addresses.

### Popup Page Object

`tests/e2e/pages/popup.ts` centralizes semantic user actions, including login,
search, filter selection, create, edit, state changes, favorites, deletion,
logout, list access, and detail access. Scenario files retain their business
assertions so the page object does not hide expected behavior.

Selectors use roles, accessible names, labels, and state attributes. Test IDs
are limited to stable application boundaries such as popup views and email
rows.

### Clipboard Boundary

Chromium rejects `grantPermissions()` for a `chrome-extension://` origin as an
opaque origin. The extension fixture therefore installs a small deterministic
`navigator.clipboard` implementation before popup code runs. This isolates the
browser limitation while still testing every application call through the
Clipboard API.

Unit tests remain the primary browser API contract coverage. E2E verifies
address, domain, description, ID, create-and-copy behavior, and denied-access
recovery. The denial test overrides the isolated API for one page and confirms
that a reload restores successful copying.

## Accessibility And Testability

The popup gained semantic contracts that benefit keyboard and assistive
technology users as well as tests:

- Login and popup views have stable state boundaries.
- Dialogs use dialog roles, modal state, and labelled headings.
- Email and filter lists use listbox and option semantics.
- Selected items expose `aria-selected`.
- Favorite controls expose pressed state.
- State controls have accessible checkbox labels.
- Search, clear, settings, refresh, copy, edit, delete, and modal controls have
  accessible names.
- Loading indicators use status roles and meaningful labels.
- Email counts are live labelled outputs.
- Filter options support keyboard activation.

Vitest accessibility regressions protect these contracts independently of the
browser suite.

## Automated Scenario Coverage

### Installation And Authentication

- The unpacked production extension appears in `chrome://extensions/`.
- The runtime manifest contains `activeTab` and does not contain `tabs`.
- The popup opens from a `chrome-extension://` URL.
- Fresh storage renders login.
- Valid login sends the entered bearer token and loads Home.
- Login remains disabled while the session request is delayed.
- Invalid credentials show useful feedback and restore controls.
- Token and session are stored and restored.
- Invalid stored credentials are removed.
- Logout removes authentication while preserving preferences.

### Loading, Search, And Filters

- Delayed retrieval keeps both loading regions visible.
- Loaded records render and select the first result.
- Empty accounts show count zero and the empty detail state.
- Search matches address, description, domain, and ID.
- Clearing search restores all records.
- No-result search clears selection.
- All, Enabled, Disabled, Deleted, and Favorites filters show exact membership.
- Default filter selection survives popup reload and reopen.

### Masked Email Lifecycle

An integrated workflow verifies the complete lifecycle:

1. Create an enabled masked email and assert exact JMAP arguments.
2. Assert it is prepended and selected.
3. Edit domain and description and assert request and rendered data.
4. Disable it and verify Disabled membership.
5. Enable it and verify Enabled membership.
6. Favorite it and verify storage and Favorites membership.
7. Soft-delete it and verify Deleted membership.
8. Permanently delete it and verify removal from UI and mock state.

Focused coverage verifies permanent deletion is offered only for a deleted
address whose `lastMessageAt` is null.

### Failure And Recovery

The browser suite injects representative failures and retries successfully:

- Initial list and refresh HTTP failures.
- Create HTTP failure and malformed create success.
- Edit/update, enable/disable, and soft-delete HTTP failures.
- JMAP `notDestroyed` rejection.
- Clipboard rejection.
- Synchronized favorite-storage rejection.

Tests assert useful feedback, restored controls, retained dialog state,
unchanged local and mock data, and recovery. Negative scenarios declare their
expected application and Chromium errors; unrelated errors still fail.

### Persistence

Persistence tests open a second popup document instead of relying only on
reload. They assert exact storage key sets and verify:

- Token, session, favorites, and default filter survive popup reopen.
- Preferences survive logout while authentication does not.
- Search text and selected email intentionally do not persist.
- Invalid-authentication cleanup preserves preferences.

## Product Defects Found And Fixed

### Filter Menu Stacking

The filter menu was painted underneath later email-list content, so visible
options could not be clicked. The menu now has an explicit stacking layer, and
tests use normal pointer interaction rather than bypassing the defect.

### Newly Created Selection Race

`EmailList` previously stored ordinary filter results in effect-driven derived
state. After creation, selection logic compared the new record against the old
list and selected the previous first record. Synchronous filters are now
derived directly from current props; state remains only for the asynchronous
Favorites lookup.

### Firefox Release Patch Reliability

The repository uses `patch-package` to correct Firefox signing behavior in
`semantic-release-firefox-add-on`. Yarn was using Plug'n'Play while the patch
and CI verification expected `node_modules`; the old verification also passed
when its target file was missing.

`.yarnrc.yml` now selects the node-modules linker. CI verifies both patched code
patterns are absent and fails if package files do not exist. The Gecko ID in
the Firefox manifest therefore controls signing as intended.

## Browser Diagnostics And Playwright Policy

Playwright remains serial with one worker until safe parallel isolation is
proven. Configuration includes:

- A 30-second test timeout and 5-second assertion timeout.
- No local retries and two CI retries.
- Retained traces and screenshots on failure.
- CI-only retained failure video.
- Line and HTML reporters in CI and list reporting locally.

Tests do not use arbitrary sleeps. They wait on visible UI, mock calls, mock
state, or synchronized storage. CI uploads `playwright-report/` and
`test-results/` when E2E fails.

## CI And Release Integration

`.github/workflows/release.yml` has independent `quality` and `e2e` jobs on
pull requests and pushes to `main` and `develop`. E2E installs Chromium and
Linux dependencies, builds the production extension, runs the suite, and
uploads failure diagnostics.

The release job depends on both quality and E2E, verifies the Firefox release
patch, and invokes the locked `yarn semantic-release` command. Chrome and
Firefox artifacts cannot publish unless both gates pass.

## Active Tab Strategy

The popup receives `activeTab` only when a user invokes the toolbar action.
Direct extension-page navigation does not grant it. The Phase 12 spike found:

- `chrome.action.openPopup()` creates a hidden CDP target but does not expose
  `Tab.url`.
- Playwright does not expose that action popup as a normal page.
- Chromium CDP has no supported toolbar-action invocation command.
- Synthetic `_execute_action` shortcuts are unreliable headlessly.

No persistent `tabs` permission or production test hook was added.
`tests/Home.spec.tsx` verifies the Tabs API query and confirms the complete URL
is passed to Create. URL-to-origin normalization remains a separate product
decision.

### Manual Active Tab Check

Before public release:

1. Open `https://example.com/account?active-tab=1#manual` in Chrome.
2. Physically click the Masked Email Manager toolbar action.
3. Open Create and verify Domain contains that complete URL.
4. Navigate the same tab elsewhere, reopen through the toolbar, and verify the
   Domain updates.
5. Confirm the built manifest contains `activeTab` and not `tabs`.

## Firefox Strategy

Playwright's Chromium fixture cannot load Firefox WebExtensions. Policy:

- Run comprehensive installed-extension E2E in Chromium.
- Cover shared React behavior with Vitest.
- Build both targets in `yarn check` and verify Firefox with
  `yarn verify:build`.
- Perform a manual Firefox smoke test before merging a public release.

Manual Firefox smoke test:

1. Run `yarn build`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Load `dist-firefox/manifest.json` as a temporary add-on.
4. Smoke test toolbar popup, login, list, create, copy, edit, state, deletion,
   logout, reopen, and active-tab Domain behavior.
5. Check the browser console for unexpected errors.

If Firefox automation becomes necessary, use a separate `web-ext` and
Selenium/Geckodriver harness rather than the Chromium Playwright project.

## Optional Live Fastmail Contract Test

Normal E2E and pull requests must never use a live Fastmail token. A future
live contract workflow should:

- Be manual or scheduled and restricted to the upstream repository.
- Use a protected environment and `E2E_FASTMAIL_TOKEN` from a dedicated test
  account.
- Run serially and independently of UI E2E.
- Create a uniquely prefixed address, retrieve it, update it, and destroy it in
  `finally`.
- Report orphan IDs and addresses if cleanup fails.
- Never run on pull requests.

This optional test would detect external API contract changes without
duplicating deterministic popup coverage.

## Main Files

- `playwright.config.ts`: execution, diagnostics, reporters, and retries.
- `tests/e2e/fixtures/extension.ts`: extension and browser monitoring.
- `tests/e2e/fixtures/fastmail.ts`: stateful Fastmail/JMAP boundary.
- `tests/e2e/pages/popup.ts`: semantic popup operations.
- `tests/e2e/data/maskedEmails.ts`: canonical records.
- `tests/e2e/*.e2e.ts`: authentication, search, CRUD, failures, persistence,
  installation, and clipboard scenarios.
- `.github/workflows/release.yml`: quality, E2E, and gated release jobs.

## Remaining Deliberate Boundaries

- Active-tab toolbar invocation is manual because headless automation does not
  faithfully grant `activeTab`.
- Clipboard behavior uses a fixture implementation because Chromium cannot
  grant permissions to the extension origin through Playwright.
- Firefox uses shared tests, builds, artifact checks, and a manual smoke test.
- Live Fastmail access is intentionally absent from normal automation.
- The complete active tab URL is passed today; changing it to an origin needs
  an explicit product decision.
