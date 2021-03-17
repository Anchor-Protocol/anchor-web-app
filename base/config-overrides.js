const { aliasDangerous } = require('react-app-rewire-alias/lib/aliasDangerous');
const { getWebpackAlias } = require('@rocket-scripts/utils');
const path = require('path');

module.exports = {
  webpack: (config) => {
    aliasDangerous({
      ...getWebpackAlias(path.resolve(__dirname, '../packages')),
      ...getWebpackAlias(__dirname),
    })(config);
    
    return config;
  },
  jest: (config) => {
    config.modulePaths.push('<rootDir>/src/', '<rootDir>/../packages/src/');
    
    return config;
  },
};
