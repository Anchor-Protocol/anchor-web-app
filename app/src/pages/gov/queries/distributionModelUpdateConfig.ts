import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import { parseResult } from '@anchor-protocol/web-contexts/queries/parseResult';
import { MappedQueryResult } from '@anchor-protocol/web-contexts/queries/types';
import { useQueryErrorHandler } from '@anchor-protocol/web-contexts/queries/useQueryErrorHandler';
import { useRefetch } from '@anchor-protocol/web-contexts/queries/useRefetch';
import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { moneyMarket, WASMContractResult } from '@anchor-protocol/types';

export interface RawData {
  distributionModelConfig: WASMContractResult;
}

export interface Data {
  distributionModelConfig: WASMContractResult<moneyMarket.distributionModel.ConfigResponse>;
}

export const dataMap = createMap<RawData, Data>({
  distributionModelConfig: (existing, { distributionModelConfig }) => {
    return parseResult(
      existing.distributionModelConfig,
      distributionModelConfig.Result,
    );
  },
});

export interface RawVariables {
  distributionModelContract: string;
  distributionModelConfigQuery: string;
}

export interface Variables {
  distributionModelContract: string;
  distributionModelConfigQuery: moneyMarket.distributionModel.Config;
}

export function mapVariables({
  distributionModelContract,
  distributionModelConfigQuery,
}: Variables): RawVariables {
  return {
    distributionModelContract,
    distributionModelConfigQuery: JSON.stringify(distributionModelConfigQuery),
  };
}

export const query = gql`
  query __distributionModelConfig(
    $distributionModelContract: String!
    $distributionModelConfigQuery: String!
  ) {
    distributionModelConfig: WasmContractsContractAddressStore(
      ContractAddress: $distributionModelContract
      QueryMsg: $distributionModelConfigQuery
    ) {
      Result
    }
  }
`;

export function useDistributionModelConfig(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { serviceAvailable } = useService();

  const address = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      distributionModelContract: address.moneyMarket.distributionModel,
      distributionModelConfigQuery: {
        config: {},
      },
    });
  }, [address.moneyMarket.distributionModel]);

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
