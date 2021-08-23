import { NominalType } from './common';

export type HumanAddr = string & NominalType<'HumanAddr'>;
export type CanonicalAddr = string & NominalType<'CanonicalAddr'>;
export type CW20Addr = string & NominalType<'CW20Addr'>;
export type LPAddr = string & NominalType<'LPAddr'>;

export type NativeDenom = string & NominalType<'NativeDenom'>;
export type bAssetDenom = string & NominalType<'bAssetDenom'>;
export type AssetDenom = string & NominalType<'AssetDenom'>;
export type Denom = NativeDenom | bAssetDenom | AssetDenom;

export type Base64EncodedJson = string & NominalType<'Base64EncodedJson'>;

export type WASMContractResult = {
  Result: string;
};

export namespace rs {
  export type u8 = number;
  export type u32 = number;
  export type u64 = number;
  export type Uint128 = string;
  export type Decimal = string;
  export type FPDecimal = string;
}

export enum OrderBy {
  Asc = 'asc',
  Desc = 'desc',
}
