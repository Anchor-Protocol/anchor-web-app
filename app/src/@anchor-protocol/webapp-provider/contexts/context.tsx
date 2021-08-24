import {
  AddressProvider,
  AddressProviderFromJson,
} from '@anchor-protocol/anchor.js';
import { ContractAddress, CW20Addr, u, UST } from '@anchor-protocol/types';
import {
  AnchorConstants,
  AnchorContantsInput,
  createAnchorContractAddress,
  DEFAULT_ADDESS_MAP,
  DEFAULT_ANCHOR_INDEXER_API_ENDPOINTS,
  DEFAULT_ANCHOR_TX_CONSTANTS,
  ExpandAddressMap,
} from '@anchor-protocol/webapp-fns';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
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
  constants?: Record<string, AnchorContantsInput>;
  indexerApiEndpoints?: Record<string, string>;
}

export interface AnchorWebapp {
  contractAddressMap: ExpandAddressMap;
  addressProvider: AddressProvider;
  contractAddress: ContractAddress;
  constants: AnchorConstants;
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

  const { gasPrice } = useTerraWebapp();

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

    const constantsInput = constants[network.name] ?? constants['mainnet'];
    const calculateGasCalculated = {
      ...constantsInput,
      fixedGas: Math.floor(
        big(constantsInput.fixedGasGas).mul(gasPrice.uusd).toNumber(),
      ) as u<UST<number>>,
      airdropGas: Math.floor(
        big(constantsInput.airdropGasGas).mul(gasPrice.uusd).toNumber(),
      ) as u<UST<number>>,
    };

    return {
      contractAddressMap:
        contractAddressMaps[network.name] ?? contractAddressMaps['mainnet'],
      addressProvider:
        addressProviders[network.name] ?? addressProviders['mainnet'],
      contractAddress,
      constants: calculateGasCalculated,
      indexerApiEndpoint:
        indexerApiEndpoints[network.name] ?? indexerApiEndpoints['mainnet'],
      bAssetsVector: [contractAddress.cw20.bEth, contractAddress.cw20.bLuna],
    };
  }, [
    contractAddresses,
    network.name,
    constants,
    gasPrice.uusd,
    contractAddressMaps,
    addressProviders,
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
