import {
  HumanAddr,
  moneyMarket,
  WASMContractResult,
} from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
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
  const { online } = useService();

  const { moneyMarket } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      overseerContract: moneyMarket.overseer,
    });
  }, [moneyMarket.overseer]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !online,
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
