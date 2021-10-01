import { cw20, NativeDenom, Token, u } from '@libs/types';

export function nativeTokenInfoQuery<T extends Token>(
  denom: NativeDenom,
): cw20.TokenInfoResponse<T> | undefined {
  switch (denom) {
    case 'uust':
    case 'uusd':
      return {
        decimals: 6,
        name: 'UST',
        symbol: 'UST',
        total_supply: '0' as u<T>,
      };
    case 'uluna':
      return {
        decimals: 6,
        name: 'LUNA',
        symbol: 'LUNA',
        total_supply: '0' as u<T>,
      };
    case 'ukrw':
    case 'ukrt':
      return {
        decimals: 6,
        name: 'KRT',
        symbol: 'KRT',
        total_supply: '0' as u<T>,
      };
    case 'uaud':
      return {
        decimals: 6,
        name: 'AUD',
        symbol: 'AUD',
        total_supply: '0' as u<T>,
      };
    case 'ucad':
      return {
        decimals: 6,
        name: 'CAD',
        symbol: 'CAD',
        total_supply: '0' as u<T>,
      };
    case 'uchf':
      return {
        decimals: 6,
        name: 'CHF',
        symbol: 'CHF',
        total_supply: '0' as u<T>,
      };
    case 'ucny':
      return {
        decimals: 6,
        name: 'CNY',
        symbol: 'CNY',
        total_supply: '0' as u<T>,
      };
    case 'udkk':
      return {
        decimals: 6,
        name: 'DKK',
        symbol: 'DKK',
        total_supply: '0' as u<T>,
      };
    case 'ueur':
      return {
        decimals: 6,
        name: 'EUR',
        symbol: 'EUR',
        total_supply: '0' as u<T>,
      };
    case 'ugbp':
      return {
        decimals: 6,
        name: 'GBP',
        symbol: 'GBP',
        total_supply: '0' as u<T>,
      };
    case 'uhkd':
      return {
        decimals: 6,
        name: 'HKD',
        symbol: 'HKD',
        total_supply: '0' as u<T>,
      };
    case 'uidr':
      return {
        decimals: 6,
        name: 'IDR',
        symbol: 'IDR',
        total_supply: '0' as u<T>,
      };
    case 'uinr':
      return {
        decimals: 6,
        name: 'INR',
        symbol: 'INR',
        total_supply: '0' as u<T>,
      };
    case 'ujpy':
      return {
        decimals: 6,
        name: 'JPY',
        symbol: 'JPY',
        total_supply: '0' as u<T>,
      };
    case 'umnt':
      return {
        decimals: 6,
        name: 'MNT',
        symbol: 'MNT',
        total_supply: '0' as u<T>,
      };
    case 'unok':
      return {
        decimals: 6,
        name: 'NOK',
        symbol: 'NOK',
        total_supply: '0' as u<T>,
      };
    case 'uphp':
      return {
        decimals: 6,
        name: 'PHP',
        symbol: 'PHP',
        total_supply: '0' as u<T>,
      };
    case 'usdr':
      return {
        decimals: 6,
        name: 'SDR',
        symbol: 'SDR',
        total_supply: '0' as u<T>,
      };
    case 'usek':
      return {
        decimals: 6,
        name: 'SEK',
        symbol: 'SEK',
        total_supply: '0' as u<T>,
      };
    case 'usgd':
      return {
        decimals: 6,
        name: 'SGD',
        symbol: 'SGD',
        total_supply: '0' as u<T>,
      };
    case 'uthb':
      return {
        decimals: 6,
        name: 'THB',
        symbol: 'THB',
        total_supply: '0' as u<T>,
      };
  }

  return undefined;
}
