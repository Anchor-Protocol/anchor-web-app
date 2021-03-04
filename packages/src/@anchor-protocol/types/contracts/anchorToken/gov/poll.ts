import {
  Base64EncodedJson,
  HumanAddr,
} from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';
import { UpdateWhitelist } from '../../moneyMarket/overseer/updateWhitelist';

export type PollStatus = 'in_progress' | 'passed' | 'rejected' | 'executed';

export interface ExecuteMsg {
  order: number;
  contract: HumanAddr;
  msg: Base64EncodedJson;
}

export type PollMsg = UpdateWhitelist;

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#poll
 */
export interface Poll {
  poll: {
    poll_id: number;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#pollresponse
 */
export interface PollResponse {
  id: number;
  creator: HumanAddr;
  status: PollStatus;
  end_height: number;
  title: string;
  description: string;
  link?: string;
  deposit_amount: uANC;
  //execute_data?: ExecuteMsg[];
  execute_data?: Array<ExecuteMsg>;
  yes_votes: uANC;
  no_votes: uANC;
  total_balance_at_end_poll: uANC;
}
