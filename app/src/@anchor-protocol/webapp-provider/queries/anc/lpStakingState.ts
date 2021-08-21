import { HumanAddr } from '@anchor-protocol/types';
import {
  AncLpStakingState,
  ancLpStakingStateQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@packages/react-query-utils';
import { MantleFetch, useTerraWebapp } from '@packages/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    ancStakingContract: HumanAddr,
  ) => {
    return ancLpStakingStateQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        lpStakingState: {
          contractAddress: ancStakingContract,
          query: {
            state: {},
          },
        },
      },
    });
  },
);

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
      mantleEndpoint,
      mantleFetch,
      anchorToken.staking,
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
