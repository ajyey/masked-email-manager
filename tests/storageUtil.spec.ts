import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_FILTER_KEY,
  FASTMAIL_API_TOKEN_KEY,
  FASTMAIL_SESSION_KEY,
  FAVORITE_EMAILS_KEY
} from '../utils/constants/constants';

const storage = vi.hoisted(() => ({
  clear: vi.fn<() => Promise<void>>(),
  get: vi.fn<(key: string) => Promise<Record<string, unknown>>>(),
  set: vi.fn<(items: Record<string, unknown>) => Promise<void>>()
}));

vi.mock('webextension-polyfill', () => ({
  default: { storage: { sync: storage } }
}));

import {
  clearStorage,
  getApiToken,
  getDefaultFilter,
  getFavoriteEmailIds,
  getSession,
  setApiToken,
  setDefaultFilter,
  setFavoriteEmailIds,
  setSession
} from '../utils/storageUtil';
import { FILTER_OPTIONS } from '../src/pages/popup/components/home/filter/FilterOption';

describe('storage utilities', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    storage.get.mockResolvedValue({});
    storage.set.mockResolvedValue();
    storage.clear.mockResolvedValue();
  });

  it('reads favorite email IDs and rejects malformed values', async () => {
    storage.get.mockResolvedValueOnce({
      [FAVORITE_EMAILS_KEY]: ['first', 'second']
    });
    expect(await getFavoriteEmailIds()).toEqual(['first', 'second']);

    storage.get.mockResolvedValueOnce({
      [FAVORITE_EMAILS_KEY]: ['first', 2]
    });
    expect(await getFavoriteEmailIds()).toEqual([]);
  });

  it('returns only non-empty string API tokens', async () => {
    storage.get.mockResolvedValueOnce({ [FASTMAIL_API_TOKEN_KEY]: 'token' });
    expect(await getApiToken()).toBe('token');

    storage.get.mockResolvedValueOnce({ [FASTMAIL_API_TOKEN_KEY]: '   ' });
    expect(await getApiToken()).toBeNull();

    storage.get.mockResolvedValueOnce({ [FASTMAIL_API_TOKEN_KEY]: 123 });
    expect(await getApiToken()).toBeNull();
  });

  it('returns only object sessions', async () => {
    const session = { apiUrl: 'https://api.fastmail.com' };
    storage.get.mockResolvedValueOnce({ [FASTMAIL_SESSION_KEY]: session });
    expect(await getSession()).toEqual(session);

    storage.get.mockResolvedValueOnce({ [FASTMAIL_SESSION_KEY]: 'invalid' });
    expect(await getSession()).toBeNull();
  });

  it('falls back to the All filter for missing or invalid values', async () => {
    storage.get.mockResolvedValueOnce({ [DEFAULT_FILTER_KEY]: 'Favorites' });
    expect(await getDefaultFilter()).toBe(FILTER_OPTIONS.Favorites);

    storage.get.mockResolvedValueOnce({ [DEFAULT_FILTER_KEY]: 'Unknown' });
    expect(await getDefaultFilter()).toBe(FILTER_OPTIONS.All);

    storage.get.mockResolvedValueOnce({ [DEFAULT_FILTER_KEY]: 1 });
    expect(await getDefaultFilter()).toBe(FILTER_OPTIONS.All);
  });

  it('writes values under their storage keys', async () => {
    const session = { apiUrl: 'https://api.fastmail.com' };

    await setFavoriteEmailIds(['first']);
    await setApiToken('token');
    await setSession(session);
    await setDefaultFilter(FILTER_OPTIONS.Enabled);

    expect(storage.set).toHaveBeenNthCalledWith(1, {
      [FAVORITE_EMAILS_KEY]: ['first']
    });
    expect(storage.set).toHaveBeenNthCalledWith(2, {
      [FASTMAIL_API_TOKEN_KEY]: 'token'
    });
    expect(storage.set).toHaveBeenNthCalledWith(3, {
      [FASTMAIL_SESSION_KEY]: session
    });
    expect(storage.set).toHaveBeenNthCalledWith(4, {
      [DEFAULT_FILTER_KEY]: 'Enabled'
    });
  });

  it('clears synchronized storage', async () => {
    await clearStorage();
    expect(storage.clear).toHaveBeenCalledOnce();
  });
});
