import { ComponentType, DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import styled from 'styled-components';

export const tokens = ['ust', 'krt', 'aust', 'akrt', 'luna', 'bluna'] as const;
export const variants = ['svg', '@2x', '@3x', '@4x'] as const;

export type Tokens = typeof tokens[number];
export type IconVariant = typeof variants[number];

export type TokenImage = { src: string; Component: ComponentType };

function convert({
  default: src,
  ReactComponent: Component,
}: {
  default: string;
  ReactComponent: ComponentType;
}): TokenImage {
  return {
    src,
    Component,
  };
}

export const tokenImages: Record<Tokens, Record<IconVariant, TokenImage>> = {
  ust: {
    svg: convert(require('./assets/ust.svg')),
    '@2x': convert(require('./assets/ust@2x.png')),
    '@3x': convert(require('./assets/ust@3x.png')),
    '@4x': convert(require('./assets/ust@4x.png')),
  },
  krt: {
    svg: convert(require('./assets/krt.svg')),
    '@2x': convert(require('./assets/krt@2x.png')),
    '@3x': convert(require('./assets/krt@3x.png')),
    '@4x': convert(require('./assets/krt@4x.png')),
  },
  aust: {
    svg: convert(require('./assets/aust.svg')),
    '@2x': convert(require('./assets/aust@2x.png')),
    '@3x': convert(require('./assets/aust@3x.png')),
    '@4x': convert(require('./assets/aust@4x.png')),
  },
  akrt: {
    svg: convert(require('./assets/akrt.svg')),
    '@2x': convert(require('./assets/akrt@2x.png')),
    '@3x': convert(require('./assets/akrt@3x.png')),
    '@4x': convert(require('./assets/akrt@4x.png')),
  },
  luna: {
    svg: convert(require('./assets/luna.svg')),
    '@2x': convert(require('./assets/luna@2x.png')),
    '@3x': convert(require('./assets/luna@3x.png')),
    '@4x': convert(require('./assets/luna@4x.png')),
  },
  bluna: {
    svg: convert(require('./assets/bluna.svg')),
    '@2x': convert(require('./assets/bluna@2x.png')),
    '@3x': convert(require('./assets/bluna@3x.png')),
    '@4x': convert(require('./assets/bluna@4x.png')),
  },
};

export interface IconProps
  extends Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src'
  > {
  token: Tokens;
  variant?: IconVariant;
}

export function TokenIconBase({
  token,
  variant = 'svg',
  ...imgProps
}: IconProps) {
  return <img alt="" {...imgProps} src={tokenImages[token][variant].src} />;
}

export const TokenIcon = styled(TokenIconBase)`
  width: 1em;
  height: 1em;
`;
