import { CW20Addr } from '@libs/types';

export type CW20TokenDisplayInfo = {
  protocol: string;
  symbol: string;
  token: CW20Addr;
  icon: string;
};

export type CW20TokenDisplayInfos = {
  [network: string]: {
    [tokenAddr: string]: CW20TokenDisplayInfo;
  };
};

let cache: CW20TokenDisplayInfos;

export async function cw20TokenDisplayInfosQuery(): Promise<CW20TokenDisplayInfos> {
  if (cache) {
    return cache;
  }

  const data: CW20TokenDisplayInfos = await fetch(
    `https://assets.terra.money/cw20/tokens.json`,
  ).then((res) => res.json());

  cache = data;

  return data;
}
