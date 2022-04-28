import { AnchorApiClient } from '@anchor-protocol/api';
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
  indexerApiEndpoint: string;
  apiClient: AnchorApiClient;
}

const AnchorWebappContext: Context<AnchorWebapp> =
  // @ts-ignore
  createContext<AnchorWebapp>();

export function AnchorWebappProvider({
  children,
  indexerApiEndpoints,
}: AnchorWebappProviderProps) {
  const { moniker } = useNetwork();

  const states = useMemo<AnchorWebapp>(() => {
    const endpoint = indexerApiEndpoints(moniker);
    return {
      indexerApiEndpoint: endpoint,
      apiClient: new AnchorApiClient(endpoint),
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
