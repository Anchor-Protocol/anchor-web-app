import { NetworkMoniker } from '@anchor-protocol/types';

export const getNetworkMoniker = (chainId: string): NetworkMoniker => {
  if (chainId.startsWith('local')) {
    return NetworkMoniker.Local;
  } else if (chainId.startsWith('bombay')) {
    return NetworkMoniker.Testnet;
  }

  return NetworkMoniker.Mainnet;
};
