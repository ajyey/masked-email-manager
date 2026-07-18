import { expect } from '@playwright/test';
import { baselineEmails, maskedEmails } from './data/maskedEmails';
import { test } from './fixtures/test';

test('copies each selected email detail through the Clipboard API', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);

  const copyCases = [
    { button: 'Copy email address', value: maskedEmails.enabledAlpha.email },
    { button: 'Copy domain', value: maskedEmails.enabledAlpha.forDomain },
    {
      button: 'Copy description',
      value: maskedEmails.enabledAlpha.description
    },
    { button: 'Copy email ID', value: maskedEmails.enabledAlpha.id }
  ];

  for (const { button, value } of copyCases) {
    await popup.getByRole('button', { name: button }).click();
    await expect.poll(() => extension.readClipboard(popup)).toBe(value);
    await expect(
      popup.getByText('Copied to clipboard!', { exact: true }).last()
    ).toBeVisible();
  }
});

test('creates an email and copies its address through the Clipboard API', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();

  await popupPage.createEmail({
    domain: 'https://clipboard.example',
    description: 'Clipboard account'
  });

  await expect(
    popupPage.emailOption('created-1@masked.example', 'enabled')
  ).toHaveAttribute('aria-selected', 'true');
  await expect
    .poll(() => extension.readClipboard(popup))
    .toBe('created-1@masked.example');
  await expect(
    popup.getByText(
      'New email created-1@masked.example created and copied to clipboard!',
      { exact: true }
    )
  ).toBeVisible();
});
