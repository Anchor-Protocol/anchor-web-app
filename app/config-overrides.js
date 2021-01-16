const { alias } = require('react-app-rewire-alias');
const path = require('path');
const { getWebpackAlias } = require('@rocket-scripts/utils');

module.exports = {
  webpack: (config) => {
    config.resolve.extensions.push('.wasm');

    config.module.rules = config.module.rules.map((rule) => {
      if (Array.isArray(rule.oneOf)) {
        return {
          ...rule,
          oneOf: [
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

    config.module.rules.forEach((rule) => {
      (rule.oneOf || []).forEach((oneOf) => {
        if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
          oneOf.exclude.push(/\.wasm$/);
        }
      });
    });

    //config.plugins = (config.plugins || []).concat([
    //  new WasmPackPlugin({
    //    crateDirectory: path.resolve(__dirname, '../library'),
    //    extraArgs: '--no-typescript',
    //    outDir: path.resolve(__dirname, '../library/pkg'),
    //  }),
    //]);

    return alias({
      ...getWebpackAlias(path.resolve(__dirname, '../packages')),
      ...getWebpackAlias(__dirname),
      env: path.join(__dirname, 'src/env.ts'),
    })(config);
  },
  jest: (config) => {
    //const fs = require('fs');

    //const alias = {
    //  ...getWebpackAlias(path.resolve(__dirname, '../packages')),
    //  ...getWebpackAlias(__dirname),
    //};

    //config.moduleNameMapper = {
    //  ...config.moduleNameMapper,
    //  ...Object.keys(alias).reduce((mapper, dirname) => {
    //    mapper[`^${dirname}(.*)$`] = `${alias[dirname]}/$1`;
    //    return mapper;
    //  }, {}),
    //};
    config.modulePaths.push('<rootDir>/src/', '<rootDir>/../packages/src/');

    //fs.writeFileSync(
    //  path.resolve(__dirname, 'what.json'),
    //  JSON.stringify(
    //    {
    //      moduleNameMapper: config.moduleNameMapper,
    //      alias: {
    //        ...getWebpackAlias(path.resolve(__dirname, '../packages')),
    //        ...getWebpackAlias(__dirname),
    //      },
    //    },
    //    null,
    //    2,
    //  ),
    //);

    return config;
  },
};
