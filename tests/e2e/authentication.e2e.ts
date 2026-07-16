import { baselineEmails } from './data/maskedEmails';
import { expect, test } from './fixtures/test';

test('authenticates and loads masked emails through the JMAP mock', async ({
  fastmail,
  popup
}) => {
  fastmail.seedEmails(baselineEmails);

  await popup.getByLabel('Fastmail API Token').fill('valid-e2e-token');
  await popup.getByRole('button', { name: 'Authenticate' }).click();

  await expect(popup.getByTestId('home-view')).toBeVisible();
  await expect(
    popup.getByRole('option', { name: 'alpha@masked.example, enabled' })
  ).toBeVisible();

  expect(fastmail.calls('session')).toHaveLength(1);
  expect(fastmail.calls('get')).toHaveLength(1);
  expect(fastmail.calls('session')[0].token).toBe('valid-e2e-token');
});
