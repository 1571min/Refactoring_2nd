module.exports = {
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1'
  },
  testMatch: ['**/test/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
}
