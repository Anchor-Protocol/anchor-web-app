import { uToken } from '@anchor-protocol/types/currencies';
import { CW20Addr, Denom } from '../common';

export type SimulationInfo =
  | {
      token: {
        contract_addr: CW20Addr;
      };
    }
  | {
      native_token: {
        denom: Denom;
      };
    };

export interface Simulation<T extends uToken> {
  simulation: {
    offer_asset: {
      info: SimulationInfo;
      amount: T;
    };
  };
}

export interface SimulationResponse<T extends uToken> {
  commission_amount: T;
  return_amount: T;
  spread_amount: T;
}
