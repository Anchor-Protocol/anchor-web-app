import {
  uANC,
  uAncUstLP,
  UST,
  uUST,
  WASMContractResult,
} from '@anchor-protocol/types';

export interface AncPrice {
  ANCPoolSize: uANC;
  USTPoolSize: uUST;
  LPShare: uAncUstLP;
  ANCPrice: UST;
}

export interface ANCPriceRawData {
  ancPrice: WASMContractResult;
}

export interface ANCPriceData {
  ancPrice: AncPrice;
}

export interface ANCPriceRawVariables {
  ancUstPairContract: string;
}
