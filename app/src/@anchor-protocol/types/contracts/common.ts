import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import { NominalType } from '../common';

export type HumanAddr = string & NominalType<'HumanAddr'>;
export type CanonicalAddr = string & NominalType<'CanonicalAddr'>;
export type CW20Addr = string & NominalType<'CW20Addr'>;

export type StableDenom = string & NominalType<'StableDenom'>;
export type bAssetDenom = string & NominalType<'bAssetDenom'>;
export type AssetDenom = string & NominalType<'AssetDenom'>;
export type Denom = StableDenom | bAssetDenom | AssetDenom;

export type Base64EncodedJson = string & NominalType<'Base64EncodedJson'>;

export enum CollateralType {
  bLuna = 'bLuna',
  bEth = 'bEth',
}

export interface CollateralInfo {
  type: CollateralType;
  denom: COLLATERAL_DENOMS;
  custody: HumanAddr;
  token: CW20Addr;
}

export type WASMContractResult<T extends {} = {}> = {
  Result: string;
} & T;

export interface ContractAddress {
  bluna: {
    /** addressProvider.bLunaReward() */
    reward: HumanAddr;
    /** addressProvider.bLunaHub() */
    hub: HumanAddr;
    /** addressProvider.airdrop() */
    airdropRegistry: HumanAddr;
  };
  beth: {
    /** addressProvider.bEthReward() */
    reward: HumanAddr;
  };
  moneyMarket: {
    /** addressProvider.market() */
    market: HumanAddr;

    collaterals: Record<CollateralType, CollateralInfo>;
    collateralsArray: CollateralInfo[];
    ///** addressProvider.custody() */
    //bLunaCustody: HumanAddr;
    ///** addressProvider.custody() */
    //bEthCustody: HumanAddr;
    /** addressProvider.overseer() */
    overseer: HumanAddr;
    /** addressProvider.oracle() */
    oracle: HumanAddr;
    /** addressProvider.interest() */
    interestModel: HumanAddr;

    distributionModel: HumanAddr;
  };
  liquidation: {
    /** addressProvider.liquidation() */
    liquidationContract: HumanAddr;
  };
  anchorToken: {
    /** addressProvider.gov() */
    gov: HumanAddr;
    /** addressProvider.staking() */
    staking: HumanAddr;
    /** addressProvider.community() */
    community: HumanAddr;
    /** addressProvider.distributor() */
    distributor: HumanAddr;
    /** addressProvider.investorLock() */
    investorLock: HumanAddr;
    /** addressProvider.teamLock() */
    teamLock: HumanAddr;
    /** addressProvider.collector() */
    collector: HumanAddr;
  };
  terraswap: {
    factory: HumanAddr;
    /** addressProvider.terraswapblunaLunaPair() */
    blunaLunaPair: HumanAddr;
    /** addressProvider.terraswapbAncUstPair() */
    ancUstPair: HumanAddr;
  };
  cw20: {
    /** addressProvider.bLunaToken() */
    bLuna: CW20Addr;
    /** addressProvider.bEthToken() */
    bEth: CW20Addr;
    /** addressProvider.aTerra() */
    aUST: CW20Addr;
    /** addressProvider.ANC() */
    ANC: CW20Addr;
    /** addressProvider.terraswapbAncUstLPToken() */
    AncUstLP: CW20Addr;
    /** addressProvider.terraswapblunaLunaLPToken() */
    bLunaLunaLP: CW20Addr;
  };
}
