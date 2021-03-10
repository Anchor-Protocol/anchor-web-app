import {
  Base64EncodedJson,
  HumanAddr,
} from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';
import { UpdateConfig as InterestModelUpdateConfig } from '../../moneyMarket/interestModel/updateConfig';
import { UpdateConfig as MarketUpdateConfig } from '../../moneyMarket/market/updateConfig';
import { UpdateConfig as OverseerUpdateConfig } from '../../moneyMarket/overseer/updateConfig';
import { UpdateWhitelist as OverseerUpdateWhitelist } from '../../moneyMarket/overseer/updateWhitelist';
import { UpdateConfig as DistributionModelUpdateConfig } from '../../moneyMarket/distributionModel/updateConfig';

export type PollStatus = 'in_progress' | 'passed' | 'rejected' | 'executed';

export interface ExecuteMsg {
  order: number;
  contract: HumanAddr;
  msg: Base64EncodedJson;
}

export interface ParsedExecuteMsg {
  order: number;
  contract: HumanAddr;
  msg: PollMsg;
}

export type PollMsg =
  | OverseerUpdateWhitelist
  | OverseerUpdateConfig
  | MarketUpdateConfig
  | InterestModelUpdateConfig
  | DistributionModelUpdateConfig;

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
  execute_data?: Array<ExecuteMsg>;
  yes_votes: uANC;
  no_votes: uANC;
  staked_amount?: uANC;
  total_balance_at_end_poll: uANC;
}
