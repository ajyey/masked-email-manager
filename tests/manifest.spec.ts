import { afterEach, describe, expect, it, vi } from 'vitest';

const originalBrowser = process.env.BROWSER;

async function loadManifest(browser?: string) {
  if (browser === undefined) {
    delete process.env.BROWSER;
  } else {
    process.env.BROWSER = browser;
  }
  vi.resetModules();
  return (await import('../src/manifest')).default;
}

describe('extension manifest', () => {
  afterEach(() => {
    if (originalBrowser === undefined) {
      delete process.env.BROWSER;
    } else {
      process.env.BROWSER = originalBrowser;
    }
    vi.resetModules();
  });

  it('uses the popup and options build entrypoints', async () => {
    const manifest = await loadManifest();

    expect(manifest.action?.default_popup).toBe('src/pages/popup/index.html');
    expect(manifest.options_ui?.page).toBe('src/pages/options/index.html');
  });

  it('normalizes prerelease versions for browser manifests', async () => {
    const { sanitizeManifestVersion } = await import('../src/manifest');

    expect(sanitizeManifestVersion('2.4.0-beta.3')).toBe('2.4.0');
    expect(() => sanitizeManifestVersion('beta')).toThrow(
      'Invalid extension version: beta'
    );
  });

  it('limits tab access to explicit user interaction', async () => {
    const manifest = await loadManifest();

    expect(manifest.permissions).toContain('activeTab');
    expect(manifest.permissions).not.toContain('tabs');
  });

  it('omits Firefox metadata from the Chrome manifest', async () => {
    const manifest = await loadManifest();
    expect(manifest.browser_specific_settings).toBeUndefined();
  });

  it('adds the extension ID to the Firefox manifest', async () => {
    const manifest = await loadManifest('firefox');
    expect(manifest.browser_specific_settings?.gecko?.id).toBe(
      '{c48d361c-1173-11ee-be56-0242ac120002}'
    );
  });
});
