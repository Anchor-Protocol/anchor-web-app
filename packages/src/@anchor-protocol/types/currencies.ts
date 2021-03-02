import { NominalType } from './common';

// Native currencies
export type uUST<T = string> = T & NominalType<'uust'>;
export type UST<T = string> = T & NominalType<'ust'>;

export type uLuna<T = string> = T & NominalType<'uluna'>;
export type Luna<T = string> = T & NominalType<'luna'>;

// CW20 currencies
export type uaUST<T = string> = T & NominalType<'uaust'>;
export type aUST<T = string> = T & NominalType<'aust'>;

export type uANC<T = string> = T & NominalType<'uanc'>;
export type ANC<T = string> = T & NominalType<'anc'>;

export type ubLuna<T = string> = T & NominalType<'ubluna'>;
export type bLuna<T = string> = T & NominalType<'bluna'>;

export type uANC_UST_LP<T = string> = T & NominalType<'uanc_ust_lp'>;
export type ANC_UST_LP<T = string> = T & NominalType<'anc_ust_lp'>;

export type ubLuna_Luna_LP<T = string> = T & NominalType<'ubluna_luna_lp'>;
export type bLuna_Luna_LP<T = string> = T & NominalType<'bluna_luna_lp'>;

// Union currencies
// prettier-ignore
// @formatter:off
export type uaToken<T = string> = T & NominalType<'uaust'>;

export type aToken<T = string> = T & NominalType<'aust'>;

export type uNativeToken<T = string> = T & NominalType<'uust' | 'uluna'>;

export type NativeToken<T = string> = T & NominalType<'ust' | 'luna'>;

export type uCW20Token<T = string> = T &
  NominalType<'uaust' | 'uanc' | 'ubluna' | 'uanc_ust_lp' | 'ubluna_luna_lp'>;

export type CW20Token<T = string> = T &
  NominalType<'aust' | 'anc' | 'bluna' | 'anc_ust_lp' | 'bluna_luna_lp'>;

export type uToken<T = string> = T &
  NominalType<
    | 'uust'
    | 'uluna'
    | 'uaust'
    | 'uanc'
    | 'ubluna'
    | 'uanc_ust_lp'
    | 'ubluna_luna_lp'
  >;

export type Token<T = string> = T &
  NominalType<
    'ust' | 'luna' | 'aust' | 'anc' | 'bluna' | 'anc_ust_lp' | 'bluna_luna_lp'
  >;
