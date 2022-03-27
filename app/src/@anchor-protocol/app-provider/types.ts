import { Gas } from '@anchor-protocol/types';
import { AppConstants, AppContractAddress } from '@libs/app-provider';
import { CW20Addr, HumanAddr } from '@libs/types';

export interface AnchorContractAddress extends AppContractAddress {
  bluna: {
    reward: HumanAddr;
    hub: HumanAddr;
    airdropRegistry: HumanAddr;
    validatorsRegistry: HumanAddr;
    custody: HumanAddr;
  };
  crossAnchor: {
    core: HumanAddr;
  };
  moneyMarket: {
    market: HumanAddr;
    overseer: HumanAddr;
    oracle: HumanAddr;
    interestModel: HumanAddr;
    distributionModel: HumanAddr;
  };
  liquidation: {
    liquidationContract: HumanAddr;
    liquidationQueueContract: HumanAddr;
  };
  anchorToken: {
    gov: HumanAddr;
    staking: HumanAddr;
    community: HumanAddr;
    distributor: HumanAddr;
    investorLock: HumanAddr;
    teamLock: HumanAddr;
    collector: HumanAddr;
    vesting: HumanAddr;
  };
  terraswap: {
    factory: HumanAddr;
    blunaLunaPair: HumanAddr;
    ancUstPair: HumanAddr;
  };
  astroport: {
    generator: HumanAddr;
  };
  cw20: {
    bLuna: CW20Addr;
    aUST: CW20Addr;
    ANC: CW20Addr;
    AncUstLP: CW20Addr;
    bLunaLunaLP: CW20Addr;
  };
}

export interface AnchorConstants extends AppConstants {
  airdropGasWanted: Gas;
  airdropGas: Gas;
  bondGasWanted: Gas;
  astroportGasWanted: Gas;
}
