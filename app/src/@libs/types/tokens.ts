import { NominalType } from './common';
import { terraswap } from './contracts';

export type Micro = { __micro: true };
export type NoMicro = { __micro?: false };

export type u<T = string> = T & Micro;

// Gas
export type Gas<T = number> = T & NominalType<'gas'>;

// Native currencies
export type UST<T = string> = T & NominalType<'ust'>;
export type AUD<T = string> = T & NominalType<'aud'>;
export type CAD<T = string> = T & NominalType<'cad'>;
export type CHF<T = string> = T & NominalType<'chf'>;
export type CNY<T = string> = T & NominalType<'cny'>;
export type DKK<T = string> = T & NominalType<'dkk'>;
export type EUR<T = string> = T & NominalType<'eur'>;
export type GBP<T = string> = T & NominalType<'gbp'>;
export type HKD<T = string> = T & NominalType<'hkd'>;
export type IDR<T = string> = T & NominalType<'idr'>;
export type INR<T = string> = T & NominalType<'inr'>;
export type JPY<T = string> = T & NominalType<'jpy'>;
export type KRW<T = string> = T & NominalType<'krw'>;
export type MNT<T = string> = T & NominalType<'mnt'>;
export type NOK<T = string> = T & NominalType<'nok'>;
export type PHP<T = string> = T & NominalType<'php'>;
export type SDR<T = string> = T & NominalType<'sdr'>;
export type SEK<T = string> = T & NominalType<'sek'>;
export type SGD<T = string> = T & NominalType<'sgd'>;
export type THB<T = string> = T & NominalType<'thb'>;
export type KRT<T = string> = T & NominalType<'krt'>;
export type Luna<T = string> = T & NominalType<'luna'>;

// Astroport currencies
export type Astro<T = string> = T & NominalType<'astro'>;

// LP currencies
export type LP<T = string> = T & NominalType<'lp'>;

// Union currencies
export type NativeToken<T = string> = T &
  NominalType<
    | 'ust'
    | 'aud'
    | 'cad'
    | 'chf'
    | 'cny'
    | 'dkk'
    | 'eur'
    | 'gbp'
    | 'hkd'
    | 'idr'
    | 'inr'
    | 'jpy'
    | 'krw'
    | 'mnt'
    | 'nok'
    | 'php'
    | 'sdr'
    | 'sek'
    | 'sgd'
    | 'thb'
    | 'krt'
    | 'luna'
  >;

// All currencies
export type Token<T = string> = T & NominalType<string>;

export const NATIVE_TOKEN_DENOMS = [
  'uusd',
  'uluna',
  'uaud',
  'ucad',
  'uchf',
  'ucny',
  'udkk',
  'ueur',
  'ugbp',
  'uhkd',
  'uidr',
  'uinr',
  'ujpy',
  'ukrw',
  'umnt',
  'unok',
  'uphp',
  'usdr',
  'usek',
  'usgd',
  'uthb',
  'ukrt',
];

// utility constants
export const NATIVE_TOKEN_ASSET_INFOS: terraswap.AssetInfo[] = [
  { native_token: { denom: 'uusd' } },
  { native_token: { denom: 'uluna' } },
  { native_token: { denom: 'uaud' } },
  { native_token: { denom: 'ucad' } },
  { native_token: { denom: 'uchf' } },
  { native_token: { denom: 'ucny' } },
  { native_token: { denom: 'udkk' } },
  { native_token: { denom: 'ueur' } },
  { native_token: { denom: 'ugbp' } },
  { native_token: { denom: 'uhkd' } },
  { native_token: { denom: 'uidr' } },
  { native_token: { denom: 'uinr' } },
  { native_token: { denom: 'ujpy' } },
  { native_token: { denom: 'ukrw' } },
  { native_token: { denom: 'umnt' } },
  { native_token: { denom: 'unok' } },
  { native_token: { denom: 'uphp' } },
  { native_token: { denom: 'usdr' } },
  { native_token: { denom: 'usek' } },
  { native_token: { denom: 'usgd' } },
  { native_token: { denom: 'uthb' } },
  { native_token: { denom: 'ukrt' } },
];
