import { useSubscription } from '@terra-dev/broadcastable-operation';
import type { uANC } from '@anchor-protocol/types';
import { anchorToken, cw20, WASMContractResult } from '@anchor-protocol/types';
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
  govANCBalance: WASMContractResult;
  govState: WASMContractResult;
  govConfig: WASMContractResult;
}

export interface Data {
  govANCBalance: WASMContractResult<cw20.BalanceResponse<uANC>>;
  govState: WASMContractResult<anchorToken.gov.StateResponse>;
  govConfig: WASMContractResult<anchorToken.gov.ConfigResponse>;
}

export const dataMap = createMap<RawData, Data>({
  govANCBalance: (existing, { govANCBalance }) => {
    return parseResult(existing.govANCBalance, govANCBalance.Result);
  },

  govState: (existing, { govState }) => {
    return parseResult(existing.govState, govState.Result);
  },

  govConfig: (existing, { govConfig }) => {
    return parseResult(existing.govConfig, govConfig.Result);
  },
});

export interface RawVariables {
  ANCTokenContract: string;
  ANCTokenBalanceQuery: string;
  GovContract: string;
  GovStateQuery: string;
  GovConfigQuery: string;
}

export interface Variables {
  ANCTokenContract: string;
  GovContract: string;
  ANCTokenBalanceQuery: cw20.Balance;
  GovStateQuery: anchorToken.gov.State;
  GovConfigQuery: anchorToken.gov.Config;
}

export function mapVariables({
  ANCTokenContract,
  ANCTokenBalanceQuery,
  GovContract,
  GovStateQuery,
  GovConfigQuery,
}: Variables): RawVariables {
  return {
    ANCTokenContract,
    ANCTokenBalanceQuery: JSON.stringify(ANCTokenBalanceQuery),
    GovContract,
    GovStateQuery: JSON.stringify(GovStateQuery),
    GovConfigQuery: JSON.stringify(GovConfigQuery),
  };
}

export const query = gql`
  query __totalStaked(
    $ANCTokenContract: String!
    $ANCTokenBalanceQuery: String!
    $GovContract: String!
    $GovStateQuery: String!
    $GovConfigQuery: String!
  ) {
    govANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANCTokenContract
      QueryMsg: $ANCTokenBalanceQuery
    ) {
      Result
    }

    govState: WasmContractsContractAddressStore(
      ContractAddress: $GovContract
      QueryMsg: $GovStateQuery
    ) {
      Result
    }

    govConfig: WasmContractsContractAddressStore(
      ContractAddress: $GovContract
      QueryMsg: $GovConfigQuery
    ) {
      Result
    }
  }
`;

export function useTotalStaked(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { serviceAvailable } = useService();

  const { cw20, anchorToken } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      ANCTokenContract: cw20.ANC,
      ANCTokenBalanceQuery: {
        balance: {
          address: anchorToken.gov,
        },
      },
      GovStateQuery: {
        state: {},
      },
      GovConfigQuery: {
        config: {},
      },
      GovContract: anchorToken.gov,
    });
  }, [anchorToken.gov, cw20.ANC]);

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
    pollInterval: 1000 * 60,
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  useSubscription((id, event) => {
    if (event === 'done') {
      _refetch();
    }
  });

  return {
    ...result,
    data,
    refetch,
  };
}
