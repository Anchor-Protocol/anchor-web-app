import { bAssetInfoAndBalanceByTokenAddrQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr } from '@libs/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { useQueryWithTokenDisplay } from '../utils';
import {
  BAssetInfoAndBalanceWithOracleWithDisplay,
  withBAssetInfoAndBalanceWithOracleTokenDisplay,
} from './utils';

const queryFn = createQueryFn(bAssetInfoAndBalanceByTokenAddrQuery);

export function useBAssetInfoAndBalanceByTokenAddrQuery(
  tokenAddr: CW20Addr | undefined,
): UseQueryResult<BAssetInfoAndBalanceWithOracleWithDisplay | undefined> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BASSET_INFO_AND_BALANCE_BY_TOKEN_ADDR,
      connectedWallet?.walletAddress,
      tokenAddr,
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

  return useQueryWithTokenDisplay(
    result,
    withBAssetInfoAndBalanceWithOracleTokenDisplay,
  );
}
