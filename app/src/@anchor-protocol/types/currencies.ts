import { NominalType } from '@libs/types';

// CW20 currencies
export type aUST<T = string> = T & NominalType<'aust'>;
export type ANC<T = string> = T & NominalType<'anc'>;
export type bLuna<T = string> = T & NominalType<'bluna'>;
export type bEth<T = string> = T & NominalType<'beth'>;
export type AncUstLP<T = string> = T & NominalType<'anc_ust_lp'>;
export type bLunaLunaLP<T = string> = T & NominalType<'bluna_luna_lp'>;

// Union currencies
export type aToken<T = string> = T & NominalType<'aust'>;
export type bAsset<T = string> = T & NominalType<'bluna' | 'beth'>;

export type LPToken<T = string> = T &
  NominalType<'anc_ust_lp' | 'bluna_luna_lp'>;
