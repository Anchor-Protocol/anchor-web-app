import {
  AddressProvider,
  AddressProviderFromJson,
} from '@anchor-protocol/anchor.js';
import { CW20Addr, u, UST } from '@anchor-protocol/types';
import {
  AnchorConstants,
  AnchorContantsInput,
  createAnchorContractAddress,
  DEFAULT_ADDESS_MAP,
  DEFAULT_ANCHOR_INDEXER_API_ENDPOINTS,
  DEFAULT_ANCHOR_TX_CONSTANTS,
  ExpandAddressMap,
} from '@anchor-protocol/webapp-fns';
import { AnchorContractAddress } from '@anchor-protocol/webapp-provider';
import { useTerraWebapp } from '@libs/webapp-provider';
import { NetworkInfo } from '@terra-dev/wallet-types';
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
  contractAddressMaps?: (network: NetworkInfo) => ExpandAddressMap;
  constants?: (network: NetworkInfo) => AnchorContantsInput;
  indexerApiEndpoints?: (network: NetworkInfo) => string;
}

export interface AnchorWebapp {
  contractAddressMap: ExpandAddressMap;
  addressProvider: AddressProvider;
  contractAddress: AnchorContractAddress;
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

  //const { addressProviders, contractAddresses } = useMemo(() => {
  //  const keys = Object.keys(contractAddressMaps);
  //  const draftAddressProviders: Record<string, AddressProvider> = {};
  //  const draftContractAddresses: Record<string, ContractAddress> = {};
  //
  //  for (const key of keys) {
  //    draftAddressProviders[key] = new AddressProviderFromJson(
  //      contractAddressMaps[key],
  //    );
  //    draftContractAddresses[key] = createAnchorContractAddress(
  //      draftAddressProviders[key],
  //      contractAddressMaps[key],
  //    );
  //  }
  //
  //  return {
  //    addressProviders: draftAddressProviders,
  //    contractAddresses: draftContractAddresses,
  //  };
  //}, [contractAddressMaps]);

  const states = useMemo<AnchorWebapp>(() => {
    const contractAddressMap = contractAddressMaps(network);
    const addressProvider = new AddressProviderFromJson(contractAddressMap);
    const contractAddress = createAnchorContractAddress(
      addressProvider,
      contractAddressMap,
    );

    const constantsInput = constants(network);

    const fixedFee = big(constantsInput.fixedGas).mul(gasPrice.uusd).toNumber();
    const airdropFee = big(constantsInput.airdropGas)
      .mul(gasPrice.uusd)
      .toNumber();

    const calculateGasCalculated = {
      ...constantsInput,
      fixedFee: Math.floor(fixedFee) as u<UST<number>>,
      airdropFee: Math.floor(airdropFee) as u<UST<number>>,
    };

    return {
      contractAddressMap: contractAddressMaps(network),
      addressProvider,
      contractAddress,
      constants: calculateGasCalculated,
      indexerApiEndpoint: indexerApiEndpoints(network),
      bAssetsVector: [contractAddress.cw20.bEth, contractAddress.cw20.bLuna],
    };
  }, [contractAddressMaps, network, constants, gasPrice, indexerApiEndpoints]);

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
