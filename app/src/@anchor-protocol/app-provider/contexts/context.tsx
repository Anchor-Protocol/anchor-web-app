import { App, useApp } from '@libs/app-provider';
import { NetworkInfo } from '@terra-money/use-wallet';
import React, {
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { useNetwork } from '..';
import { AnchorConstants, AnchorContractAddress } from '../types';

export interface AnchorWebappProviderProps {
  children: ReactNode;
  indexerApiEndpoints: (network: NetworkInfo) => string;
}

export interface AnchorWebapp {
  //bAssetsVector: CW20Addr[];
  indexerApiEndpoint: string;
}

const AnchorWebappContext: Context<AnchorWebapp> =
  // @ts-ignore
  createContext<AnchorWebapp>();

export function AnchorWebappProvider({
  children,
  indexerApiEndpoints,
}: AnchorWebappProviderProps) {
  const { network } = useNetwork();

  //const { contractAddress } = useApp<AnchorContractAddress>();

  const states = useMemo<AnchorWebapp>(() => {
    return {
      indexerApiEndpoint: indexerApiEndpoints(network),
      //bAssetsVector: [contractAddress.cw20.bEth, contractAddress.cw20.bLuna],
    };
  }, [indexerApiEndpoints, network]);

  return (
    <AnchorWebappContext.Provider value={states}>
      {children}
    </AnchorWebappContext.Provider>
  );
}

export function useAnchorWebapp(): App<AnchorContractAddress, AnchorConstants> &
  AnchorWebapp {
  const app = useApp<AnchorContractAddress, AnchorConstants>();
  const anchorApp = useContext(AnchorWebappContext);

  return useMemo(() => {
    return {
      ...app,
      ...anchorApp,
    };
  }, [anchorApp, app]);
}
