import { CW20Addr, Denom, HumanAddr, NativeDenom, Token, u } from '@libs/types';

export namespace terraswap {
  export type CW20AssetInfo = { token: { contract_addr: CW20Addr } };
  export type NativeAssetInfo = { native_token: { denom: NativeDenom } };

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

  export interface PoolResponse<T extends Token> {
    total_share: string;
    assets: [
      {
        amount: u<T>;
        info: {
          token: {
            contract_addr: HumanAddr;
          };
        };
      },
      {
        amount: u<T>;
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

  export interface Simulation<T extends Token> {
    simulation: {
      offer_asset: {
        info: SimulationInfo;
        amount: u<T>;
      };
    };
  }

  export interface SimulationResponse<T extends Token, RT extends Token = T> {
    commission_amount: u<T>;
    return_amount: u<RT>;
    spread_amount: u<T>;
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

  export interface ReverseSimulation<T extends Token> {
    reverse_simulation: {
      ask_asset: {
        info: ReverseSimulationInfo;
        amount: u<T>;
      };
    };
  }

  export interface ReverseSimulationResponse<
    T extends Token,
    RT extends Token = T,
  > {
    commission_amount: u<T>;
    offer_amount: u<RT>;
    spread_amount: u<T>;
  }
}
