import {
  AncLpStakingState,
  ancLpStakingStateQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(ancLpStakingStateQuery);

export function useAncLpStakingStateQuery(): UseQueryResult<
  AncLpStakingState | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { anchorToken },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_LP_STAKING_STATE,
      anchorToken.staking,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 2,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
