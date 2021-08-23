const { aliasDangerous } = require('react-app-rewire-alias/lib/aliasDangerous');
const { readPackageAlias } = require('@rocket-scripts/read-package-alias');
const path = require('path');

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
            ...rule.oneOf,
          ],
        };
      }

      return rule;
    });

    aliasDangerous({
      ...readPackageAlias(path.resolve(__dirname, '../app')),
      ...readPackageAlias(__dirname),
      env: path.join(__dirname, 'src/env.ts'),
    })(config);

    return config;
  },
  jest: (config) => {
    config.modulePaths.push('<rootDir>/src/', '<rootDir>/../app/src/');

    return config;
  },
};
