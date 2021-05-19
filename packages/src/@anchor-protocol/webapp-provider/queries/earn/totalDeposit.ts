import { earnTotalDepositQuery } from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useEventBusListener } from '@terra-dev/event-bus';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery } from 'react-query';

export function useEarnTotalDepositQuery() {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      'EARN_TOTAL_DEPOSIT',
      connectedWallet?.walletAddress,
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
    ],
    () => {
      return earnTotalDepositQuery({
        mantleEndpoint,
        mantleFetch,
        lastSyncedHeight,
        variables: {
          anchorTokenContract: cw20.aUST,
          anchorTokenBalanceQuery: {
            balance: {
              address: connectedWallet!.walletAddress,
            },
          },
          moneyMarketContract: moneyMarket.market,
          moneyMarketEpochQuery: {
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

  useEventBusListener('tx-completed', () => {
    if (connectedWallet && !browserInactive) {
      result.refetch();
    }
  });

  return result;
}
