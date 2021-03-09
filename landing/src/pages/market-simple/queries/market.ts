import { moneyMarket, uUST, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { parseResult } from '@anchor-protocol/web-contexts/queries/parseResult';
import { MappedQueryResult } from '@anchor-protocol/web-contexts/queries/types';
import { useQueryErrorHandler } from '@anchor-protocol/web-contexts/queries/useQueryErrorHandler';
import { useRefetch } from '@anchor-protocol/web-contexts/queries/useRefetch';
import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

export interface RawData {
  state: WASMContractResult;
  balances: {
    Result: { Denom: string; Amount: string }[];
  };
}

export interface Data {
  uUSD: uUST<string>;
  state: WASMContractResult<moneyMarket.market.StateResponse>;
}

export const dataMap = createMap<RawData, Data>({
  uUSD: (_, { balances }) => {
    return (balances.Result.find(({ Denom }) => Denom === 'uusd')?.Amount ??
      '0') as uUST;
  },
  state: (existing, { state }) => {
    return parseResult(existing.state, state.Result);
  },
});

export interface RawVariables {
  marketContract: string;
  marketStateQuery: string;
}

export interface Variables {
  marketContract: string;
}

export function mapVariables({ marketContract }: Variables): RawVariables {
  return {
    marketContract,
    marketStateQuery: JSON.stringify({
      state: {},
    } as moneyMarket.market.State),
  };
}

export const query = gql`
  query __marketState($marketContract: String!, $marketStateQuery: String!) {
    state: WasmContractsContractAddressStore(
      ContractAddress: $marketContract
      QueryMsg: $marketStateQuery
    ) {
      Result
    }

    balances: BankBalancesAddress(Address: $marketContract) {
      Result {
        Denom
        Amount
      }
    }
  }
`;

export function useMarket(): MappedQueryResult<RawVariables, RawData, Data> {
  const address = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      marketContract: address.moneyMarket.market,
    });
  }, [address.moneyMarket.market]);

  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000 * 60,
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
