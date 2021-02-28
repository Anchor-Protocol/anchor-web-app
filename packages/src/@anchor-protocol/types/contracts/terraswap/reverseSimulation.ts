import { uToken } from '@anchor-protocol/types/currencies';
import { CW20Addr, Denom } from '../common';

export type ReverseSimulationInfo =
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

export interface ReverseSimulation<T extends uToken> {
  reverse_simulation: {
    ask_asset: {
      info: ReverseSimulationInfo;
      amount: T;
    };
  };
}

export interface ReverseSimulationResponse<T extends uToken> {
  commission_amount: T;
  offer_amount: T;
  spread_amount: T;
}
