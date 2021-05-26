import { AddressProvider } from '@anchor-protocol/anchor.js';

// TODO remove after refactoring done
export const createContractMsg = <Fabricator extends (...args: any[]) => any>(
  addressProvider: AddressProvider,
) => (fn: ReturnType<Fabricator>) => fn(addressProvider);
