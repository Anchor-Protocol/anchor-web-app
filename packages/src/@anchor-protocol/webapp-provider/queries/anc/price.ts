import { HumanAddr } from '@anchor-protocol/types';
import { AncPriceData, ancPriceQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, { mantleEndpoint, mantleFetch, ancUstPairContract }],
}: QueryFunctionContext<
  [
    string,
    {
      mantleEndpoint: string;
      mantleFetch: MantleFetch;
      ancUstPairContract: HumanAddr;
    },
  ]
>) => {
  return ancPriceQuery({
    mantleEndpoint,
    mantleFetch,
    wasmQuery: {
      ancPrice: {
        contractAddress: ancUstPairContract,
        query: {
          pool: {},
        },
      },
    },
    //variables: {
    //  ancUstPairContract,
    //  poolInfoQuery: {
    //    pool: {},
    //  },
    //},
  });
};

export function useAncPriceQuery(): UseQueryResult<AncPriceData | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { terraswap },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_PRICE,
      {
        mantleEndpoint,
        mantleFetch,
        ancUstPairContract: terraswap.ancUstPair,
      },
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
