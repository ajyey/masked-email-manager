import { expect } from '@playwright/test';
import { baselineEmails, maskedEmails } from './data/maskedEmails';
import type { ExtensionHarness } from './fixtures/extension';
import type { FastmailMock } from './fixtures/fastmail';
import { test } from './fixtures/test';
import type { PopupPage } from './pages/popup';

function expectHttpFailure(
  extension: ExtensionHarness,
  applicationError: RegExp
) {
  extension.expectConsoleError(applicationError);
  extension.expectConsoleError(
    /Failed to load resource: the server responded with a status of 500/
  );
}

async function loginWithEmails(fastmail: FastmailMock, popupPage: PopupPage) {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);
}

test('recovers from an initial email-list failure', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  fastmail.failNext('get');
  expectHttpFailure(extension, /Error fetching masked emails:/);

  await popupPage.login();
  await expect(
    popup.getByText('Unable to load masked emails. Please try again.', {
      exact: true
    })
  ).toBeVisible();
  await expect(popupPage.emailCount(0)).toBeVisible();
  await expect(popup.getByText('Nothing to see here..')).toBeVisible();

  await popup.getByRole('button', { name: 'Refresh masked emails' }).click();
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);
});

test('preserves existing emails when refresh fails and allows retry', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  fastmail.failNext('get');
  expectHttpFailure(extension, /Error fetching masked emails:/);

  await popup.getByRole('button', { name: 'Refresh masked emails' }).click();
  await expect(
    popup.getByText('Unable to load masked emails. Please try again.', {
      exact: true
    })
  ).toBeVisible();
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);
  await expect(
    popupPage.emailOption(maskedEmails.enabledAlpha.email, 'enabled')
  ).toHaveAttribute('aria-selected', 'true');

  await popup.getByRole('button', { name: 'Refresh masked emails' }).click();
  await expect(fastmail.calls('get')).toHaveLength(3);
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);
});

test('keeps create input available after failure and retries successfully', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  fastmail.failNext('create');
  expectHttpFailure(extension, /Error creating new email:/);

  await popup.getByRole('button', { name: 'Create', exact: true }).click();
  const dialog = popup.getByRole('dialog', { name: 'Create Email' });
  await dialog
    .getByRole('textbox', { name: 'Domain', exact: true })
    .fill('https://retry.example');
  await dialog
    .getByRole('textbox', { name: 'Description', exact: true })
    .fill('Retry account');
  await dialog.getByRole('button', { name: 'Create', exact: true }).click();

  await expect(
    popup.getByText('Unable to create a masked email. Please try again.', {
      exact: true
    })
  ).toBeVisible();
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('textbox', { name: 'Description', exact: true })
  ).toHaveValue('Retry account');
  await expect(
    dialog.getByRole('button', { name: 'Create', exact: true })
  ).toBeEnabled();
  expect(fastmail.emailById('created-1')).toBeUndefined();

  await dialog.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(
    popupPage.emailOption('created-1@masked.example', 'enabled')
  ).toBeVisible();
});

test('rejects a malformed create response and allows a new attempt', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  fastmail.omitEmailFromNextCreate();
  extension.expectConsoleError(
    /Error creating new email: Error: Fastmail returned an email without an address/
  );

  await popup.getByRole('button', { name: 'Create', exact: true }).click();
  const dialog = popup.getByRole('dialog', { name: 'Create Email' });
  await dialog
    .getByRole('textbox', { name: 'Domain', exact: true })
    .fill('https://malformed.example');
  await dialog
    .getByRole('textbox', { name: 'Description', exact: true })
    .fill('Malformed response');
  await dialog.getByRole('button', { name: 'Create', exact: true }).click();

  await expect(
    popup.getByText('Unable to create a masked email. Please try again.', {
      exact: true
    })
  ).toBeVisible();
  await expect(dialog).toBeVisible();
  await expect(popup.getByTestId('email-row-created-1')).toHaveCount(0);
  expect(fastmail.emailById('created-1')).toBeDefined();

  await dialog.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(
    popupPage.emailOption('created-2@masked.example', 'enabled')
  ).toBeVisible();
});

test('keeps edit mode and original data after update failure', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  fastmail.failNext('update');
  expectHttpFailure(extension, /Unable to save changes to this masked email:/);

  await popup.getByRole('button', { name: 'Edit', exact: true }).click();
  await popup
    .getByRole('textbox', { name: 'domain', exact: true })
    .fill('https://retry-update.example');
  await popup
    .getByRole('textbox', { name: 'description', exact: true })
    .fill('Retry update');
  await popup.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(
    popup.getByText(
      'Unable to save changes to this masked email. Please try again.',
      { exact: true }
    )
  ).toBeVisible();
  await expect(
    popup.getByRole('textbox', { name: 'description', exact: true })
  ).toHaveValue('Retry update');
  expect(fastmail.emailById(maskedEmails.enabledAlpha.id)).toMatchObject({
    description: maskedEmails.enabledAlpha.description,
    forDomain: maskedEmails.enabledAlpha.forDomain
  });

  await popup.getByRole('button', { name: 'Save', exact: true }).click();
  await expect
    .poll(() => fastmail.emailById(maskedEmails.enabledAlpha.id))
    .toMatchObject({
      description: 'Retry update',
      forDomain: 'https://retry-update.example'
    });
  await expect(popup.getByRole('button', { name: 'Edit' })).toBeVisible();
});

test('does not change state after a failed toggle and allows retry', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  fastmail.failNext('update');
  expectHttpFailure(extension, /Unable to change the masked email state:/);

  await popupPage.setSelectedEmailEnabled(false);
  await expect(
    popup.getByText(
      'Unable to change the masked email state. Please try again.',
      { exact: true }
    )
  ).toBeVisible();
  await expect(
    popup.getByRole('checkbox', { name: 'Masked email enabled' })
  ).toBeChecked();
  expect(fastmail.emailById(maskedEmails.enabledAlpha.id)?.state).toBe(
    'enabled'
  );

  await popupPage.setSelectedEmailEnabled(false);
  await expect
    .poll(() => fastmail.emailById(maskedEmails.enabledAlpha.id)?.state)
    .toBe('disabled');
});

test('does not soft-delete locally after failure and allows retry', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  fastmail.failNext('update');
  expectHttpFailure(extension, /Unable to delete this masked email:/);

  await popupPage.softDeleteSelectedEmail();
  await expect(
    popup.getByText('Unable to delete this masked email. Please try again.', {
      exact: true
    })
  ).toBeVisible();
  await expect(
    popupPage.emailOption(maskedEmails.enabledAlpha.email, 'enabled')
  ).toBeVisible();
  expect(fastmail.emailById(maskedEmails.enabledAlpha.id)?.state).toBe(
    'enabled'
  );

  await popupPage.softDeleteSelectedEmail();
  await expect
    .poll(() => fastmail.emailById(maskedEmails.enabledAlpha.id)?.state)
    .toBe('deleted');
});

test('keeps the confirmation open after notDestroyed and allows retry', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  await popupPage.selectFilter('Deleted');
  await popupPage.selectEmail(maskedEmails.deletedRemovable.email, 'deleted');
  fastmail.failNextSet('destroy', 'E2E destroy rejected');
  extension.expectConsoleError(
    /Unable to permanently delete this masked email:.*E2E destroy rejected/
  );

  await popup
    .getByRole('button', { name: 'Permanently Delete', exact: true })
    .click();
  const dialog = popup.getByRole('dialog', {
    name: 'Permanently Delete Email'
  });
  const confirm = dialog.getByRole('button', {
    name: 'Permanently delete',
    exact: true
  });
  await confirm.click();

  await expect(
    popup.getByText(
      'Unable to permanently delete this masked email. Please try again.',
      { exact: true }
    )
  ).toBeVisible();
  await expect(dialog).toBeVisible();
  await expect(
    popupPage.emailOption(maskedEmails.deletedRemovable.email, 'deleted')
  ).toBeVisible();
  expect(fastmail.emailById(maskedEmails.deletedRemovable.id)).toBeDefined();

  await confirm.click();
  await expect(dialog).toBeHidden();
  await expect(
    popup.getByTestId(`email-row-${maskedEmails.deletedRemovable.id}`)
  ).toHaveCount(0);
  expect(fastmail.emailById(maskedEmails.deletedRemovable.id)).toBeUndefined();
});

test('reports clipboard denial without changing data and recovers after reload', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  extension.expectConsoleError(
    /Unable to copy to the clipboard: Error: E2E clipboard denied/
  );
  await popup.evaluate(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', {
      configurable: true,
      value: () => Promise.reject(new Error('E2E clipboard denied'))
    });
  });

  await popup.getByRole('button', { name: 'Copy email address' }).click();
  await expect(
    popup.getByText('Unable to copy to the clipboard. Please try again.', {
      exact: true
    })
  ).toBeVisible();
  await expect(
    popupPage.emailOption(maskedEmails.enabledAlpha.email, 'enabled')
  ).toHaveAttribute('aria-selected', 'true');

  await popup.reload();
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);
  await popup.getByRole('button', { name: 'Copy email address' }).click();
  await expect(
    popup.getByText('Copied to clipboard!', { exact: true })
  ).toBeVisible();
});

test('does not favorite locally when synchronized storage rejects the update', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  await loginWithEmails(fastmail, popupPage);
  extension.expectConsoleError(
    /Unable to update favorites: Error: E2E storage denied/
  );
  await popup.evaluate(() => {
    chrome.storage.sync.set = () =>
      Promise.reject(new Error('E2E storage denied'));
  });

  await popup.getByRole('button', { name: 'Add to favorites' }).click();
  await expect(
    popup.getByText('Unable to update favorites. Please try again.', {
      exact: true
    })
  ).toBeVisible();
  await expect(
    popup.getByRole('button', { name: 'Add to favorites' })
  ).toHaveAttribute('aria-pressed', 'false');
  expect((await extension.getStorage(popup)).favorite_emails).toBeUndefined();

  await popup.reload();
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);
  await popup.getByRole('button', { name: 'Add to favorites' }).click();
  await expect(
    popup.getByRole('button', { name: 'Remove from favorites' })
  ).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(async () => (await extension.getStorage(popup)).favorite_emails)
    .toContain(maskedEmails.enabledAlpha.id);
});
