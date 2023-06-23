import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const manifestJsonPath = path.join(process.cwd(), 'dist', 'manifest.json');
const firefoxManifestJsonPath = path.join(
  process.cwd(),
  'dist-firefox',
  'manifest.json'
);

// Read package.json and parse version
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

// Keep only major, minor, and patch version
const sanitizedVersion = version.match(/^\d+\.\d+\.\d+/)[0];

const paths = [manifestJsonPath, firefoxManifestJsonPath];

// Read manifest.json, update version, and save the file
for (const path of paths) {
  const manifestJson = JSON.parse(fs.readFileSync(path, 'utf-8'));
  manifestJson.version = sanitizedVersion;
  fs.writeFileSync(path, JSON.stringify(manifestJson, null, 2));
}
console.log(
  `Updated manifest.json versions to chrome/firefox compatible version: ${sanitizedVersion}`
);
