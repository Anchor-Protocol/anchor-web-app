import { HumanAddr } from '../../common';
import { Rate } from '../../../units';

export interface UpdateConfig {
  update_config: {
    owner?: HumanAddr;
    base_rate?: Rate;
    interest_multiplier?: Rate;
  };
}
