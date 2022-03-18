import { NominalType } from '@libs/types';

// the native token of the chain, ie, Luna, Eth, Avax
export type Native<T = string> = T & NominalType<'native'>;

// well known tokens
export type aUST<T = string> = T & NominalType<'aust'>;
export type ANC<T = string> = T & NominalType<'anc'>;

// generic for all other assets
export type Collateral<T = string> = T & NominalType<'collateral'>;

// LP tokens for governance
export type AncUstLP<T = string> = T & NominalType<'anc_ust_lp'>;
export type bLunaLunaLP<T = string> = T & NominalType<'bluna_luna_lp'>;
export type LPToken<T = string> = T &
  NominalType<'anc_ust_lp' | 'bluna_luna_lp'>;

// NOTE: trying to move away from these being "known" to a more dynamic approach
export type bLuna<T = string> = T & NominalType<'bluna'>;
export type Eth<T = string> = T & NominalType<'eth'>;
export type bEth<T = string> = T & NominalType<'beth'>;
export type aToken<T = string> = T & NominalType<'aust'>;
export type bAsset<T = string> = T & NominalType<'bluna' | 'basset'>;
