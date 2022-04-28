import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { ANC, anchorToken, HumanAddr, u } from '@anchor-protocol/types';
import { QueryClient, wasmFetch, WasmQuery } from '@libs/query-client';
import { createQueryFn } from '@libs/react-query-utils';
import { BigSource } from 'big.js';
import { useAccount } from 'contexts/account';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { UseQueryResult } from 'react-query';

interface StakerWasmQuery {
  staker: WasmQuery<anchorToken.gov.Staker, anchorToken.gov.StakerResponse>;
}

const stakerQuery = async (
  walletAddr: HumanAddr | undefined,
  contractAddr: HumanAddr,
  queryClient: QueryClient,
) => {
  if (!walletAddr) {
    return undefined;
  }

  const { staker } = await wasmFetch<StakerWasmQuery>({
    ...queryClient,
    id: 'gov--staker',
    wasmQuery: {
      staker: {
        contractAddress: contractAddr,
        query: {
          staker: {
            address: walletAddr,
          },
        },
      },
    },
  });

  return staker.balance;
};

const queryFn = createQueryFn(stakerQuery);

export const useMyAncStakedQuery = (): UseQueryResult<u<ANC<BigSource>>> => {
  const { queryClient, contractAddress } = useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  return useAnchorQuery(
    [
      ANCHOR_QUERY_KEY.GOV_MY_ANC_STAKED,
      terraWalletAddress,
      contractAddress.anchorToken.gov,
      queryClient,
    ],
    queryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
    },
  );
};
