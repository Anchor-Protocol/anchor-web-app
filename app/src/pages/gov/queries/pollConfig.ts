import { anchorToken, WASMContractResult } from '@anchor-protocol/types';
import { gql, useQuery } from '@apollo/client';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { parseResult } from 'base/queries/parseResult';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  pollConfig: WASMContractResult;
}

export interface Data {
  pollConfig: WASMContractResult<anchorToken.gov.ConfigResponse>;
}

export const dataMap = createMap<RawData, Data>({
  pollConfig: (existing, { pollConfig }) => {
    return parseResult(existing.pollConfig, pollConfig.Result);
  },
});

export interface RawVariables {
  govAddress: string;
  configQuery: string;
}

export interface Variables {
  govAddress: string;
  configQuery: anchorToken.gov.Config;
}

export function mapVariables({
  govAddress,
  configQuery,
}: Variables): RawVariables {
  return {
    govAddress,
    configQuery: JSON.stringify(configQuery),
  };
}

export const query = gql`
  query __pollConfig($govAddress: String!, $configQuery: String!) {
    pollConfig: WasmContractsContractAddressStore(
      ContractAddress: $govAddress
      QueryMsg: $configQuery
    ) {
      Result
    }
  }
`;

export function usePollConfig(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const address = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      govAddress: address.anchorToken.gov,
      configQuery: {
        config: {},
      },
    });
  }, [address.anchorToken.gov]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    //pollInterval: 1000 * 60,
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
