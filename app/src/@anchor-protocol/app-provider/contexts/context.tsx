import { AnchorNetwork } from '@anchor-protocol/types';
import { App, useApp } from '@libs/app-provider';
import React, {
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { getAnchorNetwork } from 'utils/getAnchorNetwork';
import { useNetwork } from '..';
import { AnchorConstants } from '../types';

export interface AnchorWebappProviderProps {
  children: ReactNode;
  indexerApiEndpoints: (network: AnchorNetwork) => string;
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
  const anchorNetwork = getAnchorNetwork(network.chainID);

  //const { contractAddress } = useApp<AnchorContractAddress>();

  const states = useMemo<AnchorWebapp>(() => {
    return {
      indexerApiEndpoint: indexerApiEndpoints(anchorNetwork),
      //bAssetsVector: [contractAddress.cw20.bEth, contractAddress.cw20.bLuna],
    };
  }, [indexerApiEndpoints, anchorNetwork]);

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
