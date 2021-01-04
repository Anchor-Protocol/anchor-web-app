const { alias } = require('react-app-rewire-alias');
const path = require('path');
const { getWebpackAlias } = require('@rocket-scripts/utils');

module.exports = function override(config) {
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

  return alias({
    ...getWebpackAlias(path.resolve(__dirname, '../packages')),
    ...getWebpackAlias(__dirname),
    env: path.join(__dirname, 'src/env.ts'),
  })(config);
};
