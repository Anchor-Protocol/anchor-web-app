import { Rate } from '../../../units';
import { HumanAddr } from '../../common';

export interface UpdateConfig {
  update_config: {
    owner?: HumanAddr;
    emission_cap?: Rate;
    emission_floor?: Rate;
    increment_multiplier?: Rate;
    decrement_multiplier?: Rate;
  };
}
