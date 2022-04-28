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

interface UserVotingPowerWasmQuery {
  userVotingPower: WasmQuery<
    anchorToken.votingEscrow.UserVotingPower,
    anchorToken.votingEscrow.UserVotingPowerResponse
  >;
}

const userVotingPowerQuery = async (
  votingEscrowContract: string,
  user: HumanAddr,
  queryClient: QueryClient,
) => {
  const {
    userVotingPower: { voting_power },
  } = await wasmFetch<UserVotingPowerWasmQuery>({
    ...queryClient,
    id: 'user-voting-power',
    wasmQuery: {
      userVotingPower: {
        contractAddress: votingEscrowContract,
        query: {
          user_voting_power: {
            user,
          },
        },
      },
    },
  });

  return voting_power;
};

const userVotingPowerQueryFn = createQueryFn(userVotingPowerQuery);

export const useMyVotingPowerQuery = (): UseQueryResult<
  u<veANC<BigSource>>
> => {
  const { queryClient, contractAddress } = useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  const votingEscrowContract = contractAddress.anchorToken.votingEscrow;

  const enabled = !!terraWalletAddress && !!votingEscrowContract;

  return useAnchorQuery(
    [
      ANCHOR_QUERY_KEY.ANC_MY_VOTING_POWER,
      votingEscrowContract,
      terraWalletAddress as HumanAddr,
      queryClient,
    ],
    userVotingPowerQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled,
    },
  );
};
