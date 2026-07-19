import {
  FAVORITE_EMAILS_KEY,
  DEFAULT_FILTER_KEY,
  FASTMAIL_API_TOKEN_KEY,
  FASTMAIL_SESSION_KEY
} from './constants/constants';
import browser from 'webextension-polyfill';
import {
  FILTER_OPTIONS,
  FilterOption
} from '@src/pages/popup/components/home/filter/FilterOption';

export const getFavoriteEmailIds = async (): Promise<string[]> => {
  const data = await browser.storage.sync.get(FAVORITE_EMAILS_KEY);
  const favoriteEmailIds = data[FAVORITE_EMAILS_KEY];
  return Array.isArray(favoriteEmailIds) &&
    favoriteEmailIds.every((emailId) => typeof emailId === 'string')
    ? favoriteEmailIds
    : [];
};

export const setFavoriteEmailIds = async (
  emailIds: string[]
): Promise<void> => {
  await browser.storage.sync.set({ [FAVORITE_EMAILS_KEY]: emailIds });
};

export const getApiToken = async (): Promise<string | null> => {
  const data = await browser.storage.sync.get(FASTMAIL_API_TOKEN_KEY);
  const token = data[FASTMAIL_API_TOKEN_KEY];
  return typeof token === 'string' && token.trim() !== '' ? token : null;
};

export const setApiToken = async (apiToken: string): Promise<void> => {
  await browser.storage.sync.set({ [FASTMAIL_API_TOKEN_KEY]: apiToken });
};

export const getSession = async (): Promise<object | null> => {
  const data = await browser.storage.sync.get(FASTMAIL_SESSION_KEY);
  const session = data[FASTMAIL_SESSION_KEY];
  return typeof session === 'object' && session !== null ? session : null;
};

export const setSession = async (session: object): Promise<void> => {
  await browser.storage.sync.set({ [FASTMAIL_SESSION_KEY]: session });
};

export const getDefaultFilter = async (): Promise<FilterOption> => {
  const data = await browser.storage.sync.get(DEFAULT_FILTER_KEY);
  const value = data[DEFAULT_FILTER_KEY];
  return typeof value === 'string'
    ? FILTER_OPTIONS[value] || FILTER_OPTIONS.All
    : FILTER_OPTIONS.All;
};

export const setDefaultFilter = async (filter: FilterOption): Promise<void> => {
  await browser.storage.sync.set({ [DEFAULT_FILTER_KEY]: filter.value });
};
