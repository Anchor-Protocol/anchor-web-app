import { AddressProvider } from '@anchor-protocol/anchor.js';

export const createContractMsg = <Fabricator extends (...args: any[]) => any>(
  addressProvider: AddressProvider,
) => (fn: ReturnType<Fabricator>) => fn(addressProvider);
