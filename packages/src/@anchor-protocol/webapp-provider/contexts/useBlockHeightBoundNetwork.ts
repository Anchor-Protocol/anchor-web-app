import { NetworkInfo } from '@terra-dev/wallet-types';

export interface BlockHeightBoundNetwork {
  network: NetworkInfo;
  blockHeight: number;
  refetchBlockHeight: () => Promise<number>;
}

export function useBlockHeightBoundNetwork(): BlockHeightBoundNetwork {
  throw new Error('Not implemented');
}
