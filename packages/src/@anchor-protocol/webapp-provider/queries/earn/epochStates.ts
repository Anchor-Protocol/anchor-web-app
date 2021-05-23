import {
  ANCHOR_QUERY_KEY,
  EarnEpochStatesData,
  earnEpochStatesQuery,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useEventBusListener } from '@terra-dev/event-bus';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export function useEarnEpochStatesQuery(): UseQueryResult<
  EarnEpochStatesData | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const queryFn = useCallback(() => {
    return earnEpochStatesQuery({
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      variables: {
        moneyMarketContract: moneyMarket.market,
        overseerContract: moneyMarket.overseer,
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
  }, [
    lastSyncedHeight,
    mantleEndpoint,
    mantleFetch,
    moneyMarket.market,
    moneyMarket.overseer,
  ]);

  const result = useQuery(ANCHOR_QUERY_KEY.EARN_EPOCH_STATES, queryFn, {
    refetchInterval: browserInactive && 1000 * 60 * 5,
    enabled: !browserInactive && !!connectedWallet,
    keepPreviousData: true,
  });

  // TODO remove
  useEventBusListener('interest-earned-updated', () => {
    if (connectedWallet && !browserInactive) {
      result.refetch();
    }
  });

  return !!connectedWallet ? result : EMPTY_QUERY_RESULT;
}
