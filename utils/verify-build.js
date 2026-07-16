import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const packageJson = JSON.parse(
  await readFile(resolve(projectRoot, 'package.json'), 'utf8')
);
const expectedVersion = packageJson.version.match(/^\d+\.\d+\.\d+/)?.[0];
const geckoId = '{c48d361c-1173-11ee-be56-0242ac120002}';

if (!expectedVersion) {
  throw new Error(`Invalid package version: ${packageJson.version}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertBrowserVersion(version, outputName) {
  assert(
    typeof version === 'string',
    `${outputName}: missing manifest version`
  );
  const parts = version.split('.');
  assert(
    parts.length >= 1 &&
      parts.length <= 4 &&
      parts.every(
        (part) => /^(0|[1-9]\d*)$/.test(part) && Number(part) <= 65535
      ) &&
      parts.some((part) => Number(part) > 0),
    `${outputName}: invalid browser manifest version ${version}`
  );
}

async function verifyOutput({ directory, firefox }) {
  const outputName = firefox ? 'Firefox' : 'Chrome';
  const outputPath = resolve(projectRoot, directory);
  const manifest = JSON.parse(
    await readFile(resolve(outputPath, 'manifest.json'), 'utf8')
  );

  assertBrowserVersion(manifest.version, outputName);
  assert(
    manifest.version === expectedVersion,
    `${outputName}: expected version ${expectedVersion}, got ${manifest.version}`
  );
  assert(
    manifest.permissions?.includes('storage') &&
      manifest.permissions.includes('activeTab') &&
      !manifest.permissions.includes('tabs'),
    `${outputName}: unexpected extension permissions`
  );
  assert(
    manifest.options_ui === undefined,
    `${outputName}: unexpected options page declaration`
  );

  const manifestGeckoId = manifest.browser_specific_settings?.gecko?.id;
  assert(
    firefox ? manifestGeckoId === geckoId : manifestGeckoId === undefined,
    `${outputName}: unexpected Gecko extension ID`
  );

  const requiredFiles = new Set([
    manifest.action?.default_popup,
    manifest.action?.default_icon,
    ...Object.values(manifest.icons ?? {}),
    ...(manifest.web_accessible_resources ?? []).flatMap(
      ({ resources }) => resources
    ),
    'src/pages/popup/index.js'
  ]);

  for (const file of requiredFiles) {
    assert(
      typeof file === 'string',
      `${outputName}: invalid manifest file path`
    );
    await access(resolve(outputPath, file));
  }

  const outputFiles = await readdir(outputPath, { recursive: true });
  assert(
    !outputFiles.some((file) => file.includes('pages/options')),
    `${outputName}: unexpected options page bundle`
  );
  const unexpectedFiles = outputFiles.filter((file) =>
    /\.(map|zip|xpi)$/.test(file)
  );
  assert(
    unexpectedFiles.length === 0,
    `${outputName}: unexpected production artifacts: ${unexpectedFiles.join(', ')}`
  );
}

await verifyOutput({ directory: 'dist', firefox: false });
await verifyOutput({ directory: 'dist-firefox', firefox: true });

console.log('Verified Chrome and Firefox build artifacts.');
