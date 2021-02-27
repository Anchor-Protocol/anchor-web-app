import { Rate } from '../../../units';
import { bAssetDenom, CW20Addr, HumanAddr } from '../../common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#whitelist-1
 */
export interface Whitelist {
  whitelist: {
    collateral_token?: CW20Addr;
    start_after?: HumanAddr;
    limit?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#whitelistresponse
 */
export interface WhitelistResponse {
  elems: Array<{
    name: string;
    symbol: bAssetDenom;
    max_ltv: Rate;
    custody_contract: HumanAddr;
    collateral_token: CW20Addr;
  }>;
}
