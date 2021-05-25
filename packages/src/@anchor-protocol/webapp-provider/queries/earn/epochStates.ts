import { HumanAddr } from '@anchor-protocol/types';
import {
  ANCHOR_QUERY_KEY,
  EarnEpochStatesData,
  earnEpochStatesQuery,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useEventBusListener } from '@terra-dev/event-bus';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';

const queryFn = ({
  queryKey: [
    ,
    mantleEndpoint,
    mantleFetch,
    lastSyncedHeight,
    moneyMarketContract,
    overseerContract,
  ],
}: QueryFunctionContext<
  [string, string, MantleFetch, () => Promise<number>, HumanAddr, HumanAddr]
>) => {
  return earnEpochStatesQuery({
    mantleEndpoint,
    mantleFetch,
    lastSyncedHeight,
    variables: {
      moneyMarketContract,
      overseerContract,
      moneyMarketEpochStateQuery: {
        epoch_state: {
          block_height: -1,
        },
      },
      overseerEpochStateQuery: {
        epoch_state: {},
      },
    },
  });
};

export function useEarnEpochStatesQuery(): UseQueryResult<
  EarnEpochStatesData | undefined
> {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

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
    },
  );

  // TODO remove
  useEventBusListener('interest-earned-updated', () => {
    if (!browserInactive) {
      result.refetch();
    }
  });

  return result;
}
