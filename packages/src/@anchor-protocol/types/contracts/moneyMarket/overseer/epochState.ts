import { uaToken } from '@anchor-protocol/types/currencies';
import { Rate } from '@anchor-protocol/types/units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#epochstate
 */
export interface EpochState {
  epoch_state: {};
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#epochstateresponse
 */
export interface EpochStateResponse {
  deposit_rate: Rate;
  prev_aterra_supply: uaToken;
  prev_exchange_rate: Rate;
  last_executed_height: number;
}
