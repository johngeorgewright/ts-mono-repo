module.exports = {
  pipeline: {
    build: [
      '^build'
    ],
    release: [
      '^release'
    ],
    start: [
      'build'
    ],
    test: [
      'build'
    ],
  },
  npmClient: 'npm'
}
