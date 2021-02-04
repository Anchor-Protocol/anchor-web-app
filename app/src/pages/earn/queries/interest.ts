import { Num, Ratio } from '@anchor-protocol/notation';
import { gql, QueryResult, useQuery } from '@apollo/client';
import big from 'big.js';
import { useAddressProvider } from 'contexts/contract';
import { useNetConstants } from 'contexts/net-contants';
import { useMemo } from 'react';

export interface StringifiedData {
  marketStatus: {
    Result: string;
  };
}

export interface Data {
  marketStatus: {
    deposit_rate: Ratio<string>;
    last_executed_height: number;
    prev_a_token_supply: Num<string>;
    prev_exchange_rate: Ratio<string>;
  };
  currentAPY: Ratio<string>;
}

export function parseData(
  { marketStatus }: StringifiedData,
  blocksPerYear: number,
): Data {
  const parsedMarketStatus: Data['marketStatus'] = JSON.parse(
    marketStatus.Result,
  );

  return {
    marketStatus: parsedMarketStatus,
    currentAPY: big(parsedMarketStatus.deposit_rate)
      .mul(blocksPerYear)
      .toString() as Ratio,
  };
}

export interface StringifiedVariables {
  overseerContract: string;
  overseerEpochState: string;
}

export interface Variables {
  overseerContract: string;
  overseerEpochState: {
    epoch_state: {};
  };
}

export function stringifyVariables({
  overseerContract,
  overseerEpochState,
}: Variables): StringifiedVariables {
  return {
    overseerContract,
    overseerEpochState: JSON.stringify(overseerEpochState),
  };
}

export const query = gql`
  query depositRate($overseerContract: String!, $overseerEpochState: String!) {
    marketStatus: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerEpochState
    ) {
      Result
    }
  }
`;

export function useInterest(): QueryResult<
  StringifiedData,
  StringifiedVariables
> & { parsedData: Data | undefined } {
  const addressProvider = useAddressProvider();

  const { blocksPerYear } = useNetConstants();

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 1000 * 60,
    variables: stringifyVariables({
      overseerContract: addressProvider.overseer(''),
      overseerEpochState: {
        epoch_state: {},
      },
    }),
  });

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data, blocksPerYear) : undefined),
    [blocksPerYear, result.data],
  );

  return {
    ...result,
    parsedData,
  };
}
