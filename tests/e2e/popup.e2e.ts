import { chromium, expect, test } from '@playwright/test';
import { resolve } from 'node:path';

test('loads the unpacked extension popup', async () => {
  const extensionPath = resolve(import.meta.dirname, '..', '..', 'dist');
  const context = await chromium.launchPersistentContext('', {
    channel: 'chromium',
    headless: true,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });

  try {
    const extensionsPage = await context.newPage();
    await extensionsPage.goto('chrome://extensions/');

    const extensionItem = extensionsPage
      .locator('extensions-item')
      .filter({ hasText: 'Masked Email Manager' });
    await expect(extensionItem).toHaveCount(1);

    const extensionId = await extensionItem.getAttribute('id');
    expect(extensionId).toBeTruthy();

    const popup = await context.newPage();
    await popup.goto(
      `chrome-extension://${extensionId}/src/pages/popup/index.html`
    );

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
  } finally {
    await context.close();
  }
});
