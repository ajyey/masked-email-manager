import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  FASTMAIL_API_TOKEN_KEY,
  FASTMAIL_SESSION_KEY
} from '../utils/constants/constants';

const client = vi.hoisted(() => ({
  construct: vi.fn<(apiToken: string) => void>(),
  getSession: vi.fn<() => object>(),
  initialize: vi.fn<() => Promise<void>>()
}));

const storage = vi.hoisted(() => ({
  getApiToken: vi.fn<() => Promise<string | null>>(),
  remove: vi.fn<(keys: string[]) => Promise<void>>(),
  setApiToken: vi.fn<(apiToken: string) => Promise<void>>(),
  setSession: vi.fn<(session: object) => Promise<void>>()
}));

vi.mock('fastmail-masked-email', () => ({
  MaskedEmailService: class {
    constructor(apiToken: string) {
      client.construct(apiToken);
    }

    initialize() {
      return client.initialize();
    }

    getSession() {
      return client.getSession();
    }
  }
}));

vi.mock('../utils/storageUtil', () => ({
  getApiToken: storage.getApiToken,
  setApiToken: storage.setApiToken,
  setSession: storage.setSession
}));

vi.mock('webextension-polyfill', () => ({
  default: { storage: { sync: { remove: storage.remove } } }
}));

describe('masked email service authentication', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
    client.initialize.mockResolvedValue();
    client.getSession.mockReturnValue({ apiUrl: 'https://api.fastmail.com' });
    storage.getApiToken.mockResolvedValue(null);
    storage.remove.mockResolvedValue();
    storage.setApiToken.mockResolvedValue();
    storage.setSession.mockResolvedValue();
  });

  it('validates a stored token and caches the initialized client', async () => {
    storage.getApiToken.mockResolvedValue('stored-token');
    const { getMaskedEmailService, isUserAuthenticated } =
      await import('../src/service');

    expect(await isUserAuthenticated()).toBe(true);
    await getMaskedEmailService();

    expect(client.construct).toHaveBeenCalledOnce();
    expect(client.construct).toHaveBeenCalledWith('stored-token');
    expect(client.initialize).toHaveBeenCalledOnce();
  });

  it('rejects a missing stored token and clears stale authentication state', async () => {
    const { isUserAuthenticated } = await import('../src/service');

    expect(await isUserAuthenticated()).toBe(false);
    expect(storage.remove).toHaveBeenCalledWith([
      FASTMAIL_SESSION_KEY,
      FASTMAIL_API_TOKEN_KEY
    ]);
  });

  it('rejects an invalid stored token and clears authentication state', async () => {
    storage.getApiToken.mockResolvedValue('invalid-token');
    client.initialize.mockRejectedValue(new Error('Unauthorized'));
    const { isUserAuthenticated } = await import('../src/service');

    expect(await isUserAuthenticated()).toBe(false);
    expect(storage.remove).toHaveBeenCalledWith([
      FASTMAIL_SESSION_KEY,
      FASTMAIL_API_TOKEN_KEY
    ]);
  });

  it('persists a login only after successful initialization', async () => {
    const session = { apiUrl: 'https://api.fastmail.com' };
    client.getSession.mockReturnValue(session);
    const { setMaskedEmailService } = await import('../src/service');

    await setMaskedEmailService('new-token');

    expect(client.initialize).toHaveBeenCalledOnce();
    expect(storage.setSession).toHaveBeenCalledWith(session);
    expect(storage.setApiToken).toHaveBeenCalledWith('new-token');
  });
});
