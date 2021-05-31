import { JSDateTime } from '@anchor-protocol/types';
import {
  EarnAPYHistoryData,
  earnAPYHistoryQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch],
}: QueryFunctionContext<[string, string, MantleFetch]>) => {
  return earnAPYHistoryQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      //timestampMax: (Date.now() - 1000 * 60 * 60 * 24) as JSDateTime,
      timestampMax: (Date.now() - 1000 * 60 * 60) as JSDateTime,
    },
  });
};

export function useEarnAPYHistoryQuery(): UseQueryResult<
  EarnAPYHistoryData | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  return useQuery(
    [ANCHOR_QUERY_KEY.EARN_APY_HISTORY, mantleEndpoint, mantleFetch],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 60,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
