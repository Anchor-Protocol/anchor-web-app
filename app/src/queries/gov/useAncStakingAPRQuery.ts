import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { Rate } from '@anchor-protocol/types';
import { BigSource } from 'big.js';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { UseQueryResult } from 'react-query';

export const useAncStakingAPRQuery = (): UseQueryResult<Rate<BigSource>> => {
  const { apiClient } = useAnchorWebapp();

  return useAnchorQuery(
    [ANCHOR_QUERY_KEY.GOV_ANC_STAKING_APR],
    async () => {
      const response = await apiClient.getGovRewards();
      return response.current_apy as Rate<number>;
    },
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
    },
  );
};
