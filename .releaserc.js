// .releaserc.js
const currentBranch =
  process.env.GITHUB_REF && process.env.GITHUB_REF.replace('refs/heads/', '');

const generatePluginsConfig = () => {
  const basePlugins = [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'docs', scope: 'readme', release: 'patch' },
          { type: 'chore', scope: 'deps', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'refactor', scope: 'types', release: 'minor' },
          { type: 'feat', scope: 'major', release: 'major' },
          { scope: 'no-release', release: false },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
        writerOpts: {
          commitsSort: ['subject', 'scope'],
        },
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: ['masked-email-manager_v${nextRelease.version}.zip'],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ];

  if (currentBranch === 'main') {
    // Insert before GitHub plugin
    basePlugins.splice(3,0,[
      'semantic-release-chrome',
      {
        extensionId: 'bckfnibflpdgifdfkfoooidpblaembga', // TODO: replace with actual extension ID
        asset: 'masked-email-manager_v${nextRelease.version}.zip',
      },
    ]);
  }

  return basePlugins;
};

export default {
  branches: [
    'main',
    {
      name: 'develop',
      prerelease: 'beta',
      channel: 'beta',
    },
  ],
  plugins: generatePluginsConfig(),
};
