import {
  CW20Addr,
  HumanAddr,
  NativeDenom,
  Num,
  Rate,
  u,
  UST,
} from '@libs/types';

export namespace liquidation {
  export namespace liquidationContract {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bid
     */
    export interface Bid {
      collateral_token: HumanAddr;
      bidder: HumanAddr;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidresponse
     */
    export interface BidResponse {
      collateral_token: HumanAddr;
      bidder: HumanAddr;
      amount: u<UST>;
      premium_rate: Rate;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidsbycollateral
     */
    export interface BidsByCollateral {
      bids_by_collateral: {
        collateral_token: HumanAddr;
        start_after?: HumanAddr;
        limit?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidsbycollateralresponse
     */
    export interface BidsByCollateralResponse {
      bids: Array<BidResponse>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidsbyuser
     */
    export interface BidsByUser {
      bids_by_user: {
        bidder: HumanAddr;
        start_after?: HumanAddr;
        limit?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#bidsbyuserresponse
     */
    export interface BidsByUserResponse {
      bids: Array<BidResponse>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#configresponse
     */
    export interface ConfigResponse {
      owner: HumanAddr;
      oracle_contract: HumanAddr;
      stable_denom: NativeDenom;
      safe_ratio: Rate;
      bid_fee: Rate;
      max_premium_rate: Rate;
      liquidation_threshold: Num;
      price_timeframe: number;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#liquidationamount
     */
    export interface LiquidationAmount {
      liquidation_amount: {
        borrow_amount: u<UST>;
        borrow_limit: u<UST>;
        collaterals: [
          [CW20Addr, u<UST>], // (Cw20 contract address, Locked amount)
          [CW20Addr, u<UST>],
        ];
        collateral_prices: [
          u<UST>, // Price of collateral
          u<UST>,
        ];
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#liquidationamountresponse
     */
    export interface LiquidationAmountResponse {
      collaterals: Array<[CW20Addr, u<UST>]>;
    }
  }
}
