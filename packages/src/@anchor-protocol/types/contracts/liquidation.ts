import { uUST } from '../currencies';
import { Num, Rate } from '../units';
import { CW20Addr, HumanAddr, StableDenom } from './common';

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
      amount: uUST;
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
      stable_denom: StableDenom;
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
        borrow_amount: uUST;
        borrow_limit: uUST;
        collaterals: [
          [CW20Addr, uUST], // (Cw20 contract address, Locked amount)
          [CW20Addr, uUST],
        ];
        collateral_prices: [
          uUST, // Price of collateral
          uUST,
        ];
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/liquidations/liquidation-contract#liquidationamountresponse
     */
    export interface LiquidationAmountResponse {
      collaterals: Array<[CW20Addr, uUST]>;
    }
  }
}
