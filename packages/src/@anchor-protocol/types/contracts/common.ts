import { NominalType } from '../common';

export type HumanAddr = string & NominalType<'HumanAddr'>;
export type CanonicalAddr = string & NominalType<'CanonicalAddr'>;
export type CW20Addr = string & NominalType<'CW20Addr'>;

export type StableDenom = string & NominalType<'StableDenom'>;
export type bAssetDenom = string & NominalType<'bAssetDenom'>;
export type AssetDenom = string & NominalType<'AssetDenom'>;
export type Denom = StableDenom | bAssetDenom | AssetDenom;

export type Base64EncodedJson = string & NominalType<'Base64EncodedJson'>;

export type WASMContractResult<T extends {} = {}> = {
  Result: string;
} & T;

export interface ContractAddress {
  bluna: {
    /** addressProvider.blunaReward() */
    reward: HumanAddr;
    /** addressProvider.blunaHub() */
    hub: HumanAddr;
  };
  moneyMarket: {
    /** addressProvider.market() */
    market: HumanAddr;
    /** addressProvider.custody() */
    custody: HumanAddr;
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
    /** addressProvider.faucet() */
    distributor: HumanAddr;

    investorLock: HumanAddr;
    teamLock: HumanAddr;
  };
  terraswap: {
    /** addressProvider.terraswapblunaLunaPair() */
    blunaLunaPair: HumanAddr;
    /** addressProvider.terraswapbAncUstPair() */
    ancUstPair: HumanAddr;
  };
  cw20: {
    /** addressProvider.blunaToken() */
    bLuna: CW20Addr;
    /** addressProvider.aTerra() */
    aUST: CW20Addr;
    /** addressProvider.ANC() */
    ANC: CW20Addr;
    /** addressProvider.terraswapbAncUstLPToken() */
    AncUstLP: CW20Addr;
    /** addressProvider.terraswapblunaLunaLPToken() */
    bLunaLunaLP: CW20Addr;
  };
  airdrop: HumanAddr;
}
