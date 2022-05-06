import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { anchorToken } from '@anchor-protocol/types';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { createQueryFn } from '@libs/react-query-utils';

interface GovConfigWasmQuery {
  config: WasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>;
}

const govConfigQuery = async (
  govContract: string,
  queryClient: QueryClient,
) => {
  const { config } = await wasmFetch<GovConfigWasmQuery>({
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
      keepPreviousData: false,
      enabled: !!govContract,
    },
  );
};
