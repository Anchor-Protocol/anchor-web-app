import { CanonicalAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';
import { Rate } from '@anchor-protocol/types/units';

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
