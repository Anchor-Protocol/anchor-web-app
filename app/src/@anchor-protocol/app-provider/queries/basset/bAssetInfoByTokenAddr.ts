import { bAssetInfoByTokenAddrQuery } from '@anchor-protocol/app-fns';
import { CW20Addr } from '@anchor-protocol/types';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { useQueryWithTokenDisplay } from '../utils/tokenDisplay';
import {
  BAssetInfoWithDisplay,
  withBAssetInfoTokenDisplay,
} from './utils/tokenDisplay';

const queryFn = createQueryFn(bAssetInfoByTokenAddrQuery);

export function useBAssetInfoByTokenAddrQuery(
  tokenAddr: CW20Addr | undefined,
): UseQueryResult<BAssetInfoWithDisplay | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const bAssetInfo = useQuery(
    [
      ANCHOR_QUERY_KEY.BASSET_INFO_BY_TOKEN_ADDR,
      contractAddress.moneyMarket.overseer,
      tokenAddr,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return useQueryWithTokenDisplay(bAssetInfo, withBAssetInfoTokenDisplay);
}
