import type { Rate, uUST } from '@anchor-protocol/types';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface GovConfig {
  Result: string;
  anchor_token: string;
  expiration_period: number;
  owner: string;
  proposal_deposit: uUST<string>;
  quorum: Rate<string>;
  snapshot_period: number;
  threshold: Rate<string>;
  timelock_period: number;
  voting_period: number;
}

export interface RawData {
  govConfig: {
    Result: string;
  };
}

export interface Data {
  govConfig: GovConfig;
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
}

export function mapVariables({ Gov_contract }: Variables): RawVariables {
  return {
    Gov_contract,
    GovConfigQuery: JSON.stringify({
      config: {},
    }),
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

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      Gov_contract: addressProvider.gov(),
    });
  }, [addressProvider]);

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
