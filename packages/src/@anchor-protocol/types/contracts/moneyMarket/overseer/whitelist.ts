import { Rate } from '../../../units';
import { bAssetDenom, CW20Addr, HumanAddr } from '../../common';

export interface Whitelist {
  whitelist: {
    collateral_token?: CW20Addr;
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
    collateral_token: CW20Addr;
  }>;
}
