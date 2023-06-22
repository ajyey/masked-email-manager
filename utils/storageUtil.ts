import { FAVORITE_EMAILS_KEY } from './constants';

export const getFavoriteEmails = async (): Promise<string[]> => {
  const data = await chrome.storage.sync.get(FAVORITE_EMAILS_KEY);
  return data[FAVORITE_EMAILS_KEY] || [];
};

export const setFavoriteEmails = async (emailIds: string[]): Promise<void> => {
  await chrome.storage.sync.set({ [FAVORITE_EMAILS_KEY]: emailIds });
};
