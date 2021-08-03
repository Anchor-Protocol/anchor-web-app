import { uToken } from '../currencies';
import { CW20Addr, Denom, HumanAddr, StableDenom } from './common';

export namespace terraswap {
  export type CW20AssetInfo = { token: { contract_addr: CW20Addr } };
  export type NativeAssetInfo = { native_token: { denom: StableDenom } };

  export type AssetInfo = CW20AssetInfo | NativeAssetInfo;

  export interface Pair {
    pair: {
      asset_infos: [AssetInfo, AssetInfo];
    };
  }

  export interface PairResponse {
    asset_infos: [AssetInfo, AssetInfo];

    /** Pair contract address */
    contract_addr: HumanAddr;

    /** LP contract address */
    liquidity_token: CW20Addr;
  }

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

  export interface SimulationResponse<T extends uToken, RT extends uToken = T> {
    commission_amount: T;
    return_amount: RT;
    spread_amount: T;
  }

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

  export interface ReverseSimulationResponse<
    T extends uToken,
    RT extends uToken = T,
  > {
    commission_amount: T;
    offer_amount: RT;
    spread_amount: T;
  }
}
