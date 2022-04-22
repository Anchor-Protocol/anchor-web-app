import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { veANC, u } from '@anchor-protocol/types';
import Big, { BigSource } from 'big.js';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { UseQueryResult } from 'react-query';

export const useVotingPowerQuery = (): UseQueryResult<u<veANC<BigSource>>> => {
  return useAnchorQuery(
    [ANCHOR_QUERY_KEY.ANC_VOTING_POWER],
    () => {
      // TODO
      return Big('90442123');
    },
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
    },
  );
};
