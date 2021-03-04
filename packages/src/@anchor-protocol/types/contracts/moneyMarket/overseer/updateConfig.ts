import { HumanAddr } from '../../common';
import { Rate } from '../../../units';

export interface UpdateConfig {
  update_config: {
    owner_addr?: HumanAddr;
    oracle_contract?: HumanAddr;
    liquidation_contract?: HumanAddr;
    threshold_deposit_rate?: Rate;
    target_deposit_rate?: Rate;
    buffer_distribution_factor?: Rate;
    anc_purchase_factor?: Rate;
    epoch_period?: number;
    price_timeframe?: number;
  };
}
