import {
  bAssetDenom,
  CW20Addr,
  HumanAddr,
  NativeDenom,
  Num,
  Rate,
  u,
  UST,
} from '@libs/types';
import { ANC, aToken, bAsset } from '../currencies';

export namespace moneyMarket {
  export namespace custody {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#borrower
     */
    export interface Borrower {
      borrower: {
        address: HumanAddr;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#borrowerresponse
     */
    export interface BorrowerResponse {
      borrower: HumanAddr;
      balance: u<UST>;
      spendable: u<UST>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#borrowers
     */
    export interface Borrowers {
      borrowers: {
        start_after?: HumanAddr;
        limit?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#borrowersresponse
     */
    export interface BorrowersResponse {
      borrowers: Array<BorrowerResponse>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/custody-bluna-specific#configresponse
     */
    export interface ConfigResponse {
      owner: HumanAddr;
      collateral_token: HumanAddr;
      overseer_contract: HumanAddr;
      market_contract: HumanAddr;
      reward_contract: HumanAddr;
      liquidation_contract: HumanAddr;
      stable_denom: NativeDenom;
      basset_info: {
        name: string;
        symbol: bAssetDenom;
        decimals: number;
      };
    }
  }

  export namespace distributionModel {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/distribution-model#ancemissionrate
     */
    export interface AncEmissionRate {
      anc_emission_rate: {
        deposit_rate: Rate;
        target_deposit_rate: Rate;
        current_emission_rate: Rate;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/distribution-model#ancemissionrateresponse
     */
    export interface AncEmissionRateResponse {
      emission_rate: Rate;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/distribution-model#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/distribution-model#configresponse
     */
    export interface ConfigResponse {
      owner: HumanAddr;
      emission_cap: u<ANC>;
      emission_floor: u<ANC>;
      increment_multiplier: Rate;
      decrement_multiplier: Rate;
    }

    export interface UpdateConfig {
      update_config: {
        owner?: HumanAddr;
        emission_cap?: u<ANC>;
        emission_floor?: u<ANC>;
        increment_multiplier?: Rate;
        decrement_multiplier?: Rate;
      };
    }
  }

  export namespace interestModel {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/interest-model#borrowrate
     */
    export interface BorrowRate {
      borrow_rate: {
        market_balance: u<UST>;
        total_liabilities: u<UST>;
        total_reserves: u<UST>;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/interest-model#borrowrateresponse
     */
    export interface BorrowRateResponse {
      rate: Rate;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/interest-model#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/interest-model#configresponse
     */
    export interface ConfigResponse {
      owner: HumanAddr;
      base_rate: Rate;
      interest_multiplier: Rate;
    }

    export interface UpdateConfig {
      update_config: {
        owner?: HumanAddr;
        base_rate?: Rate;
        interest_multiplier?: Rate;
      };
    }
  }

  export namespace market {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#borrowerinfo
     */
    export interface BorrowerInfo {
      borrower_info: {
        borrower: HumanAddr;
        block_height?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#borrowerinforesponse
     */
    export interface BorrowerInfoResponse {
      borrower: HumanAddr;
      interest_index: Num;
      reward_index: Num;
      loan_amount: u<UST>;
      pending_rewards: u<ANC>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#borrowinfos
     */
    export interface BorrowerInfos {
      borrower_infos: {
        start_after?: HumanAddr;
        limit?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#borrowerinfosresponse
     */
    export interface BorrowerInfosResponse {
      borrower_infos: Array<BorrowerInfoResponse>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#configresponse
     */
    export interface ConfigResponse {
      owner_addr: HumanAddr;
      aterra_contract: HumanAddr;
      interest_model: HumanAddr;
      distribution_model: HumanAddr;
      overseer_contract: HumanAddr;
      collector_contract: HumanAddr;
      distributor_contract: HumanAddr;
      stable_denom: NativeDenom;
      reserve_factor: Rate;
      max_borrow_factor: Rate;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#epochstate
     */
    export interface EpochState {
      epoch_state: {
        block_height?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#epochstateresponse
     */
    export interface EpochStateResponse {
      exchange_rate: UST;
      aterra_supply: Num;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#state
     */
    export interface State {
      state: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/market#stateresponse
     */
    export interface StateResponse {
      total_liabilities: u<UST>;
      total_reserves: u<UST>;
      last_interest_updated: number;
      last_reward_updated: number;
      global_interest_index: Num;
      global_reward_index: Num;
      anc_emission_rate: Rate;
    }

    export interface UpdateConfig {
      update_config: {
        owner_addr?: HumanAddr;
        reserve_factor?: Rate;
        max_borrow_factor?: Rate;
        interest_model?: HumanAddr;
        distribution_model?: HumanAddr;
      };
    }
  }

  export namespace oracle {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#configresponse
     */
    export interface ConfigResponse {
      owner: HumanAddr;
      base_asset: NativeDenom;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#feeder
     */
    export interface Feeder {
      feeder: {
        asset: CW20Addr;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#feederresponse
     */
    export interface FeederResponse {
      asset: CW20Addr;
      feeder: HumanAddr;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#price
     */
    export interface Price {
      price: {
        base: CW20Addr;
        quote: NativeDenom;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#priceresponse
     */
    export interface PriceResponse {
      rate: UST;
      last_updated_base: number;
      last_updated_quote: number;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#prices
     */
    export interface Prices {
      prices: {
        start_after?: CW20Addr;
        limit?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/oracle#pricesresponse
     */
    export interface PricesResponse {
      prices: Array<{
        asset: CW20Addr;
        price: UST;
        last_updated_time: number;
      }>;
    }

    export interface RegisterFeeder {
      register_feeder: {
        asset: CW20Addr;
        feeder: HumanAddr;
      };
    }
  }

  export namespace overseer {
    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#allcollaterals
     */
    export interface AllCollaterals {
      all_collaterals: {
        start_after?: HumanAddr;
        limit?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#allcollateralsresponse
     */
    export interface AllCollateralsResponse {
      all_collaterals: Array<CollateralsResponse>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#borrowlimit
     */
    export interface BorrowLimit {
      borrow_limit: {
        borrower: HumanAddr;
        block_time?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#borrowlimitresponse
     */
    export interface BorrowLimitResponse {
      borrower: HumanAddr;
      borrow_limit: Num;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#collaterals
     */
    export interface Collaterals {
      collaterals: {
        borrower: HumanAddr;
        block_height?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#collateralsresponse
     */
    export interface CollateralsResponse {
      borrower: HumanAddr;
      collaterals: Array<[CW20Addr, u<bAsset>]>;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#config-1
     */
    export interface Config {
      config: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#configresponse
     */
    export interface ConfigResponse {
      owner_addr: HumanAddr;
      oracle_contract: HumanAddr;
      market_contract: HumanAddr;
      liquidation_contract: HumanAddr;
      collector_contract: HumanAddr;
      distribution_threshold: Rate;
      target_deposit_rate: Rate;
      buffer_distribution_rate: Rate;
      anc_purchase_factor: Rate;
      stable_denom: NativeDenom;
      epoch_period: number;
      price_timeframe: number;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#distributionparams
     */
    export interface DistributionParams {
      distribution_params: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#distributionparamsresponse
     */
    export interface DistributionParamsResponse {
      deposit_rate: Rate;
      target_deposit_rate: Rate;
      threshold_deposit_rate: Rate;
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#epochstate
     */
    export interface EpochState {
      epoch_state: {};
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#epochstateresponse
     */
    export interface EpochStateResponse {
      deposit_rate: Rate;
      prev_aterra_supply: u<aToken>;
      prev_exchange_rate: Rate;
      last_executed_height: number;
    }

    export interface UpdateConfig {
      update_config: {
        owner_addr?: HumanAddr;
        oracle_contract?: HumanAddr;
        liquidation_contract?: HumanAddr;
        threshold_deposit_rate?: Rate;
        target_deposit_rate?: Rate;
        buffer_distribution_factor?: Rate;
        anc_purchase_factor?: Rate;
        epoch_period?: number;
        price_timeframe?: number;
      };
    }

    export interface UpdateWhitelist {
      update_whitelist: {
        collateral_token: CW20Addr;
        custody_contract?: HumanAddr;
        max_ltv?: Rate;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#whitelist-1
     */
    export interface Whitelist {
      whitelist: {
        collateral_token?: CW20Addr;
        start_after?: HumanAddr;
        limit?: number;
      };
    }

    /**
     * @see https://anchor-protocol.gitbook.io/anchor-2/smart-contracts/money-market/overseer#whitelistresponse
     */
    export interface WhitelistResponse {
      elems: Array<{
        name: string;
        symbol: bAssetDenom;
        max_ltv: Rate;
        custody_contract: HumanAddr;
        collateral_token: CW20Addr;
      }>;
    }

    /**
     * @see https://docs.anchorprotocol.com/smart-contracts/money-market/overseer#whitelist
     */
    export interface RegisterWhitelist {
      whitelist: {
        name: string;
        symbol: string;
        collateral_token: CW20Addr;
        custody_contract: HumanAddr;
        max_ltv: Rate;
      };
    }
  }
}
