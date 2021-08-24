import { NominalType } from '@libs/types';

export type u<T = string> = T & { __micro: true };
export type NoMicro = { __micro?: false };

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

// LP currencies
export type LP<T = string> = T & NominalType<'lp'>;

// Union currencies
export type NativeToken<T = string> = T & NominalType<'ust' | 'krt' | 'luna'>;

// All currencies
export type Token<T = string> = T & NominalType<string>;
