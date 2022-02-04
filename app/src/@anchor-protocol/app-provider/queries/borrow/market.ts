import { BorrowMarket, borrowMarketQuery } from '@anchor-protocol/app-fns';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import {
  EMPTY_QUERY_RESULT,
  useCW20TokenDisplayInfosQuery,
} from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { useWallet } from '@terra-money/use-wallet';
import { moneyMarket } from '@anchor-protocol/types';
import { useMemo } from 'react';

const queryFn = createQueryFn(borrowMarketQuery);

type OverseerWhilelistElem = moneyMarket.overseer.WhitelistResponse['elems'][0];
export type OverseerWhitelistWithDisplay = {
  elems: Array<OverseerWhilelistElem & { tokenDisplay: CW20TokenDisplayInfo }>;
};

export type BorrowMarketWithDisplay = Omit<
  BorrowMarket,
  'overseerWhitelist'
> & {
  overseerWhitelist: OverseerWhitelistWithDisplay;
};

export function useBorrowMarketQuery(): UseQueryResult<
  BorrowMarketWithDisplay | undefined
> {
  const { network } = useWallet();
  const tokenDisplayInfos = useCW20TokenDisplayInfosQuery();
  const { contractAddress, hiveQueryClient, queryErrorReporter } =
    useAnchorWebapp();

  const borrowMarket = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_MARKET,
      contractAddress.moneyMarket.market,
      contractAddress.moneyMarket.interestModel,
      contractAddress.moneyMarket.oracle,
      contractAddress.moneyMarket.overseer,
      hiveQueryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return useMemo(() => {
    if (!borrowMarket.data || !tokenDisplayInfos.data) {
      return EMPTY_QUERY_RESULT;
    }

    return {
      ...borrowMarket,
      data: {
        ...borrowMarket.data,
        overseerWhitelist: {
          ...borrowMarket.data.overseerWhitelist,
          elems: borrowMarket.data.overseerWhitelist.elems.map((elem) => ({
            ...elem,
            tokenDisplay:
              tokenDisplayInfos.data[network.name][elem.collateral_token],
          })),
        },
      },
    } as UseQueryResult<BorrowMarketWithDisplay | undefined>;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borrowMarket.data, tokenDisplayInfos.data, network.name]);
}
