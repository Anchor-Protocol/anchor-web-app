import {
  AUD,
  CAD,
  CHF,
  CNY,
  cw20,
  DKK,
  EUR,
  GBP,
  HKD,
  IDR,
  INR,
  JPY,
  KRT,
  Luna,
  MNT,
  NativeDenom,
  NOK,
  PHP,
  SDR,
  SEK,
  SGD,
  THB,
  Token,
  u,
  UST,
} from '@libs/types';

export function nativeTokenInfoQuery(
  denom: NativeDenom,
): cw20.TokenInfoResponse<Token> | undefined {
  switch (denom) {
    case 'uust':
    case 'uusd':
      return {
        decimals: 6,
        name: 'UST',
        symbol: 'UST',
        total_supply: '0' as u<UST>,
      };
    case 'uluna':
      return {
        decimals: 6,
        name: 'LUNA',
        symbol: 'LUNA',
        total_supply: '0' as u<Luna>,
      };
    case 'ukrw':
    case 'ukrt':
      return {
        decimals: 6,
        name: 'KRT',
        symbol: 'KRT',
        total_supply: '0' as u<KRT>,
      };
    case 'uaud':
      return {
        decimals: 6,
        name: 'AUD',
        symbol: 'AUD',
        total_supply: '0' as u<AUD>,
      };
    case 'ucad':
      return {
        decimals: 6,
        name: 'CAD',
        symbol: 'CAD',
        total_supply: '0' as u<CAD>,
      };
    case 'uchf':
      return {
        decimals: 6,
        name: 'CHF',
        symbol: 'CHF',
        total_supply: '0' as u<CHF>,
      };
    case 'ucny':
      return {
        decimals: 6,
        name: 'CNY',
        symbol: 'CNY',
        total_supply: '0' as u<CNY>,
      };
    case 'udkk':
      return {
        decimals: 6,
        name: 'DKK',
        symbol: 'DKK',
        total_supply: '0' as u<DKK>,
      };
    case 'ueur':
      return {
        decimals: 6,
        name: 'EUR',
        symbol: 'EUR',
        total_supply: '0' as u<EUR>,
      };
    case 'ugbp':
      return {
        decimals: 6,
        name: 'GBP',
        symbol: 'GBP',
        total_supply: '0' as u<GBP>,
      };
    case 'uhkd':
      return {
        decimals: 6,
        name: 'HKD',
        symbol: 'HKD',
        total_supply: '0' as u<HKD>,
      };
    case 'uidr':
      return {
        decimals: 6,
        name: 'IDR',
        symbol: 'IDR',
        total_supply: '0' as u<IDR>,
      };
    case 'uinr':
      return {
        decimals: 6,
        name: 'INR',
        symbol: 'INR',
        total_supply: '0' as u<INR>,
      };
    case 'ujpy':
      return {
        decimals: 6,
        name: 'JPY',
        symbol: 'JPY',
        total_supply: '0' as u<JPY>,
      };
    case 'umnt':
      return {
        decimals: 6,
        name: 'MNT',
        symbol: 'MNT',
        total_supply: '0' as u<MNT>,
      };
    case 'unok':
      return {
        decimals: 6,
        name: 'NOK',
        symbol: 'NOK',
        total_supply: '0' as u<NOK>,
      };
    case 'uphp':
      return {
        decimals: 6,
        name: 'PHP',
        symbol: 'PHP',
        total_supply: '0' as u<PHP>,
      };
    case 'usdr':
      return {
        decimals: 6,
        name: 'SDR',
        symbol: 'SDR',
        total_supply: '0' as u<SDR>,
      };
    case 'usek':
      return {
        decimals: 6,
        name: 'SEK',
        symbol: 'SEK',
        total_supply: '0' as u<SEK>,
      };
    case 'usgd':
      return {
        decimals: 6,
        name: 'SGD',
        symbol: 'SGD',
        total_supply: '0' as u<SGD>,
      };
    case 'uthb':
      return {
        decimals: 6,
        name: 'THB',
        symbol: 'THB',
        total_supply: '0' as u<THB>,
      };
  }

  return undefined;
}
