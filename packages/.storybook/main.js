const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  typescript: {
    reactDocgen: 'react-docgen',
  },
  addons: [
    // TODO remove this block when fix the storybook error
    // @see https://github.com/storybookjs/storybook/tree/master/addons/storysource#displaying-full-source
    {
      name: '@storybook/addon-docs',
      options: {
        sourceLoaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
    {
      name: '@storybook/addon-storysource',
      options: {
        loaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/preset-create-react-app',
      options: {
        scriptsPackageName: path.dirname(require.resolve('react-scripts/package.json')),
      },
    },
  ],
};
