import { useNetwork } from '@anchor-protocol/app-provider/contexts/network';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import { useCW20TokenDisplayInfosQuery } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { HumanAddr } from '@anchor-protocol/types';
import {
  bridgeAssetsQuery,
  useAnchorQuery,
  WhitelistCollateral,
} from 'queries';
import { UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../@anchor-protocol/app-provider/contexts/context';
import { ANCHOR_QUERY_KEY } from '../../@anchor-protocol/app-provider/env';
import { QueryClient, wasmFetch } from '@libs/query-client';
import { WhitelistWasmQuery } from './types';
import {
  DeploymentTarget,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import { NetworkInfo } from '@terra-money/wallet-provider';

const fetchWhitelistCollateral = async (
  overseerContract: HumanAddr,
  queryClient: QueryClient,
): Promise<Omit<WhitelistCollateral, 'decimals'>[]> => {
  const { whitelist } = await wasmFetch<WhitelistWasmQuery>({
    ...queryClient,
    id: `whitelist--collateral`,
    wasmQuery: {
      whitelist: {
        contractAddress: overseerContract,
        query: {
          whitelist: {},
        },
      },
    },
  });

  return whitelist.elems;
};

const mapTokenInformation = (
  whitelist: Omit<WhitelistCollateral, 'decimals'>[],
  tokenInformation: Record<string, CW20TokenDisplayInfo>,
): WhitelistCollateral[] => {
  return whitelist.map((collateral) => {
    if (collateral && tokenInformation[collateral.collateral_token]) {
      const token = tokenInformation[collateral.collateral_token];
      return {
        ...token,
        ...collateral,
        name: token.name ?? collateral.name,
        symbol: token.symbol ?? collateral.symbol,
        decimals: token.decimals ?? 6,
      };
    }
    return {
      ...collateral,
      decimals: 6,
    };
  });
};

const mapBridgedAssets = async (
  whitelist: WhitelistCollateral[],
  target: DeploymentTarget,
  network: NetworkInfo,
): Promise<WhitelistCollateral[]> => {
  const map = await bridgeAssetsQuery(whitelist, target, network);

  return whitelist.map((collateral) => {
    return {
      ...collateral,
      bridgedAddress: map?.get(collateral.collateral_token),
    };
  });
};

async function whitelistCollateralQuery(
  overseerContract: HumanAddr,
  target: DeploymentTarget,
  network: NetworkInfo,
  tokenInformation: Record<string, CW20TokenDisplayInfo> | undefined,
  queryClient: QueryClient,
): Promise<WhitelistCollateral[]> {
  const whitelist = await fetchWhitelistCollateral(
    overseerContract,
    queryClient,
  );

  return await mapBridgedAssets(
    mapTokenInformation(whitelist, tokenInformation ?? {}),
    target,
    network,
  );
}

const queryFn = createQueryFn(whitelistCollateralQuery);

export function useWhitelistCollateralQuery(): UseQueryResult<
  WhitelistCollateral[]
> {
  const { target } = useDeploymentTarget();

  const { network } = useNetwork();

  const { queryClient, contractAddress } = useAnchorWebapp();

  const { data: tokens } = useCW20TokenDisplayInfosQuery();

  const query = useAnchorQuery(
    [
      ANCHOR_QUERY_KEY.WHITELIST_COLLATERAL,
      contractAddress.moneyMarket.overseer,
      target,
      network,
      tokens && tokens[network.name],
      queryClient,
    ],
    queryFn,
    {
      refetchOnMount: false,
      keepPreviousData: true,
    },
  );

  return query;
}
