import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import { useAnchorWebapp } from '../contexts/context';
import { useBAssetInfoListQuery } from '../queries/basset/bAssetInfoList';

export function useContractNickname(): (addr: HumanAddr | CW20Addr) => string {
  const { contractAddress: address } = useAnchorWebapp();

  const { data: bAssetInfoList = [] } = useBAssetInfoListQuery();

  return (addr: HumanAddr | CW20Addr) => {
    for (const { bAsset } of bAssetInfoList) {
      if (addr === bAsset.custody_contract) {
        return `Money Market / ${bAsset.symbol} Custody`;
      }
    }

    switch (addr) {
      case address.bluna.reward:
        return `bLUNA / Reward`;
      case address.bluna.hub:
        return `bLUNA / Hub`;
      case address.moneyMarket.market:
        return `Money Market / Market`;
      case address.bluna.custody:
        return `Money Market / bLUNA Custody`;
      //case address.moneyMarket.collaterals[CollateralType.bLuna].custody:
      //  return `Money Market / bLUNA Custody`;
      //case address.moneyMarket.collaterals[CollateralType.bEth].custody:
      //  return `Money Market / bETH Custody`;
      case address.moneyMarket.overseer:
        return `Money Market / Overseer`;
      case address.moneyMarket.oracle:
        return `Money Market / Oracle`;
      case address.moneyMarket.interestModel:
        return `Money Market / Interest Model`;
      case address.moneyMarket.distributionModel:
        return `Money Market / Distribution Model`;
      case address.liquidation.liquidationContract:
        return `Liquidation`;
      case address.anchorToken.gov:
        return `Anchor Token / Gov`;
      case address.anchorToken.staking:
        return `Anchor Token / Staking`;
      case address.anchorToken.community:
        return `Anchor Token / Community`;
      case address.anchorToken.distributor:
        return `Anchor Token / Distributor`;
      case address.terraswap.blunaLunaPair:
        return `Terraswap / bLUNA-LUNA Pair`;
      case address.terraswap.ancUstPair:
        return `Terraswap / ANC-UST Pair`;
      case address.cw20.bLuna:
        return `bLUNA`;
      case address.cw20.aUST:
        return `aUST`;
      case address.cw20.ANC:
        return `ANC`;
      case address.cw20.AncUstLP:
        return `ANC-UST-LP`;
      case address.cw20.bLunaLunaLP:
        return `bLUNA-LUNA-LP`;
      default:
        return '-';
    }
  };
}
