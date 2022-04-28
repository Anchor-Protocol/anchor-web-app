import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { veANC, u, anchorToken, HumanAddr } from '@anchor-protocol/types';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { BigSource } from 'big.js';
import { useAccount } from 'contexts/account';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { UseQueryResult } from 'react-query';
import { createQueryFn } from '@libs/react-query-utils';

interface UserUnlockPeriodWasmQuery {
  userUnlockPeriod: WasmQuery<
    anchorToken.votingEscrow.UserUnlockPeriod,
    anchorToken.votingEscrow.UserUnlockPeriodResponse
  >;
}

const userUnlockPeriodQuery = async (
  votingEscrowContract: string,
  user: HumanAddr,
  queryClient: QueryClient,
) => {
  const {
    userUnlockPeriod: { unlock_period },
  } = await wasmFetch<UserUnlockPeriodWasmQuery>({
    ...queryClient,
    id: 'user-voting-power',
    wasmQuery: {
      userUnlockPeriod: {
        contractAddress: votingEscrowContract,
        query: {
          user_unlock_period: {
            user,
          },
        },
      },
    },
  });

  return unlock_period;
};

const userUnlockPeriodQueryFn = createQueryFn(userUnlockPeriodQuery);

export const useMyUnlockPeriod = (): UseQueryResult<u<veANC<BigSource>>> => {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  const votingEscrowContract = contractAddress.anchorToken.votingEscrow;

  const enabled = !!terraWalletAddress && !!votingEscrowContract;

  return useAnchorQuery(
    [
      ANCHOR_QUERY_KEY.UNLOCK_PERIOD,
      votingEscrowContract,
      terraWalletAddress as HumanAddr,
      queryClient,
    ],
    userUnlockPeriodQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      onError: queryErrorReporter,
      enabled,
    },
  );
};
