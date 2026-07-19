import { baselineEmails } from './data/maskedEmails';
import { expect, test } from './fixtures/test';

test('authenticates and loads masked emails through the JMAP mock', async ({
  fastmail,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);

  await popupPage.login();

  await popupPage.expectHome();
  await expect(
    popupPage.emailOption('alpha@masked.example', 'enabled')
  ).toBeVisible();

  expect(fastmail.calls('session')).toHaveLength(1);
  expect(fastmail.calls('get')).toHaveLength(1);
  expect(fastmail.calls('session')[0].token).toBe('valid-e2e-token');
});

test('disables login while authentication is pending', async ({
  fastmail,
  popup,
  popupPage
}) => {
  const releaseSession = fastmail.delayNext('session');
  await popupPage.login();

  await expect(
    popup.getByRole('button', { name: 'Authenticating...' })
  ).toBeDisabled();
  releaseSession();
  await popupPage.expectHome();
});

test('reports invalid credentials and restores login controls', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  extension.expectConsoleError(/getting a session failed with status code 401/);
  extension.expectConsoleError(
    /Failed to load resource: the server responded with a status of 401/
  );
  await popupPage.login('invalid-token');

  await expect(
    popup.getByText(
      'An error occurred while getting your session with that API token!'
    )
  ).toBeVisible();
  await expect(
    popup.getByRole('button', { name: 'Authenticate' })
  ).toBeEnabled();
  expect(fastmail.calls('session')[0].token).toBe('invalid-token');
});

test('restores authentication from synchronized storage after reload', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();
  await popupPage.expectHome();

  const storage = await extension.getStorage(popup);
  expect(storage.fastmail_api_token).toBe('valid-e2e-token');
  expect(storage.fastmail_session).toBeTruthy();

  await popup.reload();
  await popupPage.expectHome();
  await expect(
    popupPage.emailOption('alpha@masked.example', 'enabled')
  ).toBeVisible();
  expect(fastmail.calls('session')).toHaveLength(2);
});

test('clears an invalid stored token and returns to login', async ({
  extension,
  popup,
  popupPage
}) => {
  await extension.setStorage(popup, {
    fastmail_api_token: 'invalid-stored-token',
    fastmail_session: { accountId: 'stale-account' }
  });
  extension.expectConsoleError(
    /Failed to load resource: the server responded with a status of 401/
  );

  await popup.reload();
  await popupPage.expectLogin();

  const storage = await extension.getStorage(popup);
  expect(storage.fastmail_api_token).toBeUndefined();
  expect(storage.fastmail_session).toBeUndefined();
});

test('logout removes authentication and preserves preferences', async ({
  extension,
  popup,
  popupPage
}) => {
  await popupPage.login();
  await popupPage.expectHome();
  await extension.setStorage(popup, {
    favorite_emails: ['enabled-favorite'],
    default_filter: 'Favorites'
  });

  await popupPage.logout();
  await popupPage.expectLogin();

  const storage = await extension.getStorage(popup);
  expect(storage.fastmail_api_token).toBeUndefined();
  expect(storage.fastmail_session).toBeUndefined();
  expect(storage.favorite_emails).toEqual(['enabled-favorite']);
  expect(storage.default_filter).toBe('Favorites');
});
