import {
  AddressMap,
  AddressProvider,
  AddressProviderFromJson,
} from '@anchor-protocol/anchor.js';
import { ContractAddress } from '@anchor-protocol/types';
import {
  AnchorContants,
  createAnchorContractAddress,
  DEFAULT_ADDESS_MAP,
  DEFAULT_ANCHOR_TX_CONSTANTS,
} from '@anchor-protocol/webapp-fns';
import { useWallet } from '@terra-money/wallet-provider';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';

export interface AnchorWebappProviderProps {
  children: ReactNode;
  contractAddressMaps?: Record<string, AddressMap>;
  contants?: Record<string, AnchorContants>;
}

export interface AnchorWebapp {
  contractAddressMap: AddressMap;
  addressProvider: AddressProvider;
  contractAddress: ContractAddress;
  contants: AnchorContants;
}

// @ts-ignore
const AnchorWebappContext: Context<AnchorWebapp> = createContext<AnchorWebapp>();

export function AnchorWebappProvider({
  children,
  contractAddressMaps = DEFAULT_ADDESS_MAP,
  contants = DEFAULT_ANCHOR_TX_CONSTANTS,
}: AnchorWebappProviderProps) {
  const { network } = useWallet();

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
      contractAddressMap: contractAddressMaps[network.name],
      addressProvider: addressProviders[network.name],
      contractAddress: contractAddresses[network.name],
      contants: contants[network.name],
    }),
    [
      addressProviders,
      contractAddressMaps,
      contractAddresses,
      network.name,
      contants,
    ],
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
