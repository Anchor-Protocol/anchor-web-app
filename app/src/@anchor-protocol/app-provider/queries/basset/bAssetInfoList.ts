import { BAssetInfo, bAssetInfoListQuery } from '@anchor-protocol/app-fns';
import {
  EMPTY_QUERY_RESULT,
  useCW20TokenDisplayInfosQuery,
} from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useWallet } from '@terra-money/use-wallet';
import { useMemo } from 'react';
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

  return useMemo(() => {
    if (!bAssetInfos.data || !tokenDisplayInfos.data) {
      return EMPTY_QUERY_RESULT;
    }

    return {
      ...bAssetInfos,
      data: bAssetInfos.data.map((b) =>
        addTokenDisplay(b, tokenDisplayInfos.data[network.name]),
      ),
    } as UseQueryResult<BAssetInfoWithDisplay[] | undefined>;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bAssetInfos.data, tokenDisplayInfos.data, network.name]);
}
