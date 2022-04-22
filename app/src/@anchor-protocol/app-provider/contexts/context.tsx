import { NetworkMoniker } from '@anchor-protocol/types';
import { App, useApp } from '@libs/app-provider';
import React, {
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { useNetwork } from '..';
import { AnchorConstants } from '../types';

export interface AnchorWebappProviderProps {
  children: ReactNode;
  indexerApiEndpoints: (network: NetworkMoniker) => string;
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
  const { moniker } = useNetwork();

  //const { contractAddress } = useApp<AnchorContractAddress>();

  const states = useMemo<AnchorWebapp>(() => {
    return {
      indexerApiEndpoint: indexerApiEndpoints(moniker),
      //bAssetsVector: [contractAddress.cw20.bEth, contractAddress.cw20.bLuna],
    };
  }, [indexerApiEndpoints, moniker]);

  return (
    <AnchorWebappContext.Provider value={states}>
      {children}
    </AnchorWebappContext.Provider>
  );
}

export function useAnchorWebapp(): App<AnchorConstants> & AnchorWebapp {
  const app = useApp<AnchorConstants>();
  const anchorApp = useContext(AnchorWebappContext);

  return useMemo(() => {
    return {
      ...app,
      ...anchorApp,
    };
  }, [anchorApp, app]);
}
