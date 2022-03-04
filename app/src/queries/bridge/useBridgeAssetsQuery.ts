import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
  useDeploymentTarget,
  useNetwork,
} from '@anchor-protocol/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import {
  BridgeAssets,
  bridgeAssetsQuery,
  WhiltelistCollateral,
} from './bridgeAssetsQuery';

const queryFn = createQueryFn(bridgeAssetsQuery);

export function useBridgeAssetsQuery(
  whitelist: WhiltelistCollateral[] | undefined,
): UseQueryResult<BridgeAssets | undefined> {
  const { target } = useDeploymentTarget();

  const { network } = useNetwork();

  const { queryErrorReporter } = useAnchorWebapp();

  const bridgeAssets = useQuery(
    [ANCHOR_QUERY_KEY.BRIDGE_ASSETS, whitelist, target, network],
    queryFn,
    {
      keepPreviousData: false,
      onError: queryErrorReporter,
    },
  );

  return bridgeAssets;
}
