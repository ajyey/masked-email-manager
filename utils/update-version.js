import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const manifestJsonPath = path.join(process.cwd(), 'dist', 'manifest.json');

// Read package.json and parse version
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

// Keep only major, minor, and patch version
const chromeVersion = version.match(/^\d+\.\d+\.\d+/)[0];

// Read manifest.json, update version, and save the file
const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf-8'));
manifestJson.version = chromeVersion;
fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2));

console.log(
  `Updated manifest.json version ${version} to chrome extension compatible version: ${chromeVersion}`
);
