const { alias } = require('react-app-rewire-alias');
const path = require('path');
const { getWebpackAlias } = require('@rocket-scripts/utils');

module.exports = function override(config) {
  return alias({
    ...getWebpackAlias(path.resolve(__dirname, '../packages')),
    ...getWebpackAlias(__dirname),
    env: path.join(__dirname, 'src/env.ts'),
  })(config);
};
