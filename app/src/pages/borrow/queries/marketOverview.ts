import type {
  moneyMarket,
  Rate,
  StableDenom,
  UST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { ContractAddress, HumanAddr } from '@anchor-protocol/types';
import { createMap, map, Mapped, useMap } from '@terra-dev/use-map';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { parseResult } from '@anchor-protocol/web-contexts/queries/parseResult';
import {
  MappedApolloQueryResult,
  MappedQueryResult,
} from '@anchor-protocol/web-contexts/queries/types';
import { useQueryErrorHandler } from '@anchor-protocol/web-contexts/queries/useQueryErrorHandler';
import { useRefetch } from '@anchor-protocol/web-contexts/queries/useRefetch';
import { ApolloClient, gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { Data as MarketState } from './marketState';

export interface RawData {
  borrowRate: WASMContractResult;
  oraclePrice: WASMContractResult;
  overseerWhitelist: WASMContractResult;
}

export interface Data {
  borrowRate: WASMContractResult<moneyMarket.interestModel.BorrowRateResponse>;
  oraclePrice: WASMContractResult<moneyMarket.oracle.PriceResponse>;
  overseerWhitelist: WASMContractResult<moneyMarket.overseer.WhitelistResponse>;
}

export const dataMap = createMap<RawData, Data>({
  borrowRate: (existing, { borrowRate }) => {
    return parseResult(existing.borrowRate, borrowRate.Result);
  },
  oraclePrice: (existing, { oraclePrice }) => {
    return parseResult(existing.oraclePrice, oraclePrice.Result);
  },
  overseerWhitelist: (existing, { overseerWhitelist }) => {
    return parseResult(existing.overseerWhitelist, overseerWhitelist.Result);
  },
});

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    borrowRate: {
      Result: '',
    },
    oraclePrice: {
      Result: '',
    },
    overseerWhitelist: {
      Result: '',
    },
  },
  borrowRate: {
    Result: '',
    rate: '1' as Rate,
  },
  oraclePrice: {
    Result: '',
    rate: '1' as UST,
    last_updated_base: 0,
    last_updated_quote: 0,
  },
  overseerWhitelist: {
    Result: '',
    elems: [],
  },
};

export interface RawVariables {
  interestContractAddress: string;
  interestBorrowRateQuery: string;
  oracleContractAddress: string;
  oracleQuery: string;
  overseerContractAddress: string;
  overseerWhitelistQuery: string;
}

export interface Variables {
  interestContractAddress: HumanAddr;
  interestBorrowRateQuery: moneyMarket.interestModel.BorrowRate;
  oracleContractAddress: HumanAddr;
  oracleQuery: moneyMarket.oracle.Price;
  overseerContractAddress: HumanAddr;
  overseerWhitelistQuery: moneyMarket.overseer.Whitelist;
}

export function mapVariables({
  interestContractAddress,
  interestBorrowRateQuery,
  oracleContractAddress,
  oracleQuery,
  overseerContractAddress,
  overseerWhitelistQuery,
}: Variables): RawVariables {
  return {
    interestContractAddress,
    interestBorrowRateQuery: JSON.stringify(interestBorrowRateQuery),
    oracleContractAddress,
    oracleQuery: JSON.stringify(oracleQuery),
    overseerContractAddress,
    overseerWhitelistQuery: JSON.stringify(overseerWhitelistQuery),
  };
}

export const query = gql`
  query __marketOverview(
    $interestContractAddress: String!
    $interestBorrowRateQuery: String!
    $oracleContractAddress: String!
    $oracleQuery: String!
    $overseerContractAddress: String!
    $overseerWhitelistQuery: String!
  ) {
    borrowRate: WasmContractsContractAddressStore(
      ContractAddress: $interestContractAddress
      QueryMsg: $interestBorrowRateQuery
    ) {
      Result
    }

    oraclePrice: WasmContractsContractAddressStore(
      ContractAddress: $oracleContractAddress
      QueryMsg: $oracleQuery
    ) {
      Result
    }

    overseerWhitelist: WasmContractsContractAddressStore(
      ContractAddress: $overseerContractAddress
      QueryMsg: $overseerWhitelistQuery
    ) {
      Result
    }
  }
`;

export function useMarketOverview({
  marketBalance,
  marketState,
}: {
  marketBalance: MarketState['marketBalance'] | undefined;
  marketState: MarketState['marketState'] | undefined;
}): MappedQueryResult<RawVariables, RawData, Data> {
  const { cw20, moneyMarket } = useContractAddress();

  const variables = useMemo(() => {
    if (!marketBalance || !marketState) return undefined;

    const market_balance = marketBalance?.find(({ Denom }) => Denom === 'uusd')
      ?.Amount;

    if (!market_balance) return undefined;

    return mapVariables({
      interestContractAddress: moneyMarket.interestModel,
      interestBorrowRateQuery: {
        borrow_rate: {
          market_balance,
          total_liabilities: marketState.total_liabilities,
          total_reserves: marketState.total_reserves,
        },
      },
      oracleContractAddress: moneyMarket.oracle,
      oracleQuery: {
        price: {
          base: cw20.bLuna,
          quote: 'uusd' as StableDenom,
        },
      },
      overseerContractAddress: moneyMarket.overseer,
      overseerWhitelistQuery: {
        whitelist: {
          collateral_token: cw20.bLuna,
        },
      },
    });
  }, [
    cw20.bLuna,
    marketBalance,
    marketState,
    moneyMarket.interestModel,
    moneyMarket.oracle,
    moneyMarket.overseer,
  ]);

  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    skip: !marketBalance || !marketState,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}

export function queryMarketOverview(
  client: ApolloClient<any>,
  address: ContractAddress,
  marketBalance: MarketState['marketBalance'],
  marketState: MarketState['marketState'],
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        interestContractAddress: address.moneyMarket.interestModel,
        interestBorrowRateQuery: {
          borrow_rate: {
            market_balance: marketBalance.find(({ Denom }) => Denom === 'uusd')!
              .Amount,
            total_liabilities: marketState.total_liabilities,
            total_reserves: marketState.total_reserves,
          },
        },
        oracleContractAddress: address.moneyMarket.oracle,
        oracleQuery: {
          price: {
            base: address.cw20.bLuna,
            quote: 'uusd' as StableDenom,
          },
        },
        overseerContractAddress: address.moneyMarket.overseer,
        overseerWhitelistQuery: {
          whitelist: {
            collateral_token: address.cw20.bLuna,
          },
        },
      }),
    })
    .then((result) => {
      return {
        ...result,
        data: map(result.data, dataMap),
      };
    });
}
