import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { DateTime, Ratio, ubLuna } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  allHistory: {
    Result: string;
  };
  parameters: {
    Result: string;
  };
}

export interface Data {
  allHistory: {
    Result: string;
    history: {
      batch_id: number;
      time: DateTime;
      amount: ubLuna<string>;
      withdraw_rate: Ratio<string>;
      released: boolean;
    }[];
  };
  parameters: {
    Result: string;
    epoch_period: number;
    underlying_coin_denom: string;
    unbonding_period: number;
    peg_recovery_fee: ubLuna<string>;
    er_threshold: Ratio<string>;
    reward_denom: string;
  };
}

export const dataMap = createMap<RawData, Data>({
  allHistory: (existing, { allHistory }) => {
    return existing.allHistory?.Result === allHistory.Result
      ? existing.allHistory
      : { ...allHistory, ...JSON.parse(allHistory.Result) };
  },
  parameters: (existing, { parameters }) => {
    return existing.parameters?.Result === parameters.Result
      ? existing.parameters
      : { ...parameters, ...JSON.parse(parameters.Result) };
  },
});

export interface RawVariables {
  bLunaHubContract: string;
  allHistory: string;
  parameters: string;
}

export interface Variables {
  bLunaHubContract: string;
  allHistory: {
    all_history: {
      start_from: number;
      limit: number;
    };
  };
  parameters: {
    parameters: {};
  };
}

export function mapVariables({
  bLunaHubContract,
  allHistory,
  parameters,
}: Variables): RawVariables {
  return {
    bLunaHubContract,
    allHistory: JSON.stringify(allHistory),
    parameters: JSON.stringify(parameters),
  };
}

export const query = gql`
  query withdrawAllHistory(
    $bLunaHubContract: String!
    $allHistory: String!
    $parameters: String!
  ) {
    allHistory: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $allHistory
    ) {
      Result
    }

    parameters: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $parameters
    ) {
      Result
    }
  }
`;

export function useWithdrawHistory({
  withdrawRequestsStartFrom,
}: {
  withdrawRequestsStartFrom?: number;
}): MappedQueryResult<RawVariables, RawData, Data> {
  const addressProvider = useAddressProvider();

  const variables = useMemo(() => {
    return mapVariables({
      bLunaHubContract: addressProvider.bAssetHub('bluna'),
      allHistory: {
        all_history: {
          start_from: withdrawRequestsStartFrom ?? 0,
          limit: 100,
        },
      },
      parameters: {
        parameters: {},
      },
    });
  }, [addressProvider, withdrawRequestsStartFrom]);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip:
      typeof withdrawRequestsStartFrom !== 'number' ||
      withdrawRequestsStartFrom < 0,
    fetchPolicy: 'network-only',
    variables,
  });

  useSubscription((id, event) => {
    if (event === 'done') {
      _refetch();
    }
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
