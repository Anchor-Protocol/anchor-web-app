import {
  BAssetInfoAndBalancesTotal,
  bAssetInfoAndBalanceTotalQuery,
} from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useAccount } from 'contexts/account';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bAssetInfoAndBalanceTotalQuery);

export function useBAssetInfoAndBalanceTotalQuery(): UseQueryResult<
  BAssetInfoAndBalancesTotal | undefined
> {
  const { connected, terraWalletAddress } = useAccount();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BASSET_INFO_AND_BALANCE_TOTAL,
      terraWalletAddress,
      contractAddress.moneyMarket.overseer,
      contractAddress.moneyMarket.oracle,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: connected && 1000 * 60 * 5,
      enabled: connected,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
