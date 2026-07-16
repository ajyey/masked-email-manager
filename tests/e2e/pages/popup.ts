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

  async logout() {
    await this.page.getByRole('button', { name: 'Settings' }).click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await this.page
      .getByRole('dialog', { name: 'Logout' })
      .getByRole('button', { name: 'Logout', exact: true })
      .click();
  }

  emailOption(address: string, state: string) {
    return this.page.getByRole('option', {
      name: `${address}, ${state}`
    });
  }
}
