import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import {
  anchorToken,
  HumanAddr,
  MillisTimestamp,
} from '@anchor-protocol/types';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { useAccount } from 'contexts/account';
import { useAnchorQuery } from 'queries/useAnchorQuery';
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
): Promise<MillisTimestamp | undefined> => {
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

  if (!unlock_period) {
    return;
  }

  return (unlock_period *
    period_duration *
    millisecondsInSecond) as MillisTimestamp;
};

const lockPeriodEndsAtQueryFn = createQueryFn(lockPeriodEndsAtQuery);

export const useMyLockPeriodEndsAtQuery = () => {
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
