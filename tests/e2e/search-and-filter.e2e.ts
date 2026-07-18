import { expect } from '@playwright/test';
import { baselineEmails, maskedEmails } from './data/maskedEmails';
import { test } from './fixtures/test';

test('keeps loading visible while the email request is pending', async ({
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  const releaseEmails = fastmail.delayNext('get');

  await popupPage.login();
  await expect(
    popup.getByRole('status', { name: 'Loading masked emails' })
  ).toHaveCount(2);

  releaseEmails();
  await expect(popupPage.emailCount(baselineEmails.length)).toBeVisible();
});

test('renders loaded emails and selects the first result', async ({
  fastmail,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();

  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);
  await expect(
    popupPage.emailOption(maskedEmails.enabledAlpha.email, 'enabled')
  ).toHaveAttribute('aria-selected', 'true');
});

test('renders an empty state for an account without masked emails', async ({
  popup,
  popupPage
}) => {
  await popupPage.login();

  await expect(popupPage.emailCount(0)).toBeVisible();
  await expect(popupPage.emailOptions()).toHaveCount(0);
  await expect(popup.getByText('Nothing to see here..')).toBeVisible();
});

const searchCases = [
  {
    field: 'address',
    query: 'alpha',
    email: maskedEmails.enabledAlpha
  },
  {
    field: 'description',
    query: 'Unique ledger',
    email: maskedEmails.searchDescription
  },
  {
    field: 'domain',
    query: 'unique-domain.test',
    email: maskedEmails.searchDomain
  },
  {
    field: 'ID',
    query: 'search-id-needle',
    email: maskedEmails.searchId
  }
] as const;

for (const { field, query, email } of searchCases) {
  test(`searches masked emails by ${field}`, async ({
    fastmail,
    popupPage
  }) => {
    fastmail.seedEmails(baselineEmails);
    await popupPage.login();
    await popupPage.search(query);

    await expect(popupPage.emailCount(1)).toBeVisible();
    await expect(popupPage.emailOptions()).toHaveCount(1);
    await expect(
      popupPage.emailOption(email.email, email.state)
    ).toHaveAttribute('aria-selected', 'true');
  });
}

test('clearing search restores all results', async ({
  fastmail,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();
  await popupPage.search('alpha');
  await expect(popupPage.emailCount(1)).toBeVisible();

  await popupPage.clearSearch();
  await expect(popupPage.emailOptions()).toHaveCount(baselineEmails.length);
  await expect(popupPage.emailCount(baselineEmails.length)).toBeVisible();
});

test('a search without results clears the selection', async ({
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();
  await popupPage.search('no-such-masked-email');

  await expect(popupPage.emailCount(0)).toBeVisible();
  await expect(popupPage.emailOptions()).toHaveCount(0);
  await expect(popup.getByText('Nothing to see here..')).toBeVisible();
});

const stateFilters = [
  { filter: 'All', state: null, count: 8 },
  { filter: 'Enabled', state: 'enabled', count: 4 },
  { filter: 'Disabled', state: 'disabled', count: 2 },
  { filter: 'Deleted', state: 'deleted', count: 2 }
] as const;

for (const { filter, state, count } of stateFilters) {
  test(`${filter} filter shows the expected records`, async ({
    fastmail,
    popupPage
  }) => {
    fastmail.seedEmails(baselineEmails);
    await popupPage.login();
    await popupPage.selectFilter(filter);

    await expect(popupPage.emailOptions()).toHaveCount(count);
    await expect(popupPage.emailCount(count)).toBeVisible();
    if (state) {
      for (const email of baselineEmails.filter(
        (email) => email.state === state
      )) {
        await expect(popupPage.emailOption(email.email, state)).toBeVisible();
      }
    }
  });
}

test('Favorites filter follows synchronized favorite IDs', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await extension.setStorage(popup, {
    favorite_emails: [maskedEmails.enabledFavorite.id]
  });
  await popupPage.login();
  await popupPage.selectFilter('Favorites');

  await expect(popupPage.emailOptions()).toHaveCount(1);
  await expect(
    popupPage.emailOption(maskedEmails.enabledFavorite.email, 'enabled')
  ).toBeVisible();
});

test('restores the selected filter after popup reload', async ({
  extension,
  fastmail,
  popup,
  popupPage
}) => {
  fastmail.seedEmails(baselineEmails);
  await popupPage.login();
  await popupPage.selectFilter('Disabled');
  await expect
    .poll(async () => (await extension.getStorage(popup)).default_filter)
    .toBe('Disabled');

  await popup.reload();
  await expect(popupPage.filterButton('Disabled')).toBeVisible();
  await expect(popupPage.emailCount(2)).toBeVisible();
});
