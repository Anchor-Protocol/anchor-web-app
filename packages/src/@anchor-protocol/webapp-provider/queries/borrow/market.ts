import { StableDenom, uUST } from '@anchor-protocol/types';
import {
  ANCHOR_QUERY_KEY,
  BorrowMarketData,
  borrowMarketQuery,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export function useBorrowMarketQuery(): UseQueryResult<
  BorrowMarketData | undefined
> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const queryFn = useCallback(() => {
    return borrowMarketQuery({
      mantleEndpoint,
      mantleFetch,
      variables: {
        marketContract: moneyMarket.market,
        marketStateQuery: {
          state: {},
        },
        interestContract: moneyMarket.interestModel,
        interestBorrowRateQuery: {
          borrow_rate: {
            market_balance: '' as uUST,
            total_liabilities: '' as uUST,
            total_reserves: '' as uUST,
          },
        },
        oracleContract: moneyMarket.oracle,
        oracleQuery: {
          price: {
            base: cw20.bLuna,
            quote: 'uusd' as StableDenom,
          },
        },
        overseerContract: moneyMarket.overseer,
        overseerWhitelistQuery: {
          whitelist: {
            collateral_token: cw20.bLuna,
          },
        },
      },
    });
  }, [
    cw20.bLuna,
    mantleEndpoint,
    mantleFetch,
    moneyMarket.interestModel,
    moneyMarket.market,
    moneyMarket.oracle,
    moneyMarket.overseer,
  ]);

  return useQuery(ANCHOR_QUERY_KEY.BORROW_MARKET, queryFn, {
    refetchInterval: browserInactive && 1000 * 60 * 5,
    enabled: !browserInactive,
    keepPreviousData: true,
  });
}
