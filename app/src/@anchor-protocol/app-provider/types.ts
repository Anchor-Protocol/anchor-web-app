import { Gas } from '@anchor-protocol/types';
import { AppConstants, AppContractAddress } from '@libs/app-provider';
import { CW20Addr, HumanAddr } from '@libs/types';

export interface AnchorContractAddress extends AppContractAddress {
  bluna: {
    /** addressProvider.bLunaReward() */
    reward: HumanAddr;
    /** addressProvider.bLunaHub() */
    hub: HumanAddr;
    /** addressProvider.airdrop() */
    airdropRegistry: HumanAddr;
    /** addressProvider.bLunaValidatorsRegistry() */
    validatorsRegistry: HumanAddr;
    /** addressProvider.custody() */
    custody: HumanAddr;
  };
  //beth: {
  //  /** addressProvider.bEthReward() */
  //  reward: HumanAddr;
  //};
  moneyMarket: {
    /** addressProvider.market() */
    market: HumanAddr;

    //collaterals: Record<CollateralType, CollateralInfo>;
    //collateralsArray: CollateralInfo[];

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
  astroport: {
    generator: HumanAddr;
  };
  cw20: {
    /** addressProvider.bLunaToken() */
    bLuna: CW20Addr;

    ///** addressProvider.bEthToken() */
    //bEth: CW20Addr;

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

export interface AnchorConstants extends AppConstants {
  airdropGasWanted: Gas;
  airdropGas: Gas;
  bondGasWanted: Gas;
  astroportGasWanted: Gas;
}
