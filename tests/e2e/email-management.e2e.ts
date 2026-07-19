import { expect } from '@playwright/test';
import { baselineEmails, maskedEmails } from './data/maskedEmails';
import type { FastmailMock, FastmailOperation } from './fixtures/fastmail';
import { test } from './fixtures/test';

function lastJmapArguments(
  fastmail: FastmailMock,
  operation: FastmailOperation
) {
  const body = fastmail.calls(operation).at(-1)?.body;
  const methodCalls = body?.methodCalls as
    [string, Record<string, unknown>, string][] | undefined;
  expect(methodCalls).toBeDefined();
  return methodCalls![0][1];
}

test('manages a masked email through its complete lifecycle', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);

  await popupPage.createEmail({
    domain: 'https://created.example',
    description: 'Created account'
  });

  const createdAddress = 'created-1@masked.example';
  const enabledEmailCount = baselineEmails.filter(
    (email) => email.state === 'enabled'
  ).length;
  await expect(popupPage.emailOptions()).toHaveCount(enabledEmailCount + 1);
  await expect(popupPage.emailOptions().first()).toHaveAccessibleName(
    `${createdAddress}, enabled`
  );
  await expect(
    popupPage.emailOption(createdAddress, 'enabled')
  ).toHaveAttribute('aria-selected', 'true');
  expect(lastJmapArguments(fastmail, 'create')).toMatchObject({
    accountId: 'e2e-account',
    create: {
      '0': {
        forDomain: 'https://created.example',
        description: 'Created account',
        state: 'enabled'
      }
    }
  });

  await popupPage.editSelectedEmail({
    domain: 'https://updated.example',
    description: 'Updated account'
  });
  await expect
    .poll(() => fastmail.emailById('created-1'))
    .toMatchObject({
      description: 'Updated account',
      forDomain: 'https://updated.example'
    });
  expect(lastJmapArguments(fastmail, 'update')).toMatchObject({
    update: {
      'created-1': {
        description: 'Updated account',
        forDomain: 'https://updated.example'
      }
    }
  });
  await expect(popupPage.detail('domainLabel')).toContainText(
    'https://updated.example'
  );
  await expect(popupPage.detail('emailDescriptionLabel')).toContainText(
    'Updated account'
  );

  await popupPage.setSelectedEmailEnabled(false);
  await expect
    .poll(() => fastmail.emailById('created-1')?.state)
    .toBe('disabled');
  expect(lastJmapArguments(fastmail, 'update')).toMatchObject({
    update: { 'created-1': { state: 'disabled' } }
  });
  await popupPage.selectFilter('Disabled');
  await popupPage.selectEmail(createdAddress, 'disabled');
  await expect(
    popupPage.emailOption(createdAddress, 'disabled')
  ).toHaveAttribute('aria-selected', 'true');

  await popupPage.setSelectedEmailEnabled(true);
  await expect
    .poll(() => fastmail.emailById('created-1')?.state)
    .toBe('enabled');
  expect(lastJmapArguments(fastmail, 'update')).toMatchObject({
    update: { 'created-1': { state: 'enabled' } }
  });
  await popupPage.selectFilter('Enabled');
  await popupPage.selectEmail(createdAddress, 'enabled');

  await popupPage.favoriteSelectedEmail();
  await expect
    .poll(async () => (await extension.getStorage(popup)).favorite_emails)
    .toContain('created-1');
  await popupPage.selectFilter('Favorites');
  await expect(popupPage.emailOptions()).toHaveCount(1);
  await expect(popupPage.emailOption(createdAddress, 'enabled')).toBeVisible();

  await popupPage.softDeleteSelectedEmail();
  await expect
    .poll(() => fastmail.emailById('created-1')?.state)
    .toBe('deleted');
  expect(lastJmapArguments(fastmail, 'update')).toMatchObject({
    update: { 'created-1': { state: 'deleted' } }
  });
  await popupPage.selectFilter('Deleted');
  await popupPage.selectEmail(createdAddress, 'deleted');
  await expect(
    popup.getByRole('checkbox', { name: 'Masked email enabled' })
  ).toBeDisabled();

  await popupPage.permanentlyDeleteSelectedEmail();
  await expect(popup.getByTestId('email-row-created-1')).toHaveCount(0);
  expect(lastJmapArguments(fastmail, 'destroy')).toMatchObject({
    destroy: ['created-1']
  });
  expect(fastmail.emailById('created-1')).toBeUndefined();
});

test('only offers permanent deletion for deleted emails without messages', async ({
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();
  await popupPage.selectFilter('Deleted');

  await popupPage.selectEmail(maskedEmails.deletedProtected.email, 'deleted');
  await expect(
    popup.getByRole('button', { name: 'Permanently Delete', exact: true })
  ).toHaveCount(0);

  await popupPage.selectEmail(maskedEmails.deletedRemovable.email, 'deleted');
  await expect(
    popup.getByRole('button', { name: 'Permanently Delete', exact: true })
  ).toBeVisible();
});
