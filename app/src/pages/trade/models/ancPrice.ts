import { ANC, AncUstLP, u, UST } from '@anchor-protocol/types';

export interface AncPrice {
  ANCPoolSize: u<ANC<string>>;
  USTPoolSize: u<UST<string>>;
  LPShare: u<AncUstLP<string>>;
  ANCPrice: UST<string>;
}
