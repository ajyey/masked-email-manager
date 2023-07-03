// .releaserc.js
const currentBranch =
  process.env.GITHUB_REF && process.env.GITHUB_REF.replace('refs/heads/', '');

const generatePluginsConfig = () => {
  return [
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
          { scope: 'no-release', release: false }
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
        },
        writerOpts: {
          commitsSort: ['subject', 'scope']
        }
      }
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false
      }
    ],
    [
      'semantic-release-chrome',
      {
        extensionId: 'bckfnibflpdgifdfkfoooidpblaembga',
        asset: 'masked-email-manager_v${nextRelease.version}_chrome.zip',
        target: currentBranch === 'main' ? 'default' : 'local' // only publish to chrome store on main branch
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'masked-email-manager_*_chrome.zip',
            name: 'masked-email-manager_v${nextRelease.version}_chrome.zip',
            label: 'Chrome Extension v${nextRelease.version}'
          }
        ]
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ];
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
