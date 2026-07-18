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
  private failedRequests: string[] = [];
  private unexpectedRequests: string[] = [];
  private expectedConsoleErrors: RegExp[] = [];

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
      headless: process.env.E2E_HEADED !== '1',
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
      ]
    });
    await context.addInitScript(() => {
      let clipboardValue = '';
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          readText: () => Promise.resolve(clipboardValue),
          writeText: (value: string) => {
            clipboardValue = value;
            return Promise.resolve();
          }
        }
      });
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

  async readClipboard(page: Page) {
    return page.evaluate(() => navigator.clipboard.readText());
  }

  expectConsoleError(pattern: RegExp) {
    this.expectedConsoleErrors.push(pattern);
  }

  assertNoUnexpectedErrors() {
    const unexpectedErrors = [...this.consoleErrors];
    const missingErrors: string[] = [];
    for (const pattern of this.expectedConsoleErrors) {
      const index = unexpectedErrors.findIndex((error) => pattern.test(error));
      if (index === -1) {
        missingErrors.push(pattern.toString());
      } else {
        unexpectedErrors.splice(index, 1);
      }
    }
    expect(
      missingErrors,
      'Expected popup console errors were not logged'
    ).toEqual([]);
    expect(unexpectedErrors, 'Unexpected popup console errors').toEqual([]);
    expect(this.pageErrors, 'Unexpected popup page errors').toEqual([]);
    expect(this.failedRequests, 'Unexpected failed popup requests').toEqual([]);
    expect(
      this.unexpectedRequests,
      'Unexpected external popup requests'
    ).toEqual([]);
  }

  async close() {
    await this.context.close();
  }

  private monitorPage(page: Page) {
    page.on('console', (message) => {
      if (message.type() === 'error') this.consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => this.pageErrors.push(error.message));
    page.on('requestfailed', (request) => {
      this.failedRequests.push(
        `${request.method()} ${request.url()}: ${request.failure()?.errorText}`
      );
    });
    page.on('request', (request) => {
      const url = request.url();
      if (
        !url.startsWith(this.origin) &&
        !url.startsWith('https://api.fastmail.com/') &&
        !url.startsWith('data:') &&
        !url.startsWith('blob:')
      ) {
        this.unexpectedRequests.push(`${request.method()} ${url}`);
      }
    });
  }
}
