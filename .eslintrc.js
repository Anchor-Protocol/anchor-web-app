module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'prettier',
  ],
  rules: {
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useServiceConnectedMemo|useServiceConnectedCallback)',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.stories.{js,jsx,ts,tsx}'],
      rules: {
        'import/no-anonymous-default-export': 0,
      },
    },
  ],
};
