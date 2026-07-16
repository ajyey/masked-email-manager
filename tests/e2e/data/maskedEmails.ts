import type { E2EMaskedEmail } from './types';

const baseEmail = {
  url: null,
  createdAt: '2026-01-01T12:00:00Z',
  lastMessageAt: null,
  createdBy: 'E2E Test Suite'
};

export const maskedEmails = {
  enabledAlpha: {
    ...baseEmail,
    id: 'enabled-alpha',
    email: 'alpha@masked.example',
    state: 'enabled',
    forDomain: 'https://primary.example',
    description: 'Primary account'
  },
  enabledFavorite: {
    ...baseEmail,
    id: 'enabled-favorite',
    email: 'favorite@masked.example',
    state: 'enabled',
    forDomain: 'https://favorite.example',
    description: 'Favorite account'
  },
  disabledBeta: {
    ...baseEmail,
    id: 'disabled-beta',
    email: 'beta@masked.example',
    state: 'disabled',
    forDomain: 'https://beta.example',
    description: 'Beta account'
  },
  deletedRemovable: {
    ...baseEmail,
    id: 'deleted-removable',
    email: 'removable@masked.example',
    state: 'deleted',
    forDomain: 'https://removable.example',
    description: 'Removable account'
  },
  deletedProtected: {
    ...baseEmail,
    id: 'deleted-protected',
    email: 'protected@masked.example',
    state: 'deleted',
    forDomain: 'https://protected.example',
    description: 'Protected account',
    lastMessageAt: '2026-01-02T12:00:00Z'
  },
  searchDomain: {
    ...baseEmail,
    id: 'search-domain',
    email: 'domain-search@masked.example',
    state: 'enabled',
    forDomain: 'https://unique-domain.test',
    description: 'Domain search account'
  },
  searchDescription: {
    ...baseEmail,
    id: 'search-description',
    email: 'description-search@masked.example',
    state: 'disabled',
    forDomain: 'https://description.example',
    description: 'Unique ledger description'
  },
  searchId: {
    ...baseEmail,
    id: 'search-id-needle',
    email: 'id-search@masked.example',
    state: 'enabled',
    forDomain: 'https://id.example',
    description: 'ID search account'
  }
} satisfies Record<string, E2EMaskedEmail>;

export const baselineEmails = Object.values(maskedEmails);
