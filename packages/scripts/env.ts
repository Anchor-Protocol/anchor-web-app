import path from 'path';

export const cwd = path.resolve(__dirname, '..')

export const entry = {
  '@anchor-protocol/*': {
    version: '0.15.0',
    tag: 'latest',
  },
  '@terra-money/*': {
    version: '0.15.0',
    tag: 'latest',
  },
  '@terra-dev/*': {
    version: '0.15.0',
    tag: 'latest',
  },
};
