const { aliasDangerous } = require('react-app-rewire-alias/lib/aliasDangerous');
const { getWebpackAlias } = require('@rocket-scripts/utils');
const path = require('path');

module.exports = {
  webpack: (config) => {
    aliasDangerous({
      ...getWebpackAlias(path.resolve(__dirname, '../packages')),
      ...getWebpackAlias(path.resolve(__dirname, '../base')),
      ...getWebpackAlias(__dirname),
      env: path.join(__dirname, 'src/env.ts'),
    })(config);

    return config;
  },
  jest: (config) => {
    config.modulePaths.push(
      '<rootDir>/src/',
      '<rootDir>/../base/src/',
      '<rootDir>/../packages/src/',
    );

    return config;
  },
};
