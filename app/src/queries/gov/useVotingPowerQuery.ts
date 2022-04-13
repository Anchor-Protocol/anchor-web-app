import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import Big from 'big.js';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { UseQueryResult } from 'react-query';

export const useVotingPowerQuery = (): UseQueryResult<Big> => {
  return useAnchorQuery(
    [ANCHOR_QUERY_KEY.ANC_VOTING_POWER],
    () => {
      // TODO
      return Big(10000);
    },
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
    },
  );
};
