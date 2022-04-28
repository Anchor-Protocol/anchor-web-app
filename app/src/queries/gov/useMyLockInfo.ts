import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { anchorToken, HumanAddr } from '@anchor-protocol/types';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { useAccount } from 'contexts/account';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { createQueryFn } from '@libs/react-query-utils';

interface UserLockInfoWasmQuery {
  lockInfo: WasmQuery<
    anchorToken.votingEscrow.LockInfo,
    anchorToken.votingEscrow.LockInfoResponse
  >;
}

const userLockInfoQuery = async (
  votingEscrowContract: string,
  user: HumanAddr,
  queryClient: QueryClient,
) => {
  const { lockInfo } = await wasmFetch<UserLockInfoWasmQuery>({
    ...queryClient,
    id: 'user-lock-info',
    wasmQuery: {
      lockInfo: {
        contractAddress: votingEscrowContract,
        query: {
          lock_info: {
            user,
          },
        },
      },
    },
  });

  return lockInfo;
};

const userLockInfoQueryFn = createQueryFn(userLockInfoQuery);

export const useMyLockInfoQuery = () => {
  const { queryClient, contractAddress } = useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  const votingEscrowContract = contractAddress.anchorToken.votingEscrow;

  const enabled = !!terraWalletAddress && !!votingEscrowContract;

  return useAnchorQuery(
    [
      ANCHOR_QUERY_KEY.LOCK_INFO,
      votingEscrowContract,
      terraWalletAddress as HumanAddr,
      queryClient,
    ],
    userLockInfoQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled,
    },
  );
};
