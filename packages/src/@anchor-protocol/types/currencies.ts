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

export type ubEth<T = string> = T & NominalType<'ubeth'>;
export type bEth<T = string> = T & NominalType<'beth'>;

export type uAncUstLP<T = string> = T & NominalType<'uanc_ust_lp'>;
export type AncUstLP<T = string> = T & NominalType<'anc_ust_lp'>;

export type ubLunaLunaLP<T = string> = T & NominalType<'ubluna_luna_lp'>;
export type bLunaLunaLP<T = string> = T & NominalType<'bluna_luna_lp'>;

// Union currencies
export type uaToken<T = string> = T & NominalType<'uaust'>;

export type aToken<T = string> = T & NominalType<'aust'>;

export type uNativeToken<T = string> = T & NominalType<'uust' | 'uluna'>;

export type NativeToken<T = string> = T & NominalType<'ust' | 'luna'>;

export type ubAsset<T = string> = T & NominalType<'ubluna' | 'ubeth'>;

export type bAsset<T = string> = T & NominalType<'bluna' | 'beth'>;

export type uCW20Token<T = string> = T &
  NominalType<
    'uaust' | 'uanc' | 'ubluna' | 'ubeth' | 'uanc_ust_lp' | 'ubluna_luna_lp'
  >;

export type CW20Token<T = string> = T &
  NominalType<
    'aust' | 'anc' | 'bluna' | 'beth' | 'anc_ust_lp' | 'bluna_luna_lp'
  >;

export type uLPToken<T = string> = T &
  NominalType<'uanc_ust_lp' | 'ubluna_luna_lp'>;

export type LPToken<T = string> = T &
  NominalType<'anc_ust_lp' | 'bluna_luna_lp'>;

export type uToken<T = string> = T &
  NominalType<
    | 'uust'
    | 'uluna'
    | 'ueth'
    | 'uaust'
    | 'uanc'
    | 'ubluna'
    | 'uanc_ust_lp'
    | 'ubluna_luna_lp'
  >;

export type Token<T = string> = T &
  NominalType<
    | 'ust'
    | 'luna'
    | 'aust'
    | 'anc'
    | 'bluna'
    | 'beth'
    | 'anc_ust_lp'
    | 'bluna_luna_lp'
  >;
