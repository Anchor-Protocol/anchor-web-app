import {
  bAssetDenom,
  HumanAddr,
} from '@anchor-protocol/types/contracts/common';
import { Rate } from '@anchor-protocol/types/units';

export interface Whitelist {
  whitelist: {
    collateral_token?: HumanAddr;
    start_after?: HumanAddr;
    limit?: number;
  };
}

export interface WhitelistResponse {
  elems: Array<{
    name: string;
    symbol: bAssetDenom;
    max_ltv: Rate;
    custody_contract: HumanAddr;
    collateral_token: HumanAddr;
  }>;
}
