const { alias } = require('react-app-rewire-alias');
const path = require('path');
const { getWebpackAlias } = require('@rocket-scripts/utils');

module.exports = {
  webpack: (config) => {
    config.module.rules = config.module.rules.map((rule) => {
      if (Array.isArray(rule.oneOf)) {
        return {
          ...rule,
          oneOf: [
            {
              test: /\.(glsl|vs|fs|vert|frag)$/,
              exclude: /node_modules/,
              use: [
                require.resolve('raw-loader'),
                require.resolve('glslify-loader'),
              ],
            },
            {
              test: /\.(graphql|gql)$/,
              exclude: /node_modules/,
              use: [require.resolve('graphql-tag/loader')],
            },
            ...rule.oneOf,
          ],
        };
      }

      return rule;
    });

    return alias({
      ...getWebpackAlias(path.resolve(__dirname, '../packages')),
      ...getWebpackAlias(__dirname),
      '@anchor-protocol/anchor.js': path.resolve(
        __dirname,
        '../modules/anchor.js/src',
      ),
      env: path.join(__dirname, 'src/env.ts'),
    })(config);
  },
  jest: (config) => {
    config.modulePaths.push('<rootDir>/src/', '<rootDir>/../packages/src/');
    return config;
  },
};
