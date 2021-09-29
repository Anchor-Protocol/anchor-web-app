import {
  EarnAPYHistoryData,
  earnAPYHistoryQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(earnAPYHistoryQuery);

export function useEarnAPYHistoryQuery(): UseQueryResult<
  EarnAPYHistoryData | undefined
> {
  const { queryErrorReporter } = useTerraWebapp();

  return useQuery([ANCHOR_QUERY_KEY.EARN_APY_HISTORY], queryFn, {
    refetchInterval: 1000 * 60 * 60,
    keepPreviousData: true,
    onError: queryErrorReporter,
  });
}
