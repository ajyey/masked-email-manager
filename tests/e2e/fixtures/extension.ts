import {
  chromium,
  expect,
  type BrowserContext,
  type Page
} from '@playwright/test';
import { resolve } from 'node:path';

export class ExtensionHarness {
  private consoleErrors: string[] = [];
  private pageErrors: string[] = [];

  private constructor(
    readonly context: BrowserContext,
    readonly id: string
  ) {
    context.on('page', (page) => this.monitorPage(page));
  }

  static async launch() {
    const extensionPath = resolve(
      import.meta.dirname,
      '..',
      '..',
      '..',
      'dist'
    );
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      headless: true,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
      ]
    });

    const extensionsPage = await context.newPage();
    await extensionsPage.goto('chrome://extensions/');
    const extensionItem = extensionsPage
      .locator('extensions-item')
      .filter({ hasText: 'Masked Email Manager' });
    await expect(extensionItem).toHaveCount(1);
    const id = await extensionItem.getAttribute('id');
    if (!id) throw new Error('Unable to discover the unpacked extension ID');
    await extensionsPage.close();

    return new ExtensionHarness(context, id);
  }

  get origin() {
    return `chrome-extension://${this.id}`;
  }

  get popupUrl() {
    return `${this.origin}/src/pages/popup/index.html`;
  }

  async openPopup() {
    const page = await this.context.newPage();
    await page.goto(this.popupUrl);
    return page;
  }

  async clearStorage(page: Page) {
    await page.evaluate(() => chrome.storage.sync.clear());
  }

  async getStorage(page: Page) {
    return page.evaluate(() => chrome.storage.sync.get());
  }

  async setStorage(page: Page, values: Record<string, unknown>) {
    await page.evaluate((items) => chrome.storage.sync.set(items), values);
  }

  assertNoUnexpectedErrors() {
    expect(this.consoleErrors, 'Unexpected popup console errors').toEqual([]);
    expect(this.pageErrors, 'Unexpected popup page errors').toEqual([]);
  }

  async close() {
    await this.context.close();
  }

  private monitorPage(page: Page) {
    page.on('console', (message) => {
      if (message.type() === 'error') this.consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => this.pageErrors.push(error.message));
  }
}
