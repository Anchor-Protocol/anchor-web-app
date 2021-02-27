import { CW20Addr, HumanAddr } from '@anchor-protocol/types/contracts/common';

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#feeder
 */
export interface Feeder {
  feeder: {
    asset: CW20Addr;
  };
}

/**
 * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#feederresponse
 */
export interface FeederResponse {
  asset: CW20Addr;
  feeder: HumanAddr;
}
