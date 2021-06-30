import { HumanAddr } from '@anchor-protocol/types';
import {
  AncLpStakingState,
  ancLpStakingStateQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
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

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_LP_STAKING_STATE,
      mantleEndpoint,
      mantleFetch,
      anchorToken.staking,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
