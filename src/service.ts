import { MaskedEmailService } from 'fastmail-masked-email';
import { getApiToken, setApiToken, setSession } from '../utils/storageUtil';
import browser from 'webextension-polyfill';
import {
  FASTMAIL_SESSION_KEY,
  FASTMAIL_API_TOKEN_KEY
} from '../utils/constants/constants';

let maskedEmailService: MaskedEmailService | null = null;

export async function setMaskedEmailService(apiToken: string) {
  try {
    maskedEmailService = new MaskedEmailService(apiToken);
    await maskedEmailService.initialize();

    // Get and store the session for authentication checks
    const session = maskedEmailService.getSession();
    await setSession(session);
    await setApiToken(apiToken);

    return maskedEmailService;
  } catch (error) {
    maskedEmailService = null;
    throw error;
  }
}

export async function isUserAuthenticated(): Promise<boolean> {
  try {
    await getMaskedEmailService();
    return true;
  } catch {
    return false;
  }
}

export async function getMaskedEmailService(): Promise<MaskedEmailService> {
  // If service exists, return it
  if (maskedEmailService) {
    return maskedEmailService;
  }
  // If no service but we have a stored API token, create it
  const storedApiToken = await getApiToken();
  if (storedApiToken) {
    try {
      maskedEmailService = new MaskedEmailService(storedApiToken);
      await maskedEmailService.initialize();
      return maskedEmailService;
    } catch {
      // If token is invalid, clear stored session
      await clearAuthenticationState();
      throw new Error('Stored API token is invalid. Please login again.');
    }
  }

  await clearAuthenticationState();
  throw new Error('User is not authenticated. Please login first.');
}

export async function clearAuthenticationState() {
  maskedEmailService = null;
  // Clear stored session and token by removing them from storage
  await browser.storage.sync.remove([
    FASTMAIL_SESSION_KEY,
    FASTMAIL_API_TOKEN_KEY
  ]);
}
