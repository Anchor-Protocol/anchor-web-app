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
