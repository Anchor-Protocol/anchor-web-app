import {
  Base64EncodedJson,
  CanonicalAddr,
  HumanAddr,
  Num,
  Rate,
} from '@libs/types';
import { uANC, uAncUstLP } from '../currencies';
import { moneyMarket } from './moneyMarket';

export namespace anchorToken {
  export namespace collector {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/collector#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/collector#configresponse
     */
    export interface ConfigResponse {
      gov_contract: HumanAddr;
      terraswap_factory: HumanAddr;
      anchor_token: HumanAddr;
      distributor_contract: HumanAddr;
      reward_weight: Rate;
    }
  }

  export namespace community {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/community#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/community#configresponse
     */
    export interface ConfigResponse {
      gov_contract: HumanAddr;
      anchor_token: HumanAddr;
      spend_limit: uANC;
    }

    /**
     * @see https://app.gitbook.com/@anchor-protocol/s/anchor-2/smart-contracts/anchor-token/community#spend
     */
    export interface Spend {
      spend: {
        recipient: HumanAddr;
        amount: uANC;
      };
    }
  }

  export namespace distributor {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/dripper#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/dripper#configresponse
     */
    export interface ConfigResponse {
      gov_contract: HumanAddr;
      anchor_token: HumanAddr;
      whitelist: Array<HumanAddr>;
      spend_limit: uANC;
    }
  }

  export namespace gov {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#configresponse
     */
    export interface ConfigResponse {
      owner: CanonicalAddr;
      anchor_token: CanonicalAddr;
      quorum: Rate;
      threshold: Rate;
      voting_period: number;
      timelock_period: number;
      expiration_period: number;
      proposal_deposit: uANC;
      snapshot_period: number;
    }

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
      | moneyMarket.overseer.UpdateWhitelist
      | moneyMarket.overseer.UpdateConfig
      | moneyMarket.market.UpdateConfig
      | moneyMarket.interestModel.UpdateConfig
      | moneyMarket.distributionModel.UpdateConfig
      | anchorToken.community.Spend
      | moneyMarket.overseer.RegisterWhitelist
      | moneyMarket.oracle.RegisterFeeder;

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

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#polls
     */
    export interface Polls {
      polls: {
        filter?: PollStatus;
        start_after?: number;
        limit?: number;
        order_by?: 'asc' | 'desc';
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#pollsresponse
     */
    export interface PollsResponse {
      polls: Array<PollResponse>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#staker
     */
    export interface Staker {
      staker: {
        address: HumanAddr;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#stakerresponse
     */
    export interface StakerResponse {
      balance: uANC;
      share: uANC;
      locked_balance: Array<
        [
          number, // poll_id
          {
            vote: 'yes' | 'no';
            balance: uANC;
          },
        ]
      >;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#state
     */
    export interface State {
      state: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#stateresponse
     */
    export interface StateResponse {
      poll_count: number;
      total_share: uANC;
      total_deposit: uANC;
    }

    export interface Voter {
      voter: HumanAddr;
      vote: 'yes' | 'no';
      balance: uANC;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#voters
     */
    export interface Voters {
      voters: {
        poll_id?: number;
        start_after?: HumanAddr;
        limit?: number;
        order_by?: 'asc' | 'desc';
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/gov#votersresponse
     */
    export interface VotersResponse {
      voters: Array<Voter>;
    }
  }

  export namespace staking {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#configresponse
     */
    export interface ConfigResponse {
      anchor_token: HumanAddr;
      staking_token: HumanAddr;
      distribution_schedule: Array<[number, number, uANC]>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#stakerinfo
     */
    export interface StakerInfo {
      staker_info: {
        staker: HumanAddr;
        block_height?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#stakerinforesponse
     */
    export interface StakerInfoResponse {
      staker: HumanAddr;
      reward_index: Num;
      bond_amount: uAncUstLP;
      pending_reward: uANC;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#state
     */
    export interface State {
      state: {
        block_height?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/anchor-token/staking#stateresponse
     */
    export interface StateResponse {
      last_distributed: number;
      total_bond_amount: uAncUstLP;
      global_reward_index: Num;
    }
  }
}
