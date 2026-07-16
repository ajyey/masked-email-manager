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

  async search(query: string) {
    await this.page
      .getByRole('textbox', { name: 'Search masked emails' })
      .fill(query);
  }

  async clearSearch() {
    await this.page.getByRole('button', { name: 'Clear search' }).click();
  }

  async selectFilter(filter: string) {
    await this.page
      .getByRole('button', { name: /Filter masked emails:/ })
      .click();
    await this.page
      .getByRole('listbox', { name: 'Masked email filter' })
      .getByRole('option', { name: filter, exact: true })
      .click();
  }

  emailList() {
    return this.page.getByRole('listbox', { name: 'Masked emails' });
  }

  emailOptions() {
    return this.emailList().getByRole('option');
  }

  filterButton(filter: string) {
    return this.page.getByRole('button', {
      name: `Filter masked emails: ${filter}`
    });
  }

  emailCount(count: number) {
    return this.page.getByLabel(
      `${count} masked ${count === 1 ? 'email' : 'emails'}`
    );
  }

  emailOption(address: string, state: string) {
    return this.page.getByRole('option', {
      name: `${address}, ${state}`
    });
  }
}
