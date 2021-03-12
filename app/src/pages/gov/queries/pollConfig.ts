import { anchorToken, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@terra-dev/use-map';
import { gql, useQuery } from '@apollo/client';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import { parseResult } from '@anchor-protocol/web-contexts/queries/parseResult';
import { MappedQueryResult } from '@anchor-protocol/web-contexts/queries/types';
import { useQueryErrorHandler } from '@anchor-protocol/web-contexts/queries/useQueryErrorHandler';
import { useRefetch } from '@anchor-protocol/web-contexts/queries/useRefetch';
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
  const { serviceAvailable } = useService();

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
    skip: !serviceAvailable,
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
