import { CW20Addr, HumanAddr } from '@libs/types';
import { ContractAddressMap } from 'env';

export const getAnchorContractAddress = (addressMap: ContractAddressMap) => ({
  bluna: {
    reward: addressMap.bLunaReward as HumanAddr,
    hub: addressMap.bLunaHub as HumanAddr,
    airdropRegistry: addressMap.anchorAirdropRegistry as HumanAddr,
    validatorsRegistry: addressMap.bLunaValidatorsRegistry as HumanAddr,
    custody: addressMap.mmCustody as HumanAddr,
  },
  moneyMarket: {
    market: addressMap.moneymarketMarket as HumanAddr,
    overseer: addressMap.moneymarketOverseer as HumanAddr,
    oracle: addressMap.moneymarketOracle as HumanAddr,
    interestModel: addressMap.moneymarketInterestModel as HumanAddr,
    distributionModel: addressMap.moneymarketDistributionModel as HumanAddr,
  },
  liquidation: {
    liquidationContract: addressMap.moneymarketLiquidation as HumanAddr,
    liquidationQueueContract: addressMap.mmLiquidationQueue as HumanAddr,
  },
  anchorToken: {
    gov: addressMap.anchorGov as HumanAddr,
    staking: addressMap.anchorStaking as HumanAddr,
    community: addressMap.anchorCommunity as HumanAddr,
    distributor: addressMap.anchorDistributor as HumanAddr,
    investorLock: addressMap.investor_vesting as HumanAddr,
    teamLock: addressMap.team_vesting as HumanAddr,
    collector: addressMap.anchorCollector as HumanAddr,
    vesting: addressMap.anchorVesting as HumanAddr,
  },
  terraswap: {
    factory: addressMap.terraswapFactory as HumanAddr,
    blunaLunaPair: addressMap.bLunaLunaPair as HumanAddr,
  },
  astroport: {
    generator: addressMap.astroportGenerator as HumanAddr,
    astroUstPair: addressMap.astroUstPair as HumanAddr,
    ancUstPair: addressMap.ancUstPair as HumanAddr,
  },
  cw20: {
    bLuna: addressMap.bLunaToken as CW20Addr,
    aUST: addressMap.aTerra as CW20Addr,
    ANC: addressMap.anchorToken as CW20Addr,
    AncUstLP: addressMap.anchorLpToken as CW20Addr,
    bLunaLunaLP: addressMap.bLunaLunaLPToken as CW20Addr,
  },
  crossAnchor: {
    core: '' as HumanAddr,
  },
});
