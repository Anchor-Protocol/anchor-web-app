import { Num, Rate } from '../../../units';

export interface EpochState {
  epoch_state: {
    block_height?: number;
  };
}

export interface EpochStateResponse {
  exchange_rate: Rate;
  aterra_supply: Num;
}
