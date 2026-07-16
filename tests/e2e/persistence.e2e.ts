import { expect, type Page } from '@playwright/test';
import { baselineEmails, maskedEmails } from './data/maskedEmails';
import type { ExtensionHarness } from './fixtures/extension';
import type { FastmailMock } from './fixtures/fastmail';
import { test } from './fixtures/test';
import { PopupPage } from './pages/popup';

const authKeys = ['fastmail_api_token', 'fastmail_session'];
const preferenceKeys = ['default_filter', 'favorite_emails'];

function expectStorageKeys(
  storage: Record<string, unknown>,
  expectedKeys: string[]
) {
  expect(Object.keys(storage).sort()).toEqual([...expectedKeys].sort());
}

async function loginWithEmails(fastmail: FastmailMock, popupPage: PopupPage) {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);
}

async function openReopenedPopup(extension: ExtensionHarness) {
  const page = await extension.openPopup();
  const popupPage = new PopupPage(page);
  await popupPage.expectHome();
  return { page, popupPage };
}

async function closePage(page: Page) {
  await page.close();
}

test('restores only the token and session in a reopened popup', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  const originalStorage = await extension.getStorage(popup);
  expectStorageKeys(originalStorage, authKeys);
  expect(originalStorage.fastmail_api_token).toBe('valid-e2e-token');
  expect(originalStorage.fastmail_session).toEqual(
    expect.objectContaining({ username: 'e2e@fastmail.example' })
  );

  const reopened = await openReopenedPopup(extension);
  try {
    await expect(reopened.popupPage.emailOptions()).toHaveCount(
      baselineEmails.length
    );
    expect(fastmail.calls('session')).toHaveLength(2);
    expectStorageKeys(await extension.getStorage(reopened.page), authKeys);
  } finally {
    await closePage(reopened.page);
  }
});

test('restores favorites and their filter membership after reopen', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  await popupPage.favoriteSelectedEmail();
  await expect
    .poll(async () => (await extension.getStorage(popup)).favorite_emails)
    .toEqual([maskedEmails.enabledAlpha.id]);

  const reopened = await openReopenedPopup(extension);
  try {
    await expect(
      reopened.page.getByRole('button', { name: 'Remove from favorites' })
    ).toHaveAttribute('aria-pressed', 'true');
    await reopened.popupPage.selectFilter('Favorites');
    await expect(reopened.popupPage.emailOptions()).toHaveCount(1);
    await expect(
      reopened.popupPage.emailOption(maskedEmails.enabledAlpha.email, 'enabled')
    ).toBeVisible();

    const storage = await extension.getStorage(reopened.page);
    expectStorageKeys(storage, [
      ...authKeys,
      'favorite_emails',
      'default_filter'
    ]);
    expect(storage.favorite_emails).toEqual([maskedEmails.enabledAlpha.id]);
    expect(storage.default_filter).toBe('Favorites');
  } finally {
    await closePage(reopened.page);
  }
});

test('restores the default filter after reopen', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  await popupPage.selectFilter('Disabled');
  await expect
    .poll(async () => (await extension.getStorage(popup)).default_filter)
    .toBe('Disabled');

  const reopened = await openReopenedPopup(extension);
  try {
    await expect(reopened.popupPage.filterButton('Disabled')).toBeVisible();
    await expect(reopened.popupPage.emailCount(2)).toBeVisible();
    const storage = await extension.getStorage(reopened.page);
    expectStorageKeys(storage, [...authKeys, 'default_filter']);
    expect(storage.default_filter).toBe('Disabled');
  } finally {
    await closePage(reopened.page);
  }
});

test('logout removes authentication but preserves all preferences', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  await popupPage.favoriteSelectedEmail();
  await popupPage.selectFilter('Disabled');
  await expect
    .poll(async () => Object.keys(await extension.getStorage(popup)))
    .toHaveLength(4);

  await popupPage.logout();
  await popupPage.expectLogin();

  const storage = await extension.getStorage(popup);
  expectStorageKeys(storage, preferenceKeys);
  expect(storage.favorite_emails).toEqual([maskedEmails.enabledAlpha.id]);
  expect(storage.default_filter).toBe('Disabled');
});

test('does not persist search text or selected email', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  await popupPage.search('beta');
  await expect(
    popupPage.emailOption(maskedEmails.disabledBeta.email, 'disabled')
  ).toHaveAttribute('aria-selected', 'true');
  expectStorageKeys(await extension.getStorage(popup), authKeys);

  const reopened = await openReopenedPopup(extension);
  try {
    await expect(
      reopened.page.getByRole('textbox', { name: 'Search masked emails' })
    ).toHaveValue('');
    await expect(
      reopened.popupPage.emailOption(maskedEmails.enabledAlpha.email, 'enabled')
    ).toHaveAttribute('aria-selected', 'true');
    expectStorageKeys(await extension.getStorage(reopened.page), authKeys);
  } finally {
    await closePage(reopened.page);
  }
});

test('invalid authentication cleanup preserves preferences', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  await extension.setStorage(popup, {
    fastmail_api_token: 'invalid-stored-token',
    fastmail_session: { accountId: 'stale-account' },
    favorite_emails: [maskedEmails.enabledFavorite.id],
    default_filter: 'Favorites'
  });
  extension.expectConsoleError(
    /Failed to load resource: the server responded with a status of 401/
  );

  const invalidPage = await extension.openPopup();
  const invalidPopup = new PopupPage(invalidPage);
  try {
    await invalidPopup.expectLogin();
    const storage = await extension.getStorage(invalidPage);
    expectStorageKeys(storage, preferenceKeys);
    expect(storage.favorite_emails).toEqual([maskedEmails.enabledFavorite.id]);
    expect(storage.default_filter).toBe('Favorites');
  } finally {
    await closePage(invalidPage);
  }
});
