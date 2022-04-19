import { AnchorNetwork } from '@anchor-protocol/types';

export const getAnchorNetwork = (chainId: string): AnchorNetwork => {
  if (chainId.startsWith('local')) {
    return AnchorNetwork.Local;
  } else if (chainId.startsWith('bombay')) {
    return AnchorNetwork.Test;
  }

  return AnchorNetwork.Main;
};
