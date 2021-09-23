import {
  AUD,
  CAD,
  CHF,
  CNY,
  DKK,
  EUR,
  Gas,
  GBP,
  HKD,
  HumanAddr,
  IDR,
  INR,
  JPY,
  KRW,
  Luna,
  MNT,
  NOK,
  PHP,
  Rate,
  SDR,
  SEK,
  SGD,
  TerraContractAddress,
  THB,
  u,
  UST,
} from '@libs/types';
import { GasPrice } from './models/gasPrice';
import { TerraContantsInput } from './types';

export const DEFAULT_TERRA_CONTRACT_ADDRESS: Record<
  string,
  TerraContractAddress
> = {
  mainnet: {
    terraswap: {
      factory: 'terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj' as HumanAddr,
    },
  },
  testnet: {
    terraswap: {
      factory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf' as HumanAddr,
    },
  },
};

export const DEFAULT_TERRA_CONSTANTS: Record<string, TerraContantsInput> = {
  mainnet: {
    gasFee: 1_000_000 as Gas,
    fixedGasGas: 1_671_053 as Gas,
    //fixedGas: 635_000 as u<UST<number>>,
    blocksPerYear: 4_656_810,
    gasAdjustment: 1.6 as Rate<number>,
  },

  testnet: {
    gasFee: 1_000_000 as Gas,
    fixedGasGas: 1_671_053 as Gas,
    //fixedGas: 635_000 as u<UST<number>>,
    blocksPerYear: 4_656_810,
    gasAdjustment: 1.6 as Rate<number>,
  },
};

export enum TERRA_TX_KEYS {
  CW20_BUY = 'NEBULA_TX_CW20_BUY',
  CW20_SELL = 'NEBULA_TX_CW20_SELL',
  SEND = 'NEBULA_TX_SEND',
}

export enum TERRA_QUERY_KEY {
  TOKEN_BALANCES = 'TERRA_QUERY_TOKEN_BALANCES',
  TAX = 'TERRA_QUERY_TAX',
  CW20_BALANCE = 'TERRA_QUERY_CW20_BALANCE',
  CW20_ICONS = 'TERRA_QUERY_CW20_ICONS',
  CW20_TOKEN_INFO = 'NEBULA_QUERY_CW20_TOKEN_INFO',
  STAKING_POOL_INFO = 'NEBULA_QUERY_STAKING_CLUSTER_POOL_INFO_LIST',
  TERRASWAP_PAIR = 'NEBULA_QUERY_TERRASWAP_PAIR',
  TERRASWAP_POOL = 'NEBULA_QUERY_TERRASWAP_POOL',
  TERRA_BALANCES = 'NEBULA_QUERY_TERRA_BALANCES',
}

export const DEFAULT_GAS_PRICE_ENDPOINT: Record<string, string> = {
  mainnet: 'https://fcd.terra.dev/v1/txs/gas_prices',
  testnet: 'https://tequila-fcd.terra.dev/v1/txs/gas_prices',
  bombay: 'https://bombay-fcd.terra.dev/v1/txs/gas_prices',
};

export const FALLBACK_GAS_PRICE: Record<string, GasPrice> = {
  mainnet: {
    uluna: '0.013199' as u<Luna>,
    usdr: '0.267408' as u<SDR>,
    uusd: '0.38' as u<UST>,
    ukrw: '443.515327' as u<KRW>,
    umnt: '1061.675585' as u<MNT>,
    ueur: '0.323109' as u<EUR>,
    ucny: '2.455638' as u<CNY>,
    ujpy: '41.68797' as u<JPY>,
    ugbp: '0.276745' as u<GBP>,
    uinr: '28.085651' as u<INR>,
    ucad: '0.481912' as u<CAD>,
    uchf: '0.347244' as u<CHF>,
    uaud: '0.527101' as u<AUD>,
    usgd: '0.514572' as u<SGD>,
    uthb: '12.581803' as u<THB>,
    usek: '3.314161' as u<SEK>,
    unok: '3.314161' as u<NOK>,
    udkk: '2.402775' as u<DKK>,
    uhkd: '2.950842' as u<HKD>,
    uidr: '5450.0' as u<IDR>,
    uphp: '19.0' as u<PHP>,
  },
  testnet: {
    uluna: '0.15' as u<Luna>,
    usdr: '0.1018' as u<SDR>,
    uusd: '0.15' as u<UST>,
    ukrw: '178.05' as u<KRW>,
    umnt: '431.6259' as u<MNT>,
    ueur: '0.125' as u<EUR>,
    ucny: '0.97' as u<CNY>,
    ujpy: '16' as u<JPY>,
    ugbp: '0.11' as u<GBP>,
    uinr: '11' as u<INR>,
    ucad: '0.19' as u<CAD>,
    uchf: '0.13' as u<CHF>,
    uaud: '0.19' as u<AUD>,
    usgd: '0.2' as u<SGD>,
    uthb: '4.62' as u<THB>,
    usek: '1.25' as u<SEK>,
    unok: '1.25' as u<NOK>,
    udkk: '0.9' as u<DKK>,
    // copied from mainnet
    uhkd: '2.950842' as u<HKD>,
    uidr: '5450.0' as u<IDR>,
    uphp: '19.0' as u<PHP>,
  },
  bombay: {
    uluna: '0.15' as u<Luna>,
    usdr: '0.1018' as u<SDR>,
    uusd: '0.15' as u<UST>,
    ukrw: '178.05' as u<KRW>,
    umnt: '431.6259' as u<MNT>,
    ueur: '0.125' as u<EUR>,
    ucny: '0.97' as u<CNY>,
    ujpy: '16' as u<JPY>,
    ugbp: '0.11' as u<GBP>,
    uinr: '11' as u<INR>,
    ucad: '0.19' as u<CAD>,
    uchf: '0.13' as u<CHF>,
    uaud: '0.19' as u<AUD>,
    usgd: '0.2' as u<SGD>,
    uthb: '4.62' as u<THB>,
    usek: '1.25' as u<SEK>,
    unok: '1.25' as u<NOK>,
    udkk: '0.9' as u<DKK>,
    // copied from mainnet
    uhkd: '2.950842' as u<HKD>,
    uidr: '5450.0' as u<IDR>,
    uphp: '19.0' as u<PHP>,
  },
};
