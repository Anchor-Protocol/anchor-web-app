import { useAnchorWebapp } from '@anchor-protocol/app-provider/contexts/context';
import { Rate } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import big from 'big.js';
import { createQueryFn } from '@libs/react-query-utils';
import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider/env';

const projectedEarnApyQuery = async () => {
  return big(0.156);
};

const projectedEarnApyQueryFn = createQueryFn(projectedEarnApyQuery);

export const useProjectedEarnApy = (): UseQueryResult<Rate<big>> => {
  const { queryErrorReporter } = useAnchorWebapp();

  return useQuery(
    [ANCHOR_QUERY_KEY.PROJECTED_EARN_APY],
    projectedEarnApyQueryFn,
    {
      refetchInterval: 1000 * 60,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
};
