import { Chain } from '@anchor-protocol/app-provider';
import { CW20Addr } from '@libs/types';

export type CW20TokenDisplayInfo = {
  protocol: string;
  name: string;
  symbol: string;
  token: CW20Addr;
  icon: string;
  decimals?: number;
};

type CW20NetworkTokenDisplayInfos = {
  [tokenAddr: string]: CW20TokenDisplayInfo;
};

export type CW20TokenDisplayInfos = {
  [network: string]: CW20NetworkTokenDisplayInfos;
};

export async function cw20TokenDisplayInfosQuery(
  chain: Chain,
): Promise<CW20TokenDisplayInfos> {
  // mainnet -> protocol === Wormhole (starts with wa)
  let data: CW20TokenDisplayInfos = await fetch(
    'https://assets.terra.money/cw20/tokens.json',
  ).then((res) => res.json());

  if (chain !== Chain.Terra) {
    data = trimWormholeSymbols(data);
  }

  return data;
}

const trimWormholeSymbols = (infos: CW20TokenDisplayInfos) => {
  return Object.entries(infos)
    .map(trimWormholeSymbolsPrefix)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as CW20TokenDisplayInfos);
};

const trimWormholeSymbolsPrefix = ([network, tokenDisplayInfos]: [
  string,
  CW20NetworkTokenDisplayInfos,
]): [string, CW20NetworkTokenDisplayInfos] => {
  return [
    network,
    Object.entries(tokenDisplayInfos)
      .map(trimWormholeSymbolPrefix)
      .reduce(
        (acc, [k, v]) => ({ ...acc, [k]: v }),
        {} as CW20NetworkTokenDisplayInfos,
      ),
  ];
};

const trimWormholeSymbolPrefix = ([contract, info]: [
  string,
  CW20TokenDisplayInfo,
]): [string, CW20TokenDisplayInfo] => {
  if (info.protocol?.includes('Wormhole')) {
    // remove first two characters, example:
    // - wasAVAX (Wormhole Avalanche) -> sAVAX
    return [contract, { ...info, symbol: info.symbol.slice(2) }];
  }

  return [contract, info];
};
