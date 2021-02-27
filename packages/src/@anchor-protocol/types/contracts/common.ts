import { NominalType } from '../common';

export type HumanAddr = string & NominalType<'HumanAddr'>;
export type CanonicalAddr = string & NominalType<'CanonicalAddr'>;
export type CW20Addr = string & NominalType<'CW20Addr'>;

export type StableDenom = string & NominalType<'StableDenom'>;
export type bAssetDenom = string & NominalType<'bAssetDenom'>;
export type AssetDenom = string & NominalType<'AssetDenom'>;
export type Denom = StableDenom | bAssetDenom | AssetDenom;

export type Base64EncodedJson = string & NominalType<'Base64EncodedJson'>;
