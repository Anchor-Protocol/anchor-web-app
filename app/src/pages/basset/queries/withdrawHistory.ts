import { useQuerySubscription } from '@anchor-protocol/use-broadcastable-query';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useMemo } from 'react';
import { Data as WithdrawableData } from './withdrawable';

export interface StringifiedData {
  allHistory: {
    Result: string;
  };
  parameters: {
    Result: string;
  };
}

export interface Data {
  allHistory: {
    history: {
      batch_id: number;
      time: number;
      amount: string;
      withdraw_rate: number;
      released: boolean;
    }[];
  };
  parameters: {
    epoch_period: number;
    underlying_coin_denom: string;
    unbonding_period: number;
    peg_recovery_fee: string;
    er_threshold: string;
    reward_denom: string;
  };
}

export function parseData({ allHistory, parameters }: StringifiedData): Data {
  return {
    allHistory: JSON.parse(allHistory.Result),
    parameters: JSON.parse(parameters.Result),
  };
}

export interface StringifiedVariables {
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

export function stringifyVariables({
  bLunaHubContract,
  allHistory,
  parameters,
}: Variables): StringifiedVariables {
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
  withdrawable,
}: {
  withdrawable?: WithdrawableData;
}): QueryResult<StringifiedData, StringifiedVariables> & {
  parsedData: Data | undefined;
} {
  const addressProvider = useAddressProvider();

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    skip: !withdrawable || withdrawable.withdrawRequestsStartFrom < 0,
    fetchPolicy: 'cache-and-network',
    variables: stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub('bluna'),
      allHistory: {
        all_history: {
          start_from: withdrawable?.withdrawRequestsStartFrom ?? 0,
          limit: 100,
        },
      },
      parameters: {
        parameters: {},
      },
    }),
  });
  
  useQuerySubscription(
    (id, event) => {
      if (event === 'done') {
        result.refetch();
      }
    },
    [result.refetch],
  );

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data) : undefined),
    [result.data],
  );

  return {
    ...result,
    parsedData,
  };
}
