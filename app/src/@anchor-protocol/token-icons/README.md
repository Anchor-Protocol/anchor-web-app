# Anchor Icon Library

These icons are compatible with material-ui's icon.

```tsx
import { IconButton } from '@material-ui/core';
import { TokenIcon } from '@anchor-protocol/icons';

function App() {
  return <TokenIcon token="ust" />;
}
```

## Storybook

<https://anchor-storybook.vercel.app/?path=/story/assets-token-icons--token-icons>

## API

<!-- source index.tsx --pick "tokens variants Tokens IconVariant IconProps TokenIconBase TokenIcon GifIcon" -->

[index.tsx](index.tsx)

```tsx
export function TokenIconBase({
  symbol,
  path,
  token,
  variant = 'svg',
  ...imgProps
}: IconProps) {}

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

export const TokenIcon = styled(TokenIconBase)`
  width: 1em;
  height: 1em;
`;

export const GifIcon = styled.img`
  width: 1em;
  height: 1em;
`;
```

<!-- /source -->
