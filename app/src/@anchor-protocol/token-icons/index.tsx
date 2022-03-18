import React, { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import styled from 'styled-components';
import akrt from './assets/akrt.svg';
import akrt2x from './assets/akrt@2x.png';
import akrt3x from './assets/akrt@3x.png';
import akrt4x from './assets/akrt@4x.png';
import anc160gif from './assets/anc@160.gif';
import anc80gif from './assets/anc@80.gif';
import aust from './assets/aust.svg';
import aust2x from './assets/aust@2x.png';
import aust3x from './assets/aust@3x.png';
import aust4x from './assets/aust@4x.png';
import beth from './assets/beth.svg';
import beth2x from './assets/beth@2x.png';
import beth3x from './assets/beth@3x.png';
import beth4x from './assets/beth@4x.png';
import bluna from './assets/bluna.svg';
import bluna2x from './assets/bluna@2x.png';
import bluna3x from './assets/bluna@3x.png';
import bluna4x from './assets/bluna@4x.png';
import krt from './assets/krt.svg';
import krt2x from './assets/krt@2x.png';
import krt3x from './assets/krt@3x.png';
import krt4x from './assets/krt@4x.png';
import luna from './assets/luna.svg';
import luna2x from './assets/luna@2x.png';
import luna3x from './assets/luna@3x.png';
import luna4x from './assets/luna@4x.png';
import ust from './assets/ust.svg';
import ust2x from './assets/ust@2x.png';
import ust3x from './assets/ust@3x.png';
import ust4x from './assets/ust@4x.png';

export { anc80gif, anc160gif };

export const tokens = [
  'ust',
  'krt',
  'aust',
  'akrt',
  'luna',
  'bluna',
  'beth',
] as const;
export const variants = ['svg', '@2x', '@3x', '@4x'] as const;

export type Tokens = typeof tokens[number];
export type IconVariant = typeof variants[number];

export type TokenImage = { src: string };

function convert(src: string): TokenImage {
  return {
    src,
  };
}

export const tokenImages: Record<Tokens, Record<IconVariant, TokenImage>> = {
  ust: {
    'svg': convert(ust),
    '@2x': convert(ust2x),
    '@3x': convert(ust3x),
    '@4x': convert(ust4x),
  },
  krt: {
    'svg': convert(krt),
    '@2x': convert(krt2x),
    '@3x': convert(krt3x),
    '@4x': convert(krt4x),
  },
  aust: {
    'svg': convert(aust),
    '@2x': convert(aust2x),
    '@3x': convert(aust3x),
    '@4x': convert(aust4x),
  },
  akrt: {
    'svg': convert(akrt),
    '@2x': convert(akrt2x),
    '@3x': convert(akrt3x),
    '@4x': convert(akrt4x),
  },
  luna: {
    'svg': convert(luna),
    '@2x': convert(luna2x),
    '@3x': convert(luna3x),
    '@4x': convert(luna4x),
  },
  bluna: {
    'svg': convert(bluna),
    '@2x': convert(bluna2x),
    '@3x': convert(bluna3x),
    '@4x': convert(bluna4x),
  },
  beth: {
    'svg': convert(beth),
    '@2x': convert(beth2x),
    '@3x': convert(beth3x),
    '@4x': convert(beth4x),
  },
};

export interface IconProps
  extends Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src'
  > {
  token?: Tokens;
  symbol?: string;
  path?: string;
  variant?: IconVariant;
}

const displayTokenIconAsPredefined = (variant: IconVariant, symbol: string) =>
  symbol.toLowerCase() in tokens
    ? tokenImages[symbol.toLowerCase() as Tokens][variant].src
    : undefined;

const displayPredefinedIcon = (token: Tokens, variant: IconVariant) =>
  tokenImages[token][variant].src;

export function TokenIconBase({
  symbol,
  path,
  token,
  variant = 'svg',
  ...imgProps
}: IconProps) {
  const icon = token
    ? displayPredefinedIcon(token, variant)
    : symbol
    ? displayTokenIconAsPredefined(variant, symbol) ?? path
    : path;

  return <img alt="" {...imgProps} src={icon} />;
}

export const TokenIcon = styled(TokenIconBase)`
  width: 1em;
  height: 1em;
`;

export const GifIcon = styled.img`
  width: 1em;
  height: 1em;
`;
