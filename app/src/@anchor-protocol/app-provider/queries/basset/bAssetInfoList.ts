import { BAssetInfo, bAssetInfoListQuery } from '@anchor-protocol/app-fns';
import {
  EMPTY_QUERY_RESULT,
  useCW20TokenDisplayInfosQuery,
} from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useWallet } from '@terra-money/use-wallet';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { addTokenDisplay, TokenDisplay } from './utils/symbols';

const queryFn = createQueryFn(bAssetInfoListQuery);

export type BAssetInfoWithDisplay = BAssetInfo & TokenDisplay;

export function useBAssetInfoListQuery(): UseQueryResult<
  BAssetInfoWithDisplay[] | undefined
> {
  const { network } = useWallet();
  const tokenDisplayInfos = useCW20TokenDisplayInfosQuery();
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

  if (!bAssetInfos.data || bAssetInfos.data.length === 0) {
    return EMPTY_QUERY_RESULT;
  }

  const tokenDisplayInfoMap = tokenDisplayInfos.data ?? {};

  const result = {
    ...bAssetInfos,
    data: bAssetInfos.data.map((b) =>
      addTokenDisplay(b, tokenDisplayInfoMap[network.name]),
    ),
  } as UseQueryResult<BAssetInfoWithDisplay[] | undefined>;

  return result;
}
