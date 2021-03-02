import { CW20Addr, HumanAddr } from '../../common';
import { Rate } from '../../../units';

export interface UpdateWhitelist {
  update_whitelist: {
    collateral_token: CW20Addr;
    custody_contract?: HumanAddr;
    max_ltv?: Rate;
  };
}
