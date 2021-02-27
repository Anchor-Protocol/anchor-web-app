import { uaToken } from '@anchor-protocol/types/currencies';
import { Rate } from '@anchor-protocol/types/units';

export interface EpochState {
  epoch_state: {};
}

export interface EpochStateResponse {
  deposit_rate: Rate;
  prev_aterra_supply: uaToken;
  prev_exchange_rate: Rate;
  last_executed_height: number;
}
