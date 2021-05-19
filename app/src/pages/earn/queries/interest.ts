import {
  HumanAddr,
  moneyMarket,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

export interface RawData {
  marketStatus: WASMContractResult;
}

export interface Data {
  marketStatus: WASMContractResult<moneyMarket.overseer.EpochStateResponse>;
}

export const dataMap = createMap<RawData, Data>({
  marketStatus: (existing, { marketStatus }) => {
    return parseResult(existing.marketStatus, marketStatus.Result);
  },
});

export interface RawVariables {
  overseerContract: string;
  overseerEpochState: string;
}

export interface Variables {
  overseerContract: HumanAddr;
}

export function mapVariables({ overseerContract }: Variables): RawVariables {
  return {
    overseerContract,
    overseerEpochState: JSON.stringify({
      epoch_state: {},
    } as moneyMarket.overseer.EpochState),
  };
}

export const query = gql`
  query __interest($overseerContract: String!, $overseerEpochState: String!) {
    marketStatus: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerEpochState
    ) {
      Result
    }
  }
`;

export function useInterest(): MappedQueryResult<RawVariables, RawData, Data> {
  const { moneyMarket } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      overseerContract: moneyMarket.overseer,
    });
  }, [moneyMarket.overseer]);

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
    pollInterval: 1000 * 60 * 10,
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
