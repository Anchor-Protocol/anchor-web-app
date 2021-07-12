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
  constants?: Record<string, AnchorContants>;
}

export interface AnchorWebapp {
  contractAddressMap: AddressMap;
  addressProvider: AddressProvider;
  contractAddress: ContractAddress;
  constants: AnchorContants;
}

const AnchorWebappContext: Context<AnchorWebapp> =
  // @ts-ignore
  createContext<AnchorWebapp>();

export function AnchorWebappProvider({
  children,
  contractAddressMaps = DEFAULT_ADDESS_MAP,
  constants = DEFAULT_ANCHOR_TX_CONSTANTS,
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
      contractAddressMap:
        contractAddressMaps[network.name] ?? contractAddressMaps['mainnet'],
      addressProvider:
        addressProviders[network.name] ?? addressProviders['mainnet'],
      contractAddress:
        contractAddresses[network.name] ?? contractAddresses['mainnet'],
      constants: constants[network.name] ?? constants['mainnet'],
    }),
    [
      addressProviders,
      contractAddressMaps,
      contractAddresses,
      network.name,
      constants,
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
