const { aliasDangerous } = require('react-app-rewire-alias/lib/aliasDangerous');
const { getWebpackAlias } = require('@rocket-scripts/utils');
const path = require('path');

module.exports = {
  webpack: (config) => {
    aliasDangerous({
      ...getWebpackAlias(path.resolve(__dirname, '../packages')),
      ...getWebpackAlias(path.resolve(__dirname, '../app')),
      env: path.resolve(__dirname, '../app/src/env.ts'),
      App: path.resolve(__dirname, '../app/src/App.tsx'),
    })(config);
    
    return config;
  },
  jest: (config) => {
    config.modulePaths.push('<rootDir>/../app/src/', '<rootDir>/../packages/src/');
    
    return config;
  },
};
