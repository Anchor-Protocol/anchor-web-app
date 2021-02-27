import { uToken } from '../../currencies';
import { Denom, HumanAddr } from '../common';

export interface Pool {
  pool: {};
}

export interface PoolResponse<T extends uToken> {
  total_share: string;
  assets: [
    {
      amount: T;
      info: {
        token: {
          contract_addr: HumanAddr;
        };
      };
    },
    {
      amount: T;
      info: {
        native_token: {
          denom: Denom;
        };
      };
    },
  ];
}
