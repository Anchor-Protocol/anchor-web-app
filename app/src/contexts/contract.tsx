import { createContext, useContext, Context, Consumer, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AddressProvider } from '@anchor-protocol/anchor.js/address-provider';

export interface ContractProviderProps {
  children: ReactNode;
  addressProvider: AddressProvider;
}

export interface ContractState {
  addressProvider: AddressProvider;
}

// @ts-ignore
const ContractContext: Context<ContractState> = createContext<ContractState>();

export function ContractProvider({
  children,
  addressProvider,
}: ContractProviderProps) {
  const state = useMemo<ContractState>(
    () => ({
      addressProvider,
    }),
    [addressProvider],
  );

  return (
    <ContractContext.Provider value={state}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract(): ContractState {
  return useContext(ContractContext);
}

export function useAddressProvider(): AddressProvider {
  const { addressProvider } = useContext(ContractContext);
  return addressProvider;
}

export const ContractConsumer: Consumer<ContractState> =
  ContractContext.Consumer;
