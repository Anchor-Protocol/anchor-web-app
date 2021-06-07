import { useWallet } from '@terra-money/wallet-provider';

export function useMaxSpread(): number {
  const { network } = useWallet();

  return network.name === 'mainnet' ? 0.1 : 0.99;
}
