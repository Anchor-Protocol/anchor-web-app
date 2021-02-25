import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { Ratio, uANC } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { parseResult } from 'queries/parseResult';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  govANCBalance: {
    Result: string;
  };

  govState: {
    Result: string;
  };

  govConfig: {
    Result: string;
  };
}

export interface Data {
  govANCBalance: {
    Result: string;
    balance: uANC<string>;
  };

  govState: {
    Result: string;
    poll_count: number;
    total_deposit: uANC<string>;
    total_share: uANC<string>;
  };

  govConfig: {
    Result: string;
    anchor_token: string;
    expiration_period: number;
    owner: string;
    proposal_deposit: uANC<string>;
    quorum: Ratio<string>;
    snapshot_period: number;
    threshold: Ratio<string>;
    timelock_period: number;
    voting_period: number;
  };
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
  ANCTokenBalanceQuery: {
    balance: {
      address: string;
    };
  };
  GovContract: string;
}

export function mapVariables({
  ANCTokenContract,
  ANCTokenBalanceQuery,
  GovContract,
}: Variables): RawVariables {
  return {
    ANCTokenContract,
    ANCTokenBalanceQuery: JSON.stringify(ANCTokenBalanceQuery),
    GovContract,
    GovStateQuery: JSON.stringify({
      state: {},
    }),
    GovConfigQuery: JSON.stringify({
      config: {},
    }),
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

  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      ANCTokenContract: addressProvider.token(),
      ANCTokenBalanceQuery: {
        balance: {
          address: addressProvider.gov(),
        },
      },
      GovContract: addressProvider.gov(),
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
