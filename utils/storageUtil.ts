import { FASTMAIL_SESSION_KEY, FAVORITE_EMAILS_KEY } from './constants';
import browser from 'webextension-polyfill';
import { Session } from 'fastmail-masked-email';

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

export const clearStorage = async (): Promise<void> => {
  await browser.storage.sync.clear();
};
