import chromeWebstoreUpload from 'chrome-webstore-upload';

const extensionId = 'bckfnibflpdgifdfkfoooidpblaembga';

function createClient() {
  const environment = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    publisherId: process.env.GOOGLE_PUBLISHER_ID,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN
  };
  const missing = Object.entries(environment)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing Chrome Web Store configuration: ${missing.join(', ')}`
    );
  }

  return chromeWebstoreUpload({ extensionId, ...environment });
}

export async function verifyConditions(_pluginConfig, { branch, logger }) {
  if (branch.name !== 'main') {
    logger.log('Skipping Chrome Web Store verification on %s.', branch.name);
    return;
  }

  await createClient().get();
  logger.log('Verified Chrome Web Store v2 credentials.');
}

export async function publish(_pluginConfig, { branch, nextRelease, logger }) {
  if (branch.name !== 'main') {
    logger.log('Skipping Chrome Web Store publication on %s.', branch.name);
    return;
  }

  const asset = `masked-email-manager_v${nextRelease.version}_chrome.zip`;
  const client = createClient();

  logger.log('Uploading %s to the Chrome Web Store.', asset);
  const upload = await client.uploadExisting(asset, undefined, 300);
  if (upload.uploadState !== 'SUCCEEDED') {
    throw new Error(`Chrome Web Store upload failed: ${upload.uploadState}`);
  }
  logger.log(
    'Submitting Chrome extension v%s for review.',
    nextRelease.version
  );
  await client.publish();

  return {
    name: 'Chrome Web Store',
    url: `https://chromewebstore.google.com/detail/${extensionId}`
  };
}
