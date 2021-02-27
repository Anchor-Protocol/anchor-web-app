import { CW20Addr, HumanAddr } from '@anchor-protocol/types/contracts/common';

export interface Feeder {
  feeder: {
    asset: CW20Addr;
  };
}

export interface FeederResponse {
  asset: CW20Addr;
  feeder: HumanAddr;
}
