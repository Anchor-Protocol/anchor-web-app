import { bAssetInfoListQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { useQueryWithTokenDisplay } from '../utils/tokenDisplay';
import {
  BAssetInfoWithDisplay,
  withBAssetInfoTokenDisplay,
} from './utils/tokenDisplay';

const queryFn = createQueryFn(bAssetInfoListQuery);

export function useBAssetInfoListQuery(): UseQueryResult<
  BAssetInfoWithDisplay[] | undefined
> {
  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const bAssetInfos = useQuery(
    [
      ANCHOR_QUERY_KEY.BASSET_INFO_LIST,
      contractAddress.moneyMarket.overseer,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return useQueryWithTokenDisplay(
    bAssetInfos,
    (bAssets, tokenDisplayByInfoAddr) =>
      bAssets.map((bAsset) =>
        withBAssetInfoTokenDisplay(bAsset, tokenDisplayByInfoAddr),
      ),
  );
}
