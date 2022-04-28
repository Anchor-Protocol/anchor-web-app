import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import {
  veANC,
  u,
  anchorToken,
  HumanAddr,
  MillisTimestamp,
} from '@anchor-protocol/types';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { BigSource } from 'big.js';
import { useAccount } from 'contexts/account';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { UseQueryResult } from 'react-query';
import { createQueryFn } from '@libs/react-query-utils';
import { millisecondsInSecond } from 'date-fns';

interface UserUnlockPeriodWasmQuery {
  userUnlockPeriod: WasmQuery<
    anchorToken.votingEscrow.UserUnlockPeriod,
    anchorToken.votingEscrow.UserUnlockPeriodResponse
  >;
  config: WasmQuery<
    anchorToken.votingEscrow.Config,
    anchorToken.votingEscrow.ConfigResponse
  >;
}

const lockPeriodEndsAtQuery = async (
  votingEscrowContract: string,
  user: HumanAddr,
  queryClient: QueryClient,
) => {
  const {
    userUnlockPeriod: { unlock_period },
    config: { period_duration },
  } = await wasmFetch<UserUnlockPeriodWasmQuery>({
    ...queryClient,
    id: 'lock-period-ends-at',
    wasmQuery: {
      userUnlockPeriod: {
        contractAddress: votingEscrowContract,
        query: {
          user_unlock_period: {
            user,
          },
        },
      },
      config: {
        contractAddress: votingEscrowContract,
        query: { config: {} },
      },
    },
  });

  return (unlock_period *
    period_duration *
    millisecondsInSecond) as MillisTimestamp;
};

const lockPeriodEndsAtQueryFn = createQueryFn(lockPeriodEndsAtQuery);

export const useMyLockPeriodEndsAtQuery = (): UseQueryResult<
  u<veANC<BigSource>>
> => {
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
    lockPeriodEndsAtQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      onError: queryErrorReporter,
      enabled,
    },
  );
};
