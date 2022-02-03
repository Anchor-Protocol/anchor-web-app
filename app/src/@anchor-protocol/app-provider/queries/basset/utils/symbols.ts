import { BAssetInfo } from '@anchor-protocol/app-fns';
import { CW20TokenDisplayInfo } from '@libs/app-fns';

type TokenDisplayInfoByAddr = { [tokenAddr: string]: CW20TokenDisplayInfo };
export type TokenDisplay = {
  tokenDisplay: {
    anchor: CW20TokenDisplayInfo;
    wormhole: CW20TokenDisplayInfo;
  };
};

export const addTokenDisplay = <T extends BAssetInfo>(
  bAssetInfo: T,
  tokenDisplayInfoByAddr: TokenDisplayInfoByAddr,
): T & TokenDisplay => ({
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
