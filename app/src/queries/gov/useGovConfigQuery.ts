import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { anchorToken } from '@anchor-protocol/types';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { createQueryFn } from '@libs/react-query-utils';

interface govConfigWasmQuery {
  config: WasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>;
}

const govConfigQuery = async (
  govContract: string,
  queryClient: QueryClient,
) => {
  const { config } = await wasmFetch<govConfigWasmQuery>({
    ...queryClient,
    id: 'gov-config',
    wasmQuery: {
      config: {
        contractAddress: govContract,
        query: { config: {} },
      },
    },
  });

  return config;
};

const govConfigQueryFn = createQueryFn(govConfigQuery);

export const useGovConfigQuery = () => {
  const { queryClient, contractAddress } = useAnchorWebapp();

  const govContract = contractAddress.anchorToken.gov;

  return useAnchorQuery(
    [ANCHOR_QUERY_KEY.GOV_CONFIG, govContract, queryClient],
    govConfigQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled: !!govContract,
    },
  );
};
