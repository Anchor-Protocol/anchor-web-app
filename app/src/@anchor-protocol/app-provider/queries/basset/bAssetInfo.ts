import { bAssetInfoQuery } from '@anchor-protocol/app-fns';
import { moneyMarket } from '@anchor-protocol/types';
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
import { BAssetInfoWithDisplay } from './bAssetInfoList';
import { addTokenDisplay } from './utils/symbols';

const queryFn = createQueryFn(bAssetInfoQuery);

export function useBAssetInfoQuery(
  bAsset: moneyMarket.overseer.WhitelistResponse['elems'][number] | undefined,
): UseQueryResult<BAssetInfoWithDisplay | undefined> {
  const { network } = useWallet();
  const tokenDisplayInfos = useCW20TokenDisplayInfosQuery();
  const { queryClient, queryErrorReporter } = useAnchorWebapp();

  const bAssetInfo = useQuery(
    [ANCHOR_QUERY_KEY.BASSET_INFO, bAsset, queryClient],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return useMemo(() => {
    if (!bAssetInfo.data || !tokenDisplayInfos.data) {
      return EMPTY_QUERY_RESULT;
    }

    return {
      ...bAssetInfo,
      data: addTokenDisplay(
        bAssetInfo.data,
        tokenDisplayInfos.data[network.name],
      ),
    } as UseQueryResult<BAssetInfoWithDisplay | undefined>;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bAssetInfo.data, tokenDisplayInfos.data, network.name]);
}
