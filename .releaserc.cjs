// @ts-check

/**
 * @type {import('semantic-release').Options}
 */
const config = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', { npmPublish: false }],
    [
      '@semantic-release/exec',
      {
        verifyConditionsCmd: 'bun pm whoami',
        publishCmd: 'bun publish',
      },
    ],
    [
      '@semantic-release/git',
      {
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
    '@semantic-release/github',
  ],
}

module.exports = config
