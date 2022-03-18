import {
  BAssetInfo,
  BAssetInfoAndBalancesTotal,
  BAssetInfoAndBalanceWithOracle,
} from '@anchor-protocol/app-fns';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import { TokenDisplayInfoByAddr } from '../../utils/tokenDisplay';

export type BAssetInfoWithDisplay = BAssetInfo & {
  tokenDisplay: {
    anchor: CW20TokenDisplayInfo;
    wormhole: CW20TokenDisplayInfo;
  };
};

export const withBAssetInfoTokenDisplay = (
  bAssetInfo: BAssetInfo,
  tokenDisplayInfoByAddr: TokenDisplayInfoByAddr,
): BAssetInfoWithDisplay => ({
  ...bAssetInfo,
  tokenDisplay: {
    anchor:
      tokenDisplayInfoByAddr[bAssetInfo.converterConfig.anchor_token_address!],
    wormhole:
      tokenDisplayInfoByAddr[
        bAssetInfo.converterConfig.wormhole_token_address!
      ],
  },
});

export type BAssetInfoAndBalanceWithOracleWithDisplay =
  BAssetInfoAndBalanceWithOracle & { tokenDisplay: CW20TokenDisplayInfo };

export type BAssetInfoAndBalancesTotalWithDisplay = Omit<
  BAssetInfoAndBalancesTotal,
  'infoAndBalances'
> & { infoAndBalances: BAssetInfoAndBalanceWithOracleWithDisplay[] };

export const withBAssetInfoAndBalanceWithOracleTokenDisplay = (
  bAssetInfo: BAssetInfoAndBalanceWithOracle,
  tokenDisplayByInfoAddr: TokenDisplayInfoByAddr,
): BAssetInfoAndBalanceWithOracleWithDisplay => ({
  ...bAssetInfo,
  tokenDisplay: tokenDisplayByInfoAddr[bAssetInfo.bAsset.collateral_token],
});

export const withBAssetInfoAndBalancesTotalTokenDisplay = (
  bAssetInfoAndBalancesTotal: BAssetInfoAndBalancesTotal,
  tokenDisplayByInfoAddr: TokenDisplayInfoByAddr,
): BAssetInfoAndBalancesTotalWithDisplay => ({
  ...bAssetInfoAndBalancesTotal,
  infoAndBalances: bAssetInfoAndBalancesTotal.infoAndBalances.map((info) =>
    withBAssetInfoAndBalanceWithOracleTokenDisplay(
      info,
      tokenDisplayByInfoAddr,
    ),
  ),
});
