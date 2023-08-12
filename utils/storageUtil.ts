import {
  FASTMAIL_SESSION_KEY,
  FAVORITE_EMAILS_KEY,
  DEFAULT_FILTER_KEY
} from './constants/constants';
import browser from 'webextension-polyfill';
import { Session } from 'fastmail-masked-email';
import { FILTER_OPTIONS, FilterOption } from '@src/pages/popup/components/home/filter/FilterOption';

export const getFavoriteEmailIds = async (): Promise<string[]> => {
  const data = await browser.storage.sync.get(FAVORITE_EMAILS_KEY);
  return data[FAVORITE_EMAILS_KEY] || [];
};

export const setFavoriteEmailIds = async (
  emailIds: string[]
): Promise<void> => {
  await browser.storage.sync.set({ [FAVORITE_EMAILS_KEY]: emailIds });
};

export const getFastmailSession = async (): Promise<Session> => {
  const data = await browser.storage.sync.get(FASTMAIL_SESSION_KEY);
  return data[FASTMAIL_SESSION_KEY] || {};
};

export const setFastmailSession = async (session: Session): Promise<void> => {
  await browser.storage.sync.set({ [FASTMAIL_SESSION_KEY]: session });
};

export const getDefaultFilter = async (): Promise<FilterOption> => {
  const data = await browser.storage.sync.get(DEFAULT_FILTER_KEY);
  const value = data[DEFAULT_FILTER_KEY] || 'All';
  return FILTER_OPTIONS[value] || FILTER_OPTIONS.All;
}

export const setDefaultFilter = async (filter: FilterOption): Promise<void> => {
  await browser.storage.sync.set({ [DEFAULT_FILTER_KEY]: filter.value });
}

export const clearStorage = async (): Promise<void> => {
  await browser.storage.sync.clear();
};
