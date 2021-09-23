import { HumanAddr, u, UST } from '@anchor-protocol/types';
import { BorrowMarket, borrowMarketQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { MantleFetch } from '@libs/mantle';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    marketContract: HumanAddr,
    interestContract: HumanAddr,
    oracleContract: HumanAddr,
    overseerContract: HumanAddr,
  ) => {
    return borrowMarketQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        marketState: {
          contractAddress: marketContract,
          query: {
            state: {},
          },
        },
        overseerWhitelist: {
          contractAddress: overseerContract,
          query: {
            whitelist: {},
          },
        },
        borrowRate: {
          contractAddress: interestContract,
          query: {
            borrow_rate: {
              market_balance: '0' as u<UST>,
              total_reserves: '0' as u<UST>,
              total_liabilities: '0' as u<UST>,
            },
          },
        },
        oraclePrices: {
          contractAddress: oracleContract,
          query: {
            prices: {},
          },
        },
      },
    });
  },
);

export function useBorrowMarketQuery(): UseQueryResult<
  BorrowMarket | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_MARKET,
      mantleEndpoint,
      mantleFetch,
      moneyMarket.market,
      moneyMarket.interestModel,
      moneyMarket.oracle,
      moneyMarket.overseer,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
