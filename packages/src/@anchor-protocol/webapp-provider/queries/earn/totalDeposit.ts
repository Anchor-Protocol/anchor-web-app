import {
  ANCHOR_QUERY_KEY,
  AnchorTokenBalances,
  EarnTotalDepositData,
  earnTotalDepositQuery,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useEventBusListener } from '@terra-dev/event-bus';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  useBank,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';

export function useEarnTotalDepositQuery(): UseQueryResult<
  EarnTotalDepositData | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const { refetchTokenBalances } = useBank<AnchorTokenBalances>();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.EARN_TOTAL_DEPOSIT,
      connectedWallet?.walletAddress,
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      refetchTokenBalances,
    ],
    () => {
      return earnTotalDepositQuery({
        mantleEndpoint,
        mantleFetch,
        lastSyncedHeight,
        fetchTokenBalances: refetchTokenBalances,
        variables: {
          moneyMarketContract: moneyMarket.market,
          epochStateQuery: {
            epoch_state: {
              block_height: -1,
            },
          },
        },
      });
    },
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
    },
  );

  // TODO remove
  useEventBusListener('interest-earned-updated', () => {
    if (connectedWallet && !browserInactive) {
      result.refetch();
    }
  });

  return !!connectedWallet ? result : EMPTY_QUERY_RESULT;
}
