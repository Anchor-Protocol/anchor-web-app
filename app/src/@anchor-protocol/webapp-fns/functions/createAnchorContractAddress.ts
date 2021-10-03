import {
  AddressProvider,
  COLLATERAL_DENOMS,
  MARKET_DENOMS,
} from '@anchor-protocol/anchor.js';
import {
  CollateralInfo,
  CollateralType,
  CW20Addr,
  HumanAddr,
} from '@anchor-protocol/types';
import { AnchorContractAddress } from '@anchor-protocol/webapp-provider';
import { ExpandAddressMap } from '../types';

/** @deprecated */
export function createAnchorContractAddress(
  addressProvider: AddressProvider,
  addressMap: ExpandAddressMap,
): AnchorContractAddress {
  const bLunaCollateral: CollateralInfo = {
    type: CollateralType.bLuna,
    denom: COLLATERAL_DENOMS.UBLUNA,
    custody: addressProvider.custody(
      MARKET_DENOMS.UUSD,
      COLLATERAL_DENOMS.UBLUNA,
    ) as HumanAddr,
    token: addressProvider.bLunaToken() as CW20Addr,
  };

  const bEthCollateral: CollateralInfo = {
    type: CollateralType.bEth,
    denom: COLLATERAL_DENOMS.UBETH,
    custody: addressProvider.custody(
      MARKET_DENOMS.UUSD,
      COLLATERAL_DENOMS.UBETH,
    ) as HumanAddr,
    token: addressProvider.bEthToken() as CW20Addr,
  };

  return {
    bluna: {
      reward: addressProvider.bLunaReward() as HumanAddr,
      hub: addressProvider.bLunaHub() as HumanAddr,
      airdropRegistry: addressProvider.airdrop() as HumanAddr,
    },
    beth: {
      reward: addressProvider.bEthReward() as HumanAddr,
    },
    moneyMarket: {
      market: addressProvider.market(MARKET_DENOMS.UUSD) as HumanAddr,
      collaterals: {
        [CollateralType.bLuna]: bLunaCollateral,
        [CollateralType.bEth]: bEthCollateral,
      },
      collateralsArray: [bLunaCollateral, bEthCollateral],
      //bLunaCustody: addressProvider.custody(
      //  MARKET_DENOMS.UUSD,
      //  COLLATERAL_DENOMS.UBLUNA,
      //) as HumanAddr,
      //bEthCustody: addressProvider.custody(
      //  MARKET_DENOMS.UUSD,
      //  COLLATERAL_DENOMS.UBETH,
      //) as HumanAddr,
      overseer: addressProvider.overseer(MARKET_DENOMS.UUSD) as HumanAddr,
      oracle: addressProvider.oracle() as HumanAddr,
      interestModel: addressProvider.interest() as HumanAddr,
      distributionModel: addressMap.mmDistributionModel as HumanAddr,
    },
    liquidation: {
      liquidationContract: addressProvider.liquidation() as HumanAddr,
    },
    anchorToken: {
      gov: addressProvider.gov() as HumanAddr,
      staking: addressProvider.staking() as HumanAddr,
      community: addressProvider.community() as HumanAddr,
      distributor: addressProvider.distributor() as HumanAddr,
      investorLock: addressProvider.investorLock() as HumanAddr,
      teamLock: addressProvider.teamLock() as HumanAddr,
      collector: addressProvider.collector() as HumanAddr,
    },
    terraswap: {
      factory: addressMap.terraswapFactory as HumanAddr,
      blunaLunaPair: addressProvider.terraswapblunaLunaPair() as HumanAddr,
      ancUstPair: addressProvider.terraswapAncUstPair() as HumanAddr,
    },
    cw20: {
      bLuna: addressProvider.bLunaToken() as CW20Addr,
      bEth: addressProvider.bEthToken() as CW20Addr,
      aUST: addressProvider.aTerra(MARKET_DENOMS.UUSD) as CW20Addr,
      ANC: addressProvider.ANC() as CW20Addr,
      AncUstLP: addressProvider.terraswapAncUstLPToken() as CW20Addr,
      bLunaLunaLP: addressProvider.terraswapblunaLunaLPToken() as CW20Addr,
    },
  };
}
