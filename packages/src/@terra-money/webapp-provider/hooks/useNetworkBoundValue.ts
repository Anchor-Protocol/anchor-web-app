import { NetworkInfo } from '@terra-dev/wallet-types';

export function useNetworkBoundValue<T>(
  network: NetworkInfo,
  values: Record<string, T>,
): T {
  return values[network.name];
}
