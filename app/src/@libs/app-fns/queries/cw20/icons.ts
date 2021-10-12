import { CW20Addr } from '@libs/types';

export type CW20Icon = {
  protocol: string;
  symbol: string;
  token: CW20Addr;
  icon: string;
};

export type CW20Icons = {
  [network: string]: {
    [tokenAddr: string]: CW20Icon;
  };
};

let cache: CW20Icons;

export async function cw20IconsQuery(): Promise<CW20Icons> {
  if (cache) {
    return cache;
  }

  const data: CW20Icons = await fetch(
    `https://assets.terra.money/cw20/tokens.json`,
  ).then((res) => res.json());

  cache = data;

  return data;
}
