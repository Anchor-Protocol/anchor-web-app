import { useAnchorWebapp } from '@anchor-protocol/app-provider/contexts/context';
import { Rate } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import big from 'big.js';

export const useProjectedApy = (): UseQueryResult<Rate<big>> => {
  const { queryErrorReporter } = useAnchorWebapp();

  return useQuery([], () => big(0.156), {
    refetchInterval: 1000 * 60,
    keepPreviousData: true,
    onError: queryErrorReporter,
  });
};
