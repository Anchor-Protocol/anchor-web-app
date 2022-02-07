import { BAssetInfo } from '@anchor-protocol/app-fns';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import { TokenDisplayInfoByAddr } from '../../utils/tokenDisplay';

export type BAssetInfoTokenDisplay = {
  tokenDisplay: {
    anchor: CW20TokenDisplayInfo;
    wormhole: CW20TokenDisplayInfo;
  };
};

export type BAssetInfoWithDisplay = BAssetInfo & BAssetInfoTokenDisplay;

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
