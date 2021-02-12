import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { Num, uaUST, uUST } from '@anchor-protocol/notation';
import { createMap, map, useMap } from '@anchor-protocol/use-map';
import { ApolloClient, gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { parseResult } from 'queries/parseResult';
import { MappedApolloQueryResult, MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  currentBlock: number;
  marketBalance: {
    Result: { Denom: string; Amount: Num<string> }[];
  };
  marketState: {
    Result: string;
  };
}

export interface Data {
  currentBlock: number;
  marketBalance: { Denom: string; Amount: Num<string> }[];
  marketState: {
    Result: string;
    total_liabilities: uUST<string>;
    total_reserves: uaUST<string>;
    last_interest_updated: number;
    global_interest_index: Num<string>;
  };
}

export const dataMap = createMap<RawData, Data>({
  currentBlock: (_, { currentBlock }) => {
    return currentBlock;
  },
  marketBalance: (existing, { marketBalance }) => {
    if (existing.marketBalance?.length === marketBalance.Result.length) {
      let i: number = -1;
      const max: number = marketBalance.Result.length;
      while (++i < max) {
        const prev = existing.marketBalance[i];
        const next = marketBalance.Result[i];

        if (prev.Denom !== next.Denom || prev.Amount !== next.Amount) {
          return marketBalance.Result;
        }
      }
      return existing.marketBalance;
    }

    return marketBalance.Result;
  },
  marketState: (existing, { marketState }) => {
    return parseResult(existing.marketState, marketState.Result);
  },
});

export interface RawVariables {
  marketContractAddress: string;
  marketStateQuery: string;
}

export interface Variables {
  marketContractAddress: string;
  marketStateQuery: {
    state: {};
  };
}

export function mapVariables({
  marketContractAddress,
  marketStateQuery,
}: Variables): RawVariables {
  return {
    marketContractAddress,
    marketStateQuery: JSON.stringify(marketStateQuery),
  };
}

export const query = gql`
  query($marketContractAddress: String!, $marketStateQuery: String!) {
    # current block height, synced in mantle
    currentBlock: LastSyncedHeight

    # uusd balance of market contract
    marketBalance: BankBalancesAddress(Address: $marketContractAddress) {
      Result {
        Denom
        Amount
      }
    }

    # read market state
    # https://app.gitbook.com/@anchor-protocol/s/anchor-1/smart-contracts/money-market/market#stateresponse
    marketState: WasmContractsContractAddressStore(
      ContractAddress: $marketContractAddress
      QueryMsg: $marketStateQuery
    ) {
      Result
    }
  }
`;

export function useMarketBalanceOverview(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const addressProvider = useAddressProvider();

  const variables = useMemo<RawVariables>(() => {
    return mapVariables({
      marketContractAddress: addressProvider.market('uusd'),
      marketStateQuery: {
        state: {},
      },
    });
  }, [addressProvider]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    fetchPolicy: 'network-only',
    pollInterval: 1000 * 60,
    variables,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}

export function queryMarketBalanceOverview(
  client: ApolloClient<any>,
  addressProvider: AddressProvider,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        marketContractAddress: addressProvider.market('uusd'),
        marketStateQuery: {
          state: {},
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
