import { Rate } from '../../../units';
import { HumanAddr } from '../../common';

export interface UpdateConfig {
  update_config: {
    owner_addr?: HumanAddr;
    reserve_factor?: Rate;
    max_borrow_factor?: Rate;
    interest_model?: HumanAddr;
    distribution_model?: HumanAddr;
  };
}
