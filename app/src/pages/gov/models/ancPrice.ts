import { Num, UST } from '@anchor-protocol/types';

export interface AncPrice {
  ANCPoolSize: Num<string>;
  USTPoolSize: Num<string>;
  LPShare: Num<string>;
  ANCPrice: UST<string>;
}
