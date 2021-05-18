import { AddressMap, AddressProvider } from '@anchor-protocol/anchor.js';
import { ContractAddress } from '@anchor-protocol/types';
import { NetworkInfo } from '@terra-dev/wallet-types';
import { useAnchorWebapp } from './context';

export function useAnchorAddressMap(network: NetworkInfo): AddressMap {
  const { contractAddressMaps } = useAnchorWebapp();
  return contractAddressMaps[network.name];
}

export function useAnchorAddressProvider(
  network: NetworkInfo,
): AddressProvider {
  const { addressProviders } = useAnchorWebapp();
  return addressProviders[network.name];
}

export function useAnchorContractAddress(
  network: NetworkInfo,
): ContractAddress {
  const { contractAddresses } = useAnchorWebapp();
  return contractAddresses[network.name];
}
