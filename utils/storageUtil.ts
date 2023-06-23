import { FAVORITE_EMAILS_KEY } from './constants';
import browser from 'webextension-polyfill';

export const getFavoriteEmailIds = async (): Promise<string[]> => {
  const data = await browser.storage.sync.get(FAVORITE_EMAILS_KEY);
  return data[FAVORITE_EMAILS_KEY] || [];
};

export const setFavoriteEmailIds = async (
  emailIds: string[]
): Promise<void> => {
  await browser.storage.sync.set({ [FAVORITE_EMAILS_KEY]: emailIds });
};
