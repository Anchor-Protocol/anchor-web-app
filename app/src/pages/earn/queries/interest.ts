import { Num, Ratio } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  marketStatus: {
    Result: string;
  };
}

export interface Data {
  marketStatus: {
    Result: string;
    deposit_rate: Ratio<string>;
    last_executed_height: number;
    prev_a_token_supply: Num<string>;
    prev_exchange_rate: Ratio<string>;
  };
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
  overseerContract: string;
  overseerEpochState: {
    epoch_state: {};
  };
}

export function mapVariables({
  overseerContract,
  overseerEpochState,
}: Variables): RawVariables {
  return {
    overseerContract,
    overseerEpochState: JSON.stringify(overseerEpochState),
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

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      overseerContract: addressProvider.overseer(''),
      overseerEpochState: {
        epoch_state: {},
      },
    });
  }, [addressProvider]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !online,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
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
