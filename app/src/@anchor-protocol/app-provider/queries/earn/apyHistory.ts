import {
  EarnAPYHistoryData,
  earnAPYHistoryQuery,
} from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(earnAPYHistoryQuery);

export function useEarnAPYHistoryQuery(): UseQueryResult<
  EarnAPYHistoryData | undefined
> {
  const { queryErrorReporter, indexerApiEndpoint } = useAnchorWebapp();

  return useQuery(
    [ANCHOR_QUERY_KEY.EARN_APY_HISTORY, indexerApiEndpoint],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 60,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
