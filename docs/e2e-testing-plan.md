# End-to-End Testing Suite Plan

## Purpose

Build a deterministic, comprehensive end-to-end suite for Masked Email Manager. The suite must exercise the real production Chrome extension bundle, extension storage, popup UI, and the real `fastmail-masked-email` client without contacting Fastmail or requiring secrets.

This document is intended to be implementation-ready. An agent should inspect the referenced source before editing, execute the phases in order, and keep each phase independently reviewable.

## Current Baseline

- Playwright is configured in `playwright.config.ts`.
- `tests/e2e/popup.e2e.ts` loads the unpacked `dist/` extension, discovers its generated ID through `chrome://extensions`, opens the popup URL, verifies the login UI, and checks runtime permissions.
- `yarn test:e2e:install` installs Playwright Chromium.
- `yarn test:e2e` builds Chrome and runs Playwright.
- `yarn check` intentionally excludes E2E to remain fast and browser-independent.
- Vitest and React Testing Library already cover utilities, service behavior, hooks, login, refresh, and creation interactions.
- Chrome is the initial automated E2E target. Firefox continues to receive shared UI tests plus manifest/build verification until a separate WebDriver harness is justified.

## Goals

- Exercise the actual production extension from `dist/`.
- Cover authentication, loading, search, filters, favorites, refresh, creation, editing, state changes, deletion, logout, persistence, clipboard behavior, and error recovery.
- Use the real `fastmail-masked-email` HTTP client against an in-process Playwright route mock.
- Guarantee that no test contacts the real Fastmail service.
- Keep tests isolated, deterministic, and useful in local development and CI.
- Capture traces, screenshots, console errors, page errors, and unexpected requests on failure.
- Prefer accessible role/name selectors over styling classes or DOM traversal.

## Non-Goals

- Do not require a developer's Fastmail token.
- Do not run destructive live-account tests on pull requests.
- Do not restore persistent `tabs` permission to simplify testing.
- Do not add production-only test hooks if network interception or extension APIs can provide the same coverage.
- Do not force Firefox extension automation into Playwright; Playwright's extension harness is Chromium-specific.
- Do not duplicate every component-level Vitest assertion in E2E.

## Test Layers

| Layer | Responsibility |
| --- | --- |
| Vitest | Utilities, storage validation, service behavior, hooks, and focused component interactions |
| Playwright E2E | Installed Chromium extension, storage, popup workflows, and mocked JMAP integration |
| Build verification | Chrome and Firefox manifests, required files, permissions, and production artifact constraints |
| Optional live test | Minimal Fastmail API compatibility check using a dedicated account |
| Optional Firefox E2E | Separate `web-ext` and WebDriver implementation if later required |

## Target File Structure

```text
tests/e2e/
├── data/
│   └── maskedEmails.ts
├── fixtures/
│   ├── extension.ts
│   ├── fastmail.ts
│   └── test.ts
├── pages/
│   └── popup.ts
├── authentication.e2e.ts
├── email-management.e2e.ts
├── errors.e2e.ts
├── installation.e2e.ts
├── persistence.e2e.ts
└── search-and-filter.e2e.ts
```

Rename the existing `tests/e2e/popup.e2e.ts` to `installation.e2e.ts` after its launch logic moves into the shared fixture.

## Phase 1: Accessibility And Stable Selectors

Improve production accessibility before expanding the suite. Tests should use roles and accessible names wherever possible.

Required changes:

- Add accessible names to search, clear-search, settings, refresh, copy, state, favorite, and modal controls.
- Use `aria-pressed` for Favorite and expose whether the selected email is favorited.
- Give the email state checkbox a meaningful label and expose state through `checked`.
- Associate Domain and Description labels with editable inputs.
- Make email rows keyboard-operable and expose `aria-selected`.
- Give the email list an accessible name.
- Give every modal `role="dialog"`, `aria-modal="true"`, and a labelled heading.
- Remove `aria-hidden="true"` from visible dialogs.
- Rename ambiguous confirmation buttons, such as `Delete`, to `Permanently delete`.
- Expose loading indicators with `role="status"` and useful accessible text.
- Expose errors with `role="alert"` and success messages with `role="status"` where practical.
- Add `data-testid` only for dynamic email row identity or cases where semantic selectors cannot distinguish controls.

Preferred locator examples:

```ts
page.getByRole('button', { name: 'Add to favorites' });
page.getByRole('dialog', { name: 'Create Email' });
page.getByRole('option', { name: /alpha@example.com/i });
page.getByLabel('Masked email domain');
```

Avoid Tailwind class selectors, positional selectors, and implementation-specific DOM chains.

Phase acceptance criteria:

- Critical controls are reachable by role and name.
- Dialog controls can be scoped to a specific dialog.
- Dynamic email rows expose identity and selection.
- Existing Vitest and component tests remain green.

Suggested commit:

```text
chore(no-release): improve popup accessibility for testing
```

## Phase 2: Extension Fixture

Extract extension startup and teardown from the current smoke test into a Playwright fixture.

The fixture must:

- Resolve `dist/` relative to the repository.
- Launch Playwright's pinned Chromium with a temporary persistent profile.
- Load only the unpacked extension using `--disable-extensions-except` and `--load-extension`.
- Discover the generated extension ID through `chrome://extensions`.
- Expose the extension origin and popup URL.
- Open, close, and reopen popup pages.
- Read, write, remove, and clear `chrome.storage.sync` through an extension-origin page.
- Clear extension storage before each test.
- Close contexts in teardown even when tests fail.
- Capture `console.error`, `pageerror`, failed requests, and unhandled rejections.
- Reject unexpected external network traffic.

Recommended fixture API:

```ts
test('example', async ({ extension, popup, fastmail }) => {
  await extension.clearStorage();
  fastmail.seedEmails([...]);
  await popup.open();
});
```

Use a fresh persistent context per test initially. Reliability and isolation are more important than browser startup optimization. Consider a worker-scoped context only after the suite passes repeated runs without state leakage.

Phase acceptance criteria:

- Scenario tests no longer duplicate extension launch logic.
- Every test starts with clean extension storage and mock API state.
- Context cleanup is automatic.
- Unexpected browser errors fail with actionable diagnostics.

## Phase 3: Stateful Fastmail JMAP Mock

Intercept the real requests made by `fastmail-masked-email@3.0.3`:

```text
GET  https://api.fastmail.com/jmap/session
POST https://api.fastmail.com/jmap/api/
```

### Session Endpoint

Return a deterministic session containing:

- `urn:ietf:params:jmap:core` capability.
- `https://www.fastmail.com/dev/maskedemail` capability.
- A stable account ID such as `e2e-account`.
- `apiUrl: https://api.fastmail.com/jmap/api/`.
- Core and masked-email primary account mappings.

Validate the `Authorization: Bearer <token>` header. Use `valid-e2e-token` as the successful token. Allow tests to make other tokens return `401`.

### JMAP Endpoint

Parse the first entry of `methodCalls` and support:

| Method | Behavior |
| --- | --- |
| `MaskedEmail/get` | Return the current in-memory collection |
| `MaskedEmail/set` with `create` | Generate a deterministic ID and email address |
| `MaskedEmail/set` with `update` | Apply description, domain, or state changes |
| `MaskedEmail/set` with `destroy` | Remove the requested record |

The mock should validate:

- The bearer token.
- JMAP core and masked-email capabilities in `using`.
- The expected account ID.
- Correct create, update, and destroy payload shapes.
- Request call IDs where relevant.

The create response should omit `forDomain` and `description`, matching the Fastmail behavior already handled by `CreateEmailModal`.

### Mock Control API

Expose deterministic controls:

```ts
fastmail.seedEmails(emails);
fastmail.failNext('session', 401);
fastmail.failNext('get', 500);
fastmail.failNext('create', 500);
fastmail.delayNext('get');
fastmail.releaseDelayedRequest();
fastmail.calls('update');
fastmail.emailById('enabled-alpha');
```

Support operation-level JMAP failures, including `notDestroyed`, separately from HTTP failures.

Install a catch-all route that aborts unexpected external requests. Local browser internals may need an explicit allowlist, but Fastmail traffic must never escape interception.

Phase acceptance criteria:

- The actual `fastmail-masked-email` dependency communicates with the mock.
- No real token or Fastmail account is required.
- CRUD requests mutate deterministic mock state.
- Tests can delay and fail individual operations.
- Every request is recorded for assertions.

Suggested commit:

```text
test(no-release): add extension and Fastmail E2E fixtures
```

## Phase 4: Popup Page Object

Create `tests/e2e/pages/popup.ts` to centralize selectors and user actions.

Recommended operations:

```ts
await popup.login('valid-e2e-token');
await popup.waitForEmailList();
await popup.search('alpha');
await popup.clearSearch();
await popup.selectFilter('Disabled');
await popup.selectEmail('enabled-alpha');
await popup.createEmail({
  domain: 'https://example.com',
  description: 'Example account'
});
await popup.editSelectedEmail({ description: 'Updated account' });
await popup.setSelectedEmailState('disabled');
await popup.favoriteSelectedEmail();
await popup.softDeleteSelectedEmail();
await popup.permanentlyDeleteSelectedEmail();
await popup.logout();
```

Useful assertion helpers may include:

```ts
await popup.expectEmailVisible('enabled-alpha');
await popup.expectSelectedEmail('enabled-alpha');
await popup.expectError('Unable to load masked emails. Please try again.');
```

Do not hide every assertion in the page object. Scenario files should remain explicit about expected outcomes.

Phase acceptance criteria:

- Scenario files describe workflow intent rather than locator mechanics.
- Duplicate selectors are removed.
- Selector changes are localized to the page object.

## Phase 5: Canonical Test Data

Create fixed records covering all significant states:

| ID | Purpose |
| --- | --- |
| `enabled-alpha` | Enabled email with complete metadata |
| `enabled-favorite` | Favorites and persistence |
| `disabled-beta` | Disabled filter and enable operation |
| `deleted-removable` | Deleted with no messages; permanent deletion allowed |
| `deleted-protected` | Deleted with `lastMessageAt`; permanent deletion unavailable |
| `search-domain` | Unique domain search match |
| `search-description` | Unique description search match |
| `search-id` | Unique ID search match |

Use fixed ISO timestamps and deterministic addresses. Avoid random test data unless uniqueness is required; if used, seed the generator.

## Phase 6: Installation And Authentication

Move the existing smoke test to `installation.e2e.ts` and retain checks for:

- Extension appears in `chrome://extensions`.
- Popup opens through `chrome-extension://`.
- Runtime manifest includes `activeTab` and excludes `tabs`.
- Unauthenticated login UI renders.

Add `authentication.e2e.ts` with independent scenarios:

1. Fresh storage shows loading and then login.
2. Invalid login shows an error and remains logged out.
3. Login controls remain disabled while the session request is delayed.
4. Valid login opens Home and persists token/session.
5. Reopening the popup restores authentication.
6. An invalid stored token is cleared and returns to login.
7. Logout returns to login.
8. Logout removes token/session only.
9. Favorites and default filter survive logout.
10. Session requests contain the entered bearer token.

Do not make authentication tests depend on state from previous tests.

Suggested commit:

```text
test(no-release): cover authentication and loading flows
```

## Phase 7: Loading, Search, And Filters

Create `search-and-filter.e2e.ts`.

Required scenarios:

1. Loading status remains visible while a delayed list request is pending.
2. Loaded emails render and the first result is selected.
3. Empty accounts render count zero and the empty state.
4. Search matches address.
5. Search matches description.
6. Search matches domain.
7. Search matches ID.
8. Clearing search restores all results.
9. No-result search clears selection.
10. All filter shows all records.
11. Enabled filter shows enabled records only.
12. Disabled filter shows disabled records only.
13. Deleted filter shows deleted records only.
14. Favorites filter follows persisted favorite IDs.
15. Selected filter survives popup reopen.

Use a parameterized test for the four searchable fields where it improves readability.

Suggested commit:

```text
test(no-release): cover search and filtering flows
```

## Phase 8: CRUD Happy Path

Create `email-management.e2e.ts`.

Add one integrated happy-path workflow:

1. Authenticate against the mock.
2. Verify seeded records.
3. Create a new masked email.
4. Assert the JMAP create payload.
5. Assert the new record is prepended and selected.
6. Edit description and domain.
7. Assert the update payload and rendered values.
8. Disable the record.
9. Verify Disabled filter membership.
10. Enable it again.
11. Favorite it.
12. Verify Favorites membership.
13. Soft-delete it.
14. Verify Deleted membership.
15. Permanently delete it.
16. Verify removal from both UI and mock state.

Also add focused independent tests for operations whose edge conditions are difficult to diagnose inside the full chain. Permanent deletion should use `deleted-removable`, where `lastMessageAt` is null.

Suggested commit:

```text
test(no-release): cover masked email CRUD flows
```

## Phase 9: Failure And Recovery

Create `errors.e2e.ts`.

Cover one representative failure for each boundary:

- Session request returns `401`.
- Initial list request returns `500`.
- Refresh returns `500`.
- Create returns `500`.
- Create succeeds without an email address.
- Update returns `500`.
- Enable or disable returns `500`.
- Soft delete returns `500`.
- Permanent delete returns `notDestroyed`.
- Clipboard access is denied.
- Storage access fails where practical to simulate reliably.

For each failure assert:

- A useful error is visible.
- Pending controls are restored.
- Dialog state is correct.
- Local UI state was not mutated incorrectly.
- Existing list data remains available when appropriate.
- A retry can subsequently succeed.

Do not test every HTTP status. Cover behavior categories: unauthorized, transport/server failure, malformed success, and operation-level JMAP failure.

## Phase 10: Persistence

Create `persistence.e2e.ts`.

Required scenarios:

- Token and session restore after popup reopen.
- Favorites survive popup reopen.
- Default filter survives popup reopen.
- Preferences survive logout.
- Authentication data does not survive logout.
- Search and selected email are intentionally not persisted.
- Invalid-authentication cleanup does not remove preferences.

Read storage through the extension origin:

```ts
const storage = await popup.evaluate(() => chrome.storage.sync.get());
```

Assert exact expected keys to detect accidental broad storage clearing or unexpected persisted data.

Suggested commit:

```text
test(no-release): cover persistence and failure recovery
```

## Phase 11: Clipboard

Prefer real clipboard behavior if Chromium reliably grants clipboard access to the extension origin:

```ts
await context.grantPermissions(
  ['clipboard-read', 'clipboard-write'],
  { origin: extension.origin }
);
```

Cover:

- Email address copy.
- Domain copy.
- Description copy.
- ID copy.
- Create-and-copy success.
- Clipboard-denied recovery.

If real clipboard access is unreliable in headless Chromium, isolate clipboard stubbing in the extension fixture and retain component tests as the primary browser-API contract coverage.

## Phase 12: Active Tab Spike

The current smoke test opens the popup URL directly, which does not faithfully reproduce clicking the toolbar action and may not grant `activeTab`.

Investigate this separately:

1. Open a deterministic normal page such as `https://example.test/account`.
2. Determine whether the extension action can be invoked through CDP or `chrome.action.openPopup()`.
3. Verify whether that invocation grants access to `Tab.url`.
4. Open Create and assert its Domain value comes from the active page.

If toolbar invocation cannot be made reliable in headless Playwright:

- Keep active-tab extraction covered in Vitest with a mocked Tabs API.
- Maintain a small manual release checklist for toolbar invocation.
- Do not restore persistent `tabs` permission.
- Do not add production-only test hooks solely for this scenario.

Also decide whether Create should receive the complete URL or only `new URL(url).origin`; Fastmail documents `forDomain` as protocol and domain/origin.

## Phase 13: Browser Error Monitoring

The extension fixture should collect:

- `pageerror` events.
- Unexpected `console.error` messages.
- Failed network requests.
- Unhandled promise rejections.
- Unexpected external requests.
- Trace output.
- Screenshot on failure.
- Optional CI-only video.

Expected errors should be declared per test instead of globally ignored. At teardown, fail if expected errors were not observed or unexpected errors remain.

## Phase 14: Playwright Configuration

Evolve `playwright.config.ts` toward:

```ts
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never' }]]
    : 'list',
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off'
  }
});
```

Rules:

- Never use arbitrary `waitForTimeout` calls.
- Wait on visible UI state, mock request completion, or storage state.
- Keep one worker until isolation is proven.
- Keep retries CI-only so local flakes remain visible.

Add scripts if useful:

```json
{
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:debug": "playwright test --debug"
}
```

## Phase 15: CI Integration

Add a separate `e2e` job rather than adding browser tests to `yarn check`.

Recommended workflow dependencies:

```text
quality ──┐
          ├── release
e2e ──────┘
```

E2E job steps:

1. Checkout.
2. Install Node 24.
3. Enable Corepack.
4. Run `yarn install --immutable`.
5. Run `yarn playwright install --with-deps chromium`.
6. Run `yarn test:e2e`.
7. Upload `playwright-report/` and `test-results/` on failure.

Run E2E on pull requests and pushes to `main` and `develop`. Make release depend on both quality and E2E after the suite has demonstrated stability.

Cache `~/.cache/ms-playwright` only if browser download time becomes material. Key the cache by OS and `yarn.lock`.

Suggested commit:

```text
ci(no-release): run extension E2E checks on pull requests
```

## Phase 16: Optional Live Fastmail Contract Test

Do not use a live token in normal E2E or pull requests.

A future live job should be:

- Manual or scheduled.
- Restricted to the upstream repository.
- Backed by a dedicated Fastmail test account.
- Supplied through `E2E_FASTMAIL_TOKEN`.
- Serial and non-parallel.
- Limited to create, retrieve, update, and cleanup.
- Responsible for deleting created addresses in `finally`.
- Prefixing descriptions with a test-run identifier.
- Reporting orphan records for manual cleanup.

The live test verifies external API compatibility; it should not duplicate UI coverage.

## Phase 17: Firefox Strategy

Playwright cannot load Firefox WebExtensions through the Chromium fixture model.

Initial policy:

- Run comprehensive E2E against Chromium.
- Keep shared UI behavior covered by Vitest.
- Verify Firefox manifests and artifacts through `yarn verify:build`.
- Perform a manual Firefox smoke test before release.

If automated Firefox testing becomes necessary, create a separate `web-ext` and Selenium/Geckodriver harness. Keep it outside the Playwright project.

## Scenario Matrix

| Area | Happy path | Failure/recovery | Persistence |
| --- | --- | --- | --- |
| Installation | Extension loads and popup opens | Manifest/load failure reported | N/A |
| Login | Valid token opens Home | Invalid token, delayed request | Token/session restore |
| List | Seeded and empty states | Initial load and refresh fail | Reopen refetches |
| Search | Address, description, domain, ID | No results | Not persisted |
| Filters | All, enabled, disabled, deleted, favorites | Storage failure where practical | Default filter restored |
| Create | Add, select, copy | API, malformed response, clipboard | Created item survives UI transitions |
| Edit | Domain and description | Update failure retains edit mode | Server state reflected after reopen |
| State | Enable and disable | Update failure leaves state unchanged | Server state reflected after reopen |
| Favorite | Add and remove | Storage failure | Survives reopen/logout |
| Soft delete | Moves to deleted | API failure | Server state reflected after reopen |
| Permanent delete | Removes eligible record | `notDestroyed` leaves modal open | Favorite cleanup should be checked |
| Logout | Returns to login | Pending/duplicate behavior | Preferences retained, auth removed |
| Clipboard | Detail and create copy | Permission denial | N/A |

## Known Risks The Suite Should Expose

- Canceled or stale edit values may later be applied to another selection.
- Refresh may leave stale selected-email detail data when the same ID returns with updated fields.
- Transient network failure during auth restoration is currently treated like an invalid token and can clear authentication.
- Active-tab Domain currently receives the complete URL rather than a normalized origin.
- Deleted records may remain state-toggleable.
- Logout confirmation copy may disagree with preference-preservation behavior.
- Permanent deletion may leave orphan favorite IDs.
- Mutation controls other than login, refresh, and create may allow duplicate requests.
- Create's header close button may remain usable while creation is pending.
- Active-tab, default-filter, and favorites filtering failures may have incomplete user feedback.
- Create's automatic Enabled filter may not persist as the remembered filter.
- Selected email objects are mutated in place, increasing stale-state risk.

When an E2E test reveals one of these issues, fix the production behavior in a separate commit from the test infrastructure whenever practical.

## Implementation Order And Commits

Implement in this order:

1. Accessibility and stable selectors.
2. Extension fixture and error monitoring.
3. Stateful Fastmail mock.
4. Popup page object and canonical data.
5. Installation, authentication, and loading tests.
6. Search and filter tests.
7. CRUD happy path and focused mutation tests.
8. Failure and recovery tests.
9. Persistence and clipboard tests.
10. Active-tab automation spike.
11. CI job and failure artifact upload.
12. Local testing documentation and `AGENTS.md` updates.

Recommended commits:

```text
chore(no-release): improve popup accessibility for testing
test(no-release): add extension and Fastmail E2E fixtures
test(no-release): cover authentication and loading flows
test(no-release): cover search and filtering flows
test(no-release): cover masked email CRUD flows
test(no-release): cover persistence and failure recovery
ci(no-release): run extension E2E checks on pull requests
docs(no-release): document extension E2E workflows
```

Inspect `.releaserc.js` before using `refactor(no-release)`: custom `refactor` release rules may take precedence over the no-release scope. Prefer `chore(no-release)` for test-supporting production refactors unless release behavior is intentionally desired.

## Verification During Implementation

After each phase run the narrowest relevant command, then the full checks before committing:

```bash
yarn test
yarn typecheck
yarn lint
yarn test:e2e
yarn check
```

Use stress runs before enabling E2E as a release gate:

```bash
yarn test:e2e:run --repeat-each=10
```

No test should depend on retries to pass locally.

## Completion Criteria

The suite is complete when:

- `yarn test:e2e` works after one `yarn test:e2e:install` command.
- No real Fastmail request leaves Chromium.
- Authentication, loading, search, filters, create, edit, state changes, favorites, deletion, logout, and persistence are covered.
- Every major API operation has a representative failure and retry assertion.
- Tests use semantic selectors rather than styling classes.
- Extension storage and JMAP payloads are asserted.
- Each test starts from isolated storage and mock API state.
- Unexpected browser errors and network requests fail tests.
- `playwright test --repeat-each=10` passes without flakes.
- CI uploads traces and screenshots for failures.
- Release publishing is gated by stable E2E results.
- `yarn check` remains fast and browser-independent.
- Firefox continues to pass production build and manifest verification.
