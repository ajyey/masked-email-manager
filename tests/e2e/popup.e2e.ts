import { expect, test } from './fixtures/test';

test('loads the unpacked extension popup', async ({ extension, popup }) => {
  await expect(popup.getByTestId('login-view')).toBeVisible();
  await expect(
    popup.getByRole('heading', { name: 'Masked Email Manager' })
  ).toBeVisible();
  await expect(popup.getByLabel('Fastmail API Token')).toBeVisible();
  await expect(
    popup.getByRole('button', { name: 'Authenticate' })
  ).toBeVisible();

  const manifest = await popup.evaluate(() => chrome.runtime.getManifest());
  expect(manifest.permissions).toContain('activeTab');
  expect(manifest.permissions).not.toContain('tabs');
  expect(extension.origin).toContain(extension.id);
});
