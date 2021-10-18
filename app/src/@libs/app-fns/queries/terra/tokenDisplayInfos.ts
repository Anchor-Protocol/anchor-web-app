import { TokenDisplayInfo } from '../../models/tokenDisplayInfo';
import { cw20TokenDisplayInfosQuery } from '../cw20/tokenDisplayInfos';

const NATIVE_TOKEN_DISPLAY_INFOS: TokenDisplayInfo[] = [
  {
    protocol: 'Terra',
    symbol: 'UST',
    asset: { native_token: { denom: 'uusd' } },
    icon: 'https://assets.terra.money/icon/60/UST.png',
  },
  {
    protocol: 'Terra',
    symbol: 'Luna',
    asset: { native_token: { denom: 'uluna' } },
    icon: 'https://assets.terra.money/icon/60/Luna.png',
  },
  {
    protocol: 'Terra',
    symbol: 'AUT',
    asset: { native_token: { denom: 'uaud' } },
    icon: 'https://assets.terra.money/icon/60/AUT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'CAT',
    asset: { native_token: { denom: 'ucad' } },
    icon: 'https://assets.terra.money/icon/60/CAT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'CHT',
    asset: { native_token: { denom: 'uchf' } },
    icon: 'https://assets.terra.money/icon/60/CHT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'CNT',
    asset: { native_token: { denom: 'ucny' } },
    icon: 'https://assets.terra.money/icon/60/CNT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'DKT',
    asset: { native_token: { denom: 'udkk' } },
    icon: 'https://assets.terra.money/icon/60/DKT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'EUT',
    asset: { native_token: { denom: 'ueur' } },
    icon: 'https://assets.terra.money/icon/60/EUT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'GBT',
    asset: { native_token: { denom: 'ugbp' } },
    icon: 'https://assets.terra.money/icon/60/GBT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'HKT',
    asset: { native_token: { denom: 'uhkd' } },
    icon: 'https://assets.terra.money/icon/60/HKT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'IDT',
    asset: { native_token: { denom: 'uidr' } },
    icon: 'https://assets.terra.money/icon/60/IDT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'JPT',
    asset: { native_token: { denom: 'ujpy' } },
    icon: 'https://assets.terra.money/icon/60/JPT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'MNT',
    asset: { native_token: { denom: 'umnt' } },
    icon: 'https://assets.terra.money/icon/60/MNT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'NOT',
    asset: { native_token: { denom: 'unok' } },
    icon: 'https://assets.terra.money/icon/60/NOT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'PHT',
    asset: { native_token: { denom: 'uphp' } },
    icon: 'https://assets.terra.money/icon/60/PHT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'SDT',
    asset: { native_token: { denom: 'usdr' } },
    icon: 'https://assets.terra.money/icon/60/SDT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'SET',
    asset: { native_token: { denom: 'usek' } },
    icon: 'https://assets.terra.money/icon/60/SET.png',
  },
  {
    protocol: 'Terra',
    symbol: 'SGT',
    asset: { native_token: { denom: 'usgd' } },
    icon: 'https://assets.terra.money/icon/60/SGT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'THT',
    asset: { native_token: { denom: 'uthb' } },
    icon: 'https://assets.terra.money/icon/60/THT.png',
  },
  {
    protocol: 'Terra',
    symbol: 'KRT',
    asset: { native_token: { denom: 'ukrt' } },
    icon: 'https://assets.terra.money/icon/60/KRT.png',
  },
];

const cache: Map<string, TokenDisplayInfo[]> = new Map();

export async function tokenDisplayInfosQuery(
  networkName: string,
): Promise<TokenDisplayInfo[]> {
  if (cache.has(networkName)) {
    return cache.get(networkName)!;
  }

  const cw20TokenDisplayInfos = await cw20TokenDisplayInfosQuery();

  const cw20DisplayInfos =
    cw20TokenDisplayInfos[networkName] ?? cw20TokenDisplayInfos['mainnet'];

  const result: TokenDisplayInfo[] = [
    ...NATIVE_TOKEN_DISPLAY_INFOS,
    ...Object.values(cw20DisplayInfos)
      .filter(({ symbol }) => symbol.toLowerCase().indexOf('delisted') === -1)
      .map(({ token, symbol, protocol, icon }) => {
        return {
          protocol,
          symbol,
          icon,
          asset: {
            token: {
              contract_addr: token,
            },
          },
        };
      }),
  ];

  cache.set(networkName, result);

  return result;
}
