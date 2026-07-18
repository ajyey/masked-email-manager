import { test as base, expect, type Page } from '@playwright/test';

import { ExtensionHarness } from './extension';
import { FastmailMock } from './fastmail';
import { PopupPage } from '../pages/popup';

interface E2EFixtures {
  extension: ExtensionHarness;
  fastmail: FastmailMock;
  popup: Page;
  popupPage: PopupPage;
}

export const test = base.extend<E2EFixtures>({
  extension: async ({}, provide) => {
    const extension = await ExtensionHarness.launch();
    try {
      await provide(extension);
      extension.assertNoUnexpectedErrors();
    } finally {
      await extension.close();
    }
  },
  fastmail: async ({ extension }, provide) => {
    const fastmail = new FastmailMock(extension.context);
    await fastmail.install();
    await provide(fastmail);
  },
  popup: async ({ extension, fastmail: _fastmail }, provide) => {
    const popup = await extension.openPopup();
    await provide(popup);
    await popup.close();
  },
  popupPage: async ({ popup }, provide) => {
    await provide(new PopupPage(popup));
  }
});

export { expect };
