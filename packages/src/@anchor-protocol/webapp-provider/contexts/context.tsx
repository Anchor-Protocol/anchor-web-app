import {
  AddressMap,
  AddressProvider,
  AddressProviderFromJson,
} from '@anchor-protocol/anchor.js';
import { ContractAddress } from '@anchor-protocol/types';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { DEFAULT_ADDESS_MAP } from '../env';
import { createAnchorContractAddress } from '../functions/createAnchorContractAddress';

export interface AnchorWebappProviderProps {
  children: ReactNode;
  contractAddressMaps?: Record<string, AddressMap>;
}

export interface AnchorWebapp {
  contractAddressMaps: Record<string, AddressMap>;
  addressProviders: Record<string, AddressProvider>;
  contractAddresses: Record<string, ContractAddress>;
}

// @ts-ignore
const AnchorWebappContext: Context<AnchorWebapp> = createContext<AnchorWebapp>();

export function AnchorWebappProvider({
  children,
  contractAddressMaps = DEFAULT_ADDESS_MAP,
}: AnchorWebappProviderProps) {
  const { addressProviders, contractAddresses } = useMemo(() => {
    const keys = Object.keys(contractAddressMaps);
    const draftAddressProviders: Record<string, AddressProvider> = {};
    const draftContractAddresses: Record<string, ContractAddress> = {};

    for (const key of keys) {
      draftAddressProviders[key] = new AddressProviderFromJson(
        contractAddressMaps[key],
      );
      draftContractAddresses[key] = createAnchorContractAddress(
        draftAddressProviders[key],
        contractAddressMaps[key],
      );
    }

    return {
      addressProviders: draftAddressProviders,
      contractAddresses: draftContractAddresses,
    };
  }, [contractAddressMaps]);

  const states = useMemo<AnchorWebapp>(
    () => ({
      contractAddressMaps,
      addressProviders,
      contractAddresses,
    }),
    [addressProviders, contractAddressMaps, contractAddresses],
  );

  return (
    <AnchorWebappContext.Provider value={states}>
      {children}
    </AnchorWebappContext.Provider>
  );
}

export function useAnchorWebapp(): AnchorWebapp {
  return useContext(AnchorWebappContext);
}

export const AnchorWebappConsumer: Consumer<AnchorWebapp> =
  AnchorWebappContext.Consumer;
