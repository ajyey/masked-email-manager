const currentBranch =
  process.env.GITHUB_REF && process.env.GITHUB_REF.replace('refs/heads/', '');

module.exports = {
  branches: [
    'main',
    {
      name: 'develop',
      prerelease: 'beta',
      channel: 'beta'
    }
  ],
  plugins: [
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
      !currentBranch || currentBranch === 'main'
        ? {
            extensionId: 'bckfnibflpdgifdfkfoooidpblaembga',
            target: '${{ env.CHROME_TARGET }}',
            asset: 'masked-email-manager_v${nextRelease.version}.zip'
          }
        : false
    ],
    [
      '@semantic-release/github',
      {
        assets: ['masked-email-manager_v${nextRelease.version}.zip']
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
  ]
};
