import { anchorToken, WASMContractResult } from '@anchor-protocol/types';
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
  govConfig: WASMContractResult;
}

export interface Data {
  govConfig: WASMContractResult<anchorToken.gov.ConfigResponse>;
}

export const dataMap = createMap<RawData, Data>({
  govConfig: (existing, { govConfig }) => {
    return parseResult(existing.govConfig, govConfig.Result);
  },
});

export interface RawVariables {
  Gov_contract: string;
  GovConfigQuery: string;
}

export interface Variables {
  Gov_contract: string;
  GovConfigQuery: anchorToken.gov.Config;
}

export function mapVariables({
  Gov_contract,
  GovConfigQuery,
}: Variables): RawVariables {
  return {
    Gov_contract,
    GovConfigQuery: JSON.stringify(GovConfigQuery),
  };
}

export const query = gql`
  query __govConfig($Gov_contract: String!, $GovConfigQuery: String!) {
    govConfig: WasmContractsContractAddressStore(
      ContractAddress: $Gov_contract
      QueryMsg: $GovConfigQuery
    ) {
      Result
    }
  }
`;

export function useGovConfig(): MappedQueryResult<RawVariables, RawData, Data> {
  const { serviceAvailable } = useService();

  const { anchorToken } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      Gov_contract: anchorToken.gov,
      GovConfigQuery: {
        config: {},
      },
    });
  }, [anchorToken.gov]);

  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
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
