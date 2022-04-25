import { CW20Addr, HumanAddr } from '@libs/types';
import { ContractAddressMap } from 'env';
import { AnchorContractAddress } from '..';

export const getAnchorContractAddress = (
  addressMap: ContractAddressMap,
): AnchorContractAddress => ({
  bluna: {
    reward: addressMap.bLunaReward as HumanAddr,
    hub: addressMap.bLunaHub as HumanAddr,
    airdropRegistry: addressMap.airdrop as HumanAddr,
    validatorsRegistry: addressMap.bLunaValidatorsRegistry as HumanAddr,
    custody: addressMap.mmCustody as HumanAddr,
  },
  moneyMarket: {
    market: addressMap.mmMarket as HumanAddr,
    overseer: addressMap.mmOverseer as HumanAddr,
    oracle: addressMap.mmOracle as HumanAddr,
    interestModel: addressMap.mmInterestModel as HumanAddr,
    distributionModel: addressMap.mmDistributionModel as HumanAddr,
  },
  liquidation: {
    liquidationContract: addressMap.mmLiquidation as HumanAddr,
    liquidationQueueContract: addressMap.mmLiquidationQueue as HumanAddr,
  },
  anchorToken: {
    gov: addressMap.gov as HumanAddr,
    staking: addressMap.staking as HumanAddr,
    community: addressMap.community as HumanAddr,
    distributor: addressMap.distributor as HumanAddr,
    investorLock: addressMap.investor_vesting as HumanAddr,
    teamLock: addressMap.team_vesting as HumanAddr,
    collector: addressMap.collector as HumanAddr,
    vesting: addressMap.vesting as HumanAddr,
    votingEscrow: addressMap.anchorVotingEscrow as HumanAddr,
    gaugeController: addressMap.anchorGaugeController as HumanAddr,
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
    ANC: addressMap.ANC as CW20Addr,
    AncUstLP: addressMap.ancUstLPToken as CW20Addr,
    bLunaLunaLP: addressMap.bLunaLunaLPToken as CW20Addr,
  },
  crossAnchor: {
    core: '' as HumanAddr,
  },
});
