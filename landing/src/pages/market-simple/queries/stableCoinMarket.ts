import { moneyMarket, uUST, WASMContractResult } from '@anchor-protocol/types';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { gql, useQuery } from '@apollo/client';
import { createMap, useMap } from '@terra-dev/use-map';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  borrowRate: WASMContractResult;
  epochState: WASMContractResult;
}

export interface Data {
  borrowRate: WASMContractResult<moneyMarket.interestModel.BorrowRateResponse>;
  epochState: WASMContractResult<moneyMarket.overseer.EpochStateResponse>;
}

export const dataMap = createMap<RawData, Data>({
  borrowRate: (existing, { borrowRate }) => {
    return parseResult(existing.borrowRate, borrowRate.Result);
  },
  epochState: (existing, { epochState }) => {
    return parseResult(existing.epochState, epochState.Result);
  },
});

export interface RawVariables {
  interestContract: string;
  borrowRateQuery: string;
  overseerContract: string;
  epochStateQuery: string;
}

export interface Variables {
  interestContract: string;
  borrowRateQuery: moneyMarket.interestModel.BorrowRate;
  overseerContract: string;
  epochStateQuery: moneyMarket.overseer.EpochState;
}

export function mapVariables({
  interestContract,
  overseerContract,
  borrowRateQuery,
  epochStateQuery,
}: Variables): RawVariables {
  return {
    interestContract,
    borrowRateQuery: JSON.stringify(borrowRateQuery),
    overseerContract,
    epochStateQuery: JSON.stringify(epochStateQuery),
  };
}

export const query = gql`
  query __stableCoinMarket(
    $interestContract: String!
    $borrowRateQuery: String!
    $overseerContract: String!
    $epochStateQuery: String!
  ) {
    borrowRate: WasmContractsContractAddressStore(
      ContractAddress: $interestContract
      QueryMsg: $borrowRateQuery
    ) {
      Result
    }
    epochState: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $epochStateQuery
    ) {
      Result
    }
  }
`;

export function useStableCoinMarket({
  uUSD,
  state,
}: {
  uUSD: uUST | undefined;
  state: moneyMarket.market.StateResponse | undefined;
}): MappedQueryResult<RawVariables, RawData, Data> {
  const { contractAddress: address } = useAnchorWebapp();

  const variables = useMemo(() => {
    if (!uUSD || !state) return undefined;

    return mapVariables({
      interestContract: address.moneyMarket.interestModel,
      borrowRateQuery: {
        borrow_rate: {
          market_balance: uUSD,
          total_reserves: state.total_reserves,
          total_liabilities: state.total_liabilities,
        },
      },
      overseerContract: address.moneyMarket.overseer,
      epochStateQuery: {
        epoch_state: {},
      },
    });
  }, [
    address.moneyMarket.interestModel,
    address.moneyMarket.overseer,
    state,
    uUSD,
  ]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !variables,
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
