import { HumanAddr } from '@anchor-protocol/types';
import {
  AncLpStakingStateData,
  ancLpStakingStateQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, ancStakingContract],
}: QueryFunctionContext<[string, string, MantleFetch, HumanAddr]>) => {
  return ancLpStakingStateQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      ancStakingContract,
      lpStakingStateQuery: {
        state: {},
      },
    },
  });
};

export function useAncLpStakingStateQuery(): UseQueryResult<
  AncLpStakingStateData | undefined
> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

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
    },
  );

  return result;
}
