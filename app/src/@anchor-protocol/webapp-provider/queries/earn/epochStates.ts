import { HumanAddr } from '@anchor-protocol/types';
import {
  EarnEpochStates,
  earnEpochStatesQuery,
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
    lastSyncedHeight: () => Promise<number>,
    moneyMarketContract: HumanAddr,
    overseerContract: HumanAddr,
  ) => {
    return earnEpochStatesQuery({
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      wasmQuery: {
        moneyMarketEpochState: {
          contractAddress: moneyMarketContract,
          query: {
            epoch_state: {
              block_height: -1,
            },
          },
        },
        overseerEpochState: {
          contractAddress: overseerContract,
          query: {
            epoch_state: {},
          },
        },
      },
    });
  },
);

export function useEarnEpochStatesQuery(): UseQueryResult<
  EarnEpochStates | undefined
> {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight, queryErrorReporter } =
    useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.EARN_EPOCH_STATES,
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      moneyMarket.market,
      moneyMarket.overseer,
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
