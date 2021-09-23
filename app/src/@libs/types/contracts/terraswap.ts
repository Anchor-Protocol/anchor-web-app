import {
  CW20Addr,
  HumanAddr,
  LP,
  LPAddr,
  NativeDenom,
  Rate,
  rs,
  Token,
  u,
  UST,
} from '@libs/types';

export namespace terraswap {
  export type CW20AssetInfo = { token: { contract_addr: CW20Addr } };
  export type NativeAssetInfo = { native_token: { denom: NativeDenom } };

  export type AssetInfo = CW20AssetInfo | NativeAssetInfo;

  export type CW20Asset<T extends Token> = {
    amount: u<T>;
    info: CW20AssetInfo;
  };
  export type NativeAsset<T extends Token> = {
    amount: u<T>;
    info: NativeAssetInfo;
  };

  export type Asset<T extends Token> = CW20Asset<T> | NativeAsset<T>;

  export namespace factory {
    export interface Pair {
      pair: {
        asset_infos: [AssetInfo, AssetInfo];
      };
    }

    export interface PairResponse {
      asset_infos: [AssetInfo, AssetInfo];

      /** Pair contract address */
      contract_addr: HumanAddr;

      /** LP contract address (not lp minter cw20 token) */
      liquidity_token: LPAddr;
    }
  }

  export namespace pair {
    // ---------------------------------------------
    // HandleMsg
    // ---------------------------------------------
    export interface ProvideLiquidity<A extends Token, B extends Token> {
      provide_liquidity: {
        assets: [Asset<A>, Asset<B>];
        slippage_tolerance?: Rate<rs.Decimal>;
        receiver?: HumanAddr;
      };
    }

    export interface Swap<T extends Token> {
      swap: {
        offer_asset: Asset<T>;
        belief_price?: UST<rs.Decimal>;
        max_spread?: Rate<rs.Decimal>;
        to?: HumanAddr;
      };
    }

    // ---------------------------------------------
    // CW20HookMsg
    // ---------------------------------------------
    export interface SwapHook {
      swap: {
        belief_price?: UST<rs.Decimal>;
        max_spread?: Rate<rs.Decimal>;
        to?: HumanAddr;
      };
    }

    // ---------------------------------------------
    // QueryMsg
    // ---------------------------------------------
    export interface Pool {
      pool: {};
    }

    export interface PoolResponse<A extends Token, B extends Token> {
      // FIXME set token type to total_share
      total_share: u<LP<rs.Uint128>>;
      assets: [Asset<A | B>, Asset<A | B>];
    }

    export interface Simulation<T extends Token> {
      simulation: {
        offer_asset: {
          info: AssetInfo;
          amount: u<T>;
        };
      };
    }

    export interface SimulationResponse<T extends Token, RT extends Token = T> {
      commission_amount: u<T>;
      return_amount: u<RT>;
      spread_amount: u<T>;
    }

    export interface ReverseSimulation<T extends Token> {
      reverse_simulation: {
        ask_asset: {
          info: AssetInfo;
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
}
