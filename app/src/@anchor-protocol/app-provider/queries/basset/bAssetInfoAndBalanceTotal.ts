import {
  BAssetInfoAndBalancesTotal,
  bAssetInfoAndBalanceTotalQuery,
} from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bAssetInfoAndBalanceTotalQuery);

export function useBAssetInfoAndBalanceTotalQuery(): UseQueryResult<
  BAssetInfoAndBalancesTotal | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BASSET_INFO_AND_BALANCE_TOTAL,
      connectedWallet?.walletAddress,
      contractAddress.moneyMarket.overseer,
      contractAddress.moneyMarket.oracle,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: !!connectedWallet && 1000 * 60 * 5,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
