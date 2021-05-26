import { CW20Addr, HumanAddr, StableDenom, uUST } from '@anchor-protocol/types';
import {
  BorrowMarketData,
  borrowMarketQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [
    ,
    mantleEndpoint,
    mantleFetch,
    marketContract,
    interestContract,
    oracleContract,
    overseerContract,
    bLunaContract,
  ],
}: QueryFunctionContext<
  [
    string,
    string,
    MantleFetch,
    HumanAddr,
    HumanAddr,
    HumanAddr,
    HumanAddr,
    CW20Addr,
  ]
>) => {
  return borrowMarketQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      marketContract,
      marketStateQuery: {
        state: {},
      },
      interestContract,
      interestBorrowRateQuery: {
        borrow_rate: {
          market_balance: '' as uUST,
          total_liabilities: '' as uUST,
          total_reserves: '' as uUST,
        },
      },
      oracleContract,
      oracleQuery: {
        price: {
          base: bLunaContract,
          quote: 'uusd' as StableDenom,
        },
      },
      overseerContract: overseerContract,
      overseerWhitelistQuery: {
        whitelist: {
          collateral_token: bLunaContract,
        },
      },
    },
  });
};

export function useBorrowMarketQuery(): UseQueryResult<
  BorrowMarketData | undefined
> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_MARKET,
      mantleEndpoint,
      mantleFetch,
      moneyMarket.market,
      moneyMarket.interestModel,
      moneyMarket.oracle,
      moneyMarket.overseer,
      cw20.bLuna,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
    },
  );
}
