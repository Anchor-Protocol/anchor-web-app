import { uANC, uAncUstLP, UST, uUST } from '@anchor-protocol/types';

export interface AncPrice {
  ANCPoolSize: uANC<string>;
  USTPoolSize: uUST<string>;
  LPShare: uAncUstLP<string>;
  ANCPrice: UST<string>;
}
