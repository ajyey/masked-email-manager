import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  get: vi.fn(),
  publish: vi.fn(),
  uploadExisting: vi.fn()
}));

vi.mock('chrome-webstore-upload', () => ({
  default: mocks.createClient
}));

// @ts-expect-error The semantic-release plugin is loaded directly as JavaScript.
import { publish, verifyConditions } from '../utils/plugins/publish-chrome.js';

const logger = { log: vi.fn() };

describe('Chrome Web Store publisher', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('GOOGLE_CLIENT_ID', 'client-id');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'client-secret');
    vi.stubEnv('GOOGLE_PUBLISHER_ID', 'publisher-id');
    vi.stubEnv('GOOGLE_REFRESH_TOKEN', 'refresh-token');
    mocks.createClient.mockReturnValue({
      get: mocks.get,
      publish: mocks.publish,
      uploadExisting: mocks.uploadExisting
    });
    mocks.uploadExisting.mockResolvedValue({ uploadState: 'SUCCEEDED' });
  });

  afterEach(() => vi.unstubAllEnvs());

  it('verifies v2 credentials before a main branch release', async () => {
    await verifyConditions({}, { branch: { name: 'main' }, logger });

    expect(mocks.createClient).toHaveBeenCalledWith({
      extensionId: 'bckfnibflpdgifdfkfoooidpblaembga',
      clientId: 'client-id',
      clientSecret: 'client-secret',
      publisherId: 'publisher-id',
      refreshToken: 'refresh-token'
    });
    expect(mocks.get).toHaveBeenCalledOnce();
  });

  it('uploads and submits the prepared release artifact', async () => {
    await publish(
      {},
      {
        branch: { name: 'main' },
        nextRelease: { version: '2.0.0' },
        logger
      }
    );

    expect(mocks.uploadExisting).toHaveBeenCalledWith(
      'masked-email-manager_v2.0.0_chrome.zip',
      undefined,
      300
    );
    expect(mocks.publish).toHaveBeenCalledOnce();
  });

  it('does not publish an unsuccessful upload', async () => {
    mocks.uploadExisting.mockResolvedValue({ uploadState: 'FAILED' });

    await expect(
      publish(
        {},
        {
          branch: { name: 'main' },
          nextRelease: { version: '2.0.0' },
          logger
        }
      )
    ).rejects.toThrow('Chrome Web Store upload failed: FAILED');
    expect(mocks.publish).not.toHaveBeenCalled();
  });

  it('does not access the Chrome Web Store from prerelease branches', async () => {
    await verifyConditions({}, { branch: { name: 'develop' }, logger });
    await publish(
      {},
      {
        branch: { name: 'develop' },
        nextRelease: { version: '2.0.0-beta.1' },
        logger
      }
    );

    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it('fails before release preparation when publisher configuration is missing', async () => {
    vi.stubEnv('GOOGLE_PUBLISHER_ID', '');

    await expect(
      verifyConditions({}, { branch: { name: 'main' }, logger })
    ).rejects.toThrow('Missing Chrome Web Store configuration: publisherId');
  });
});
