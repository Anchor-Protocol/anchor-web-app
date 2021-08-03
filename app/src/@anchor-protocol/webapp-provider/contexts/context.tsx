import {
  AddressProvider,
  AddressProviderFromJson,
} from '@anchor-protocol/anchor.js';
import { ContractAddress, CW20Addr } from '@anchor-protocol/types';
import {
  AnchorContants,
  createAnchorContractAddress,
  DEFAULT_ADDESS_MAP,
  DEFAULT_ANCHOR_INDEXER_API_ENDPOINTS,
  DEFAULT_ANCHOR_TX_CONSTANTS,
  ExpandAddressMap,
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
  contractAddressMaps?: Record<string, ExpandAddressMap>;
  constants?: Record<string, AnchorContants>;
  indexerApiEndpoints?: Record<string, string>;
}

export interface AnchorWebapp {
  contractAddressMap: ExpandAddressMap;
  addressProvider: AddressProvider;
  contractAddress: ContractAddress;
  constants: AnchorContants;
  bAssetsVector: CW20Addr[];
  indexerApiEndpoint: string;
}

const AnchorWebappContext: Context<AnchorWebapp> =
  // @ts-ignore
  createContext<AnchorWebapp>();

export function AnchorWebappProvider({
  children,
  contractAddressMaps = DEFAULT_ADDESS_MAP,
  constants = DEFAULT_ANCHOR_TX_CONSTANTS,
  indexerApiEndpoints = DEFAULT_ANCHOR_INDEXER_API_ENDPOINTS,
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

  const states = useMemo<AnchorWebapp>(() => {
    const contractAddress =
      contractAddresses[network.name] ?? contractAddresses['mainnet'];

    return {
      contractAddressMap:
        contractAddressMaps[network.name] ?? contractAddressMaps['mainnet'],
      addressProvider:
        addressProviders[network.name] ?? addressProviders['mainnet'],
      contractAddress,
      constants: constants[network.name] ?? constants['mainnet'],
      indexerApiEndpoint:
        indexerApiEndpoints[network.name] ?? indexerApiEndpoints['mainnet'],
      bAssetsVector: [contractAddress.cw20.bEth, contractAddress.cw20.bLuna],
    };
  }, [
    contractAddresses,
    network.name,
    contractAddressMaps,
    addressProviders,
    constants,
    indexerApiEndpoints,
  ]);

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
