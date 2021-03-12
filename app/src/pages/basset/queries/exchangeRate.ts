import { bluna, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { parseResult } from '@anchor-protocol/web-contexts/queries/parseResult';
import { MappedQueryResult } from '@anchor-protocol/web-contexts/queries/types';
import { useQueryErrorHandler } from '@anchor-protocol/web-contexts/queries/useQueryErrorHandler';
import { useRefetch } from '@anchor-protocol/web-contexts/queries/useRefetch';
import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

export interface RawData {
  exchangeRate: WASMContractResult;
  parameters: WASMContractResult;
}

export interface Data {
  exchangeRate: WASMContractResult<bluna.hub.StateResponse>;
  parameters: WASMContractResult<bluna.hub.ParametersResponse>;
}

export const dataMap = createMap<RawData, Data>({
  exchangeRate: (existing, { exchangeRate }) => {
    return parseResult(existing.exchangeRate, exchangeRate.Result);
  },
  parameters: (existing, { parameters }) => {
    return parseResult(existing.parameters, parameters.Result);
  },
});

export interface RawVariables {
  bLunaHubContract: string;
  stateQuery: string;
  parametersQuery: string;
}

export interface Variables {
  bLunaHubContract: string;
  stateQuery: bluna.hub.State;
  parametersQuery: bluna.hub.Parameters;
}

export function mapVariables({
  bLunaHubContract,
  stateQuery,
  parametersQuery,
}: Variables): RawVariables {
  return {
    bLunaHubContract,
    stateQuery: JSON.stringify(stateQuery),
    parametersQuery: JSON.stringify(parametersQuery),
  };
}

export const query = gql`
  query __exchangeRate(
    $bLunaHubContract: String!
    $stateQuery: String!
    $parametersQuery: String!
  ) {
    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $stateQuery
    ) {
      Result
    }

    parameters: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $parametersQuery
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
  const { bluna } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      bLunaHubContract: bluna.hub,
      stateQuery: {
        state: {},
      },
      parametersQuery: {
        parameters: {},
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
