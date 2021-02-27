import { bluna, WASMContractResult } from '@anchor-protocol/types';
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
  exchangeRate: WASMContractResult;
}

export interface Data {
  exchangeRate: WASMContractResult<bluna.hub.StateResponse>;
}

export const dataMap = createMap<RawData, Data>({
  exchangeRate: (existing, { exchangeRate }) => {
    return parseResult(existing.exchangeRate, exchangeRate.Result);
  },
});

export interface RawVariables {
  bLunaHubContract: string;
  stateQuery: string;
}

export interface Variables {
  bLunaHubContract: string;
  stateQuery: bluna.hub.State;
}

export function mapVariables({
  bLunaHubContract,
  stateQuery,
}: Variables): RawVariables {
  return {
    bLunaHubContract,
    stateQuery: JSON.stringify(stateQuery),
  };
}

export const query = gql`
  query __exchangeRate($bLunaHubContract: String!, $stateQuery: String!) {
    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $stateQuery
    ) {
      Result
    }
  }
`;

export function useExchangeRate({
  bAsset,
}: {
  bAsset: string;
}): MappedQueryResult<RawVariables, RawData, Data> {
  const { online } = useService();

  const { bluna } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      bLunaHubContract: bluna.hub,
      stateQuery: {
        state: {},
      },
    });
  }, [bluna.hub]);

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
