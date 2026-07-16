import { expect, type Page } from '@playwright/test';

export class PopupPage {
  constructor(readonly page: Page) {}

  async login(token = 'valid-e2e-token') {
    await this.page.getByLabel('Fastmail API Token').fill(token);
    await this.page.getByRole('button', { name: 'Authenticate' }).click();
  }

  async expectLogin() {
    await expect(this.page.getByTestId('login-view')).toBeVisible();
  }

  async expectHome() {
    await expect(this.page.getByTestId('home-view')).toBeVisible();
  }

  emailOption(address: string, state: string) {
    return this.page.getByRole('option', {
      name: `${address}, ${state}`
    });
  }
}
