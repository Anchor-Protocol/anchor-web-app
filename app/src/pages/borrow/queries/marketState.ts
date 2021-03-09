import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import type {
  ContractAddress,
  Denom,
  HumanAddr,
  moneyMarket,
  Num,
  Rate,
  uUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, map, Mapped, useMap } from '@anchor-protocol/use-map';
import { ApolloClient, gql, useQuery } from '@apollo/client';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import { parseResult } from '@anchor-protocol/web-contexts/queries/parseResult';
import {
  MappedApolloQueryResult,
  MappedQueryResult,
} from '@anchor-protocol/web-contexts/queries/types';
import { useQueryErrorHandler } from '@anchor-protocol/web-contexts/queries/useQueryErrorHandler';
import { useRefetch } from '@anchor-protocol/web-contexts/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  currentBlock: number;
  marketBalance: {
    Result: { Denom: Denom; Amount: uUST }[];
  };
  marketState: WASMContractResult;
}

export interface Data {
  currentBlock: number;
  marketBalance: { Denom: Denom; Amount: uUST }[];
  marketState: WASMContractResult<moneyMarket.market.StateResponse>;
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

export const mockupData: Mapped<RawData, Data> = {
  __data: undefined,
  currentBlock: 0,
  marketBalance: [],
  marketState: {
    Result: '',
    total_liabilities: '0' as uUST,
    total_reserves: '0' as uUST,
    last_interest_updated: 0,
    last_reward_updated: 0,
    global_interest_index: '0' as Num,
    global_reward_index: '0' as Num,
    anc_emission_rate: '1' as Rate,
  },
};

export interface RawVariables {
  marketContractAddress: string;
  marketStateQuery: string;
}

export interface Variables {
  marketContractAddress: HumanAddr;
  marketStateQuery: moneyMarket.market.State;
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
  query __marketState(
    $marketContractAddress: String!
    $marketStateQuery: String!
  ) {
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

export function useMarketState(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { moneyMarket } = useContractAddress();

  const { online } = useService();

  const variables = useMemo<RawVariables>(() => {
    return mapVariables({
      marketContractAddress: moneyMarket.market,
      marketStateQuery: {
        state: {},
      },
    });
  }, [moneyMarket.market]);

  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    skip: !online,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000 * 10,
    variables,
    onError,
  });

  useSubscription((id, event) => {
    if (event === 'done') {
      _refetch();
    }
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data: online ? data : mockupData,
    refetch,
  };
}

export function queryMarketState(
  client: ApolloClient<any>,
  address: ContractAddress,
): Promise<MappedApolloQueryResult<RawData, Data>> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: mapVariables({
        marketContractAddress: address.moneyMarket.market,
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
