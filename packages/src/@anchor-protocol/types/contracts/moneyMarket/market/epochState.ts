import { Num, Rate } from '../../../units';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#epochstate
 */
export interface EpochState {
  epoch_state: {
    block_height?: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#epochstateresponse
 */
export interface EpochStateResponse {
  exchange_rate: Rate;
  aterra_supply: Num;
}
