import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { ANC } from '@anchor-protocol/types';
import { u } from '@libs/types';
import Big from 'big.js';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { UseQueryResult } from 'react-query';

export const useStakedAncQuery = (): UseQueryResult<u<ANC<Big>>> => {
  return useAnchorQuery(
    [ANCHOR_QUERY_KEY.ANC_STAKED_BALANCE],
    () => {
      // TODO
      return Big(1000000) as u<ANC<Big>>;
    },
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
    },
  );
};
