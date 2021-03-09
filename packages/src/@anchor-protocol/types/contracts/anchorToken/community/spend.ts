import { HumanAddr } from '@anchor-protocol/types/contracts/common';
import { uANC } from '@anchor-protocol/types/currencies';

export interface Spend {
  spend: {
    recipient: HumanAddr;
    amount: uANC;
  };
}
