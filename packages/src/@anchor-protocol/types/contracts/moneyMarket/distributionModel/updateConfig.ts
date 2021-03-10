import { uANC } from '@anchor-protocol/types/currencies';
import { Rate } from '../../../units';
import { HumanAddr } from '../../common';

export interface UpdateConfig {
  update_config: {
    owner?: HumanAddr;
    emission_cap?: uANC;
    emission_floor?: uANC;
    increment_multiplier?: Rate;
    decrement_multiplier?: Rate;
  };
}
