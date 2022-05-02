import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { anchorToken } from '@anchor-protocol/types';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { createQueryFn } from '@libs/react-query-utils';

interface GovStateWasmQuery {
  state: WasmQuery<anchorToken.gov.State, anchorToken.gov.StateResponse>;
}

const govStateQuery = async (govContract: string, queryClient: QueryClient) => {
  const { state } = await wasmFetch<GovStateWasmQuery>({
    ...queryClient,
    id: 'gov-state',
    wasmQuery: {
      state: {
        contractAddress: govContract,
        query: { state: {} },
      },
    },
  });

  return state;
};

const govStateQueryFn = createQueryFn(govStateQuery);

export const useGovStateQuery = () => {
  const { queryClient, contractAddress } = useAnchorWebapp();

  const govContract = contractAddress.anchorToken.gov;

  return useAnchorQuery(
    [`${ANCHOR_QUERY_KEY.GOV_STATE}-2`, govContract, queryClient],
    govStateQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled: !!govContract,
    },
  );
};
