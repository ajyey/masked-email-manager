import { test as base, expect, type Page } from '@playwright/test';

import { ExtensionHarness } from '../../e2e/fixtures/extension';
import { PopupPage } from '../../e2e/pages/popup';

interface LiveFixtures {
  extension: ExtensionHarness;
  popup: Page;
  popupPage: PopupPage;
}

export const test = base.extend<LiveFixtures>({
  extension: async ({}, provide) => {
    const extension = await ExtensionHarness.launch();
    try {
      await provide(extension);
      extension.assertNoUnexpectedErrors();
    } finally {
      await extension.close();
    }
  },
  popup: async ({ extension }, provide) => {
    const popup = await extension.openPopup();
    await provide(popup);
    await popup.close();
  },
  popupPage: async ({ popup }, provide) => {
    await provide(new PopupPage(popup));
  }
});

export { expect };
