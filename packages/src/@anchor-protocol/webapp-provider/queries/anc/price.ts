import { HumanAddr } from '@anchor-protocol/types';
import { AncPriceData, ancPriceQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, ancUstPairContract],
}: QueryFunctionContext<[string, string, MantleFetch, HumanAddr]>) => {
  return ancPriceQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      ancUstPairContract,
      poolInfoQuery: {
        pool: {},
      },
    },
  });
};

export function useAncPriceQuery(): UseQueryResult<AncPriceData | undefined> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    contractAddress: { terraswap },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_PRICE,
      mantleEndpoint,
      mantleFetch,
      terraswap.ancUstPair,
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
