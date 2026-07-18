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

  async createEmail({
    domain,
    description
  }: {
    domain: string;
    description: string;
  }) {
    await this.page
      .getByRole('button', { name: 'Create', exact: true })
      .click();
    const dialog = this.page.getByRole('dialog', { name: 'Create Email' });
    await dialog
      .getByRole('textbox', { name: 'Domain', exact: true })
      .fill(domain);
    await dialog
      .getByRole('textbox', { name: 'Description', exact: true })
      .fill(description);
    await dialog.getByRole('button', { name: 'Create', exact: true }).click();
  }

  async selectEmail(address: string, state: string) {
    await this.emailOption(address, state).click();
  }

  async editSelectedEmail({
    domain,
    description
  }: {
    domain: string;
    description: string;
  }) {
    await this.page.getByRole('button', { name: 'Edit', exact: true }).click();
    await this.page
      .getByRole('textbox', { name: 'domain', exact: true })
      .fill(domain);
    await this.page
      .getByRole('textbox', { name: 'description', exact: true })
      .fill(description);
    await this.page.getByRole('button', { name: 'Save', exact: true }).click();
  }

  async setSelectedEmailEnabled(enabled: boolean) {
    const stateToggle = this.page.getByRole('checkbox', {
      name: 'Masked email enabled'
    });
    if ((await stateToggle.isChecked()) !== enabled) {
      await this.page.locator('label[for="masked-email-state"]').click();
    }
  }

  async favoriteSelectedEmail() {
    await this.page.getByRole('button', { name: 'Add to favorites' }).click();
  }

  async softDeleteSelectedEmail() {
    await this.page
      .getByRole('button', { name: 'Delete', exact: true })
      .click();
  }

  async permanentlyDeleteSelectedEmail() {
    await this.page
      .getByRole('button', { name: 'Permanently Delete', exact: true })
      .click();
    await this.page
      .getByRole('dialog', { name: 'Permanently Delete Email' })
      .getByRole('button', { name: 'Permanently delete', exact: true })
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

  detail(labelId: 'domainLabel' | 'emailDescriptionLabel' | 'emailIdLabel') {
    return this.page.locator(`#${labelId}`).locator('..');
  }

  emailOption(address: string, state: string) {
    return this.page.getByRole('option', {
      name: `${address}, ${state}`
    });
  }
}
