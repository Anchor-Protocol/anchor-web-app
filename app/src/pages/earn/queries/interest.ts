import { useWallet } from '@anchor-protocol/wallet-provider';
import { gql, QueryResult, useQuery } from '@apollo/client';
import big from 'big.js';
import { useAddressProvider } from 'contexts/contract';
import { useMemo } from 'react';

export interface StringifiedData {
  marketStatus: {
    Result: string;
  };
}

export interface Data {
  marketStatus: {
    deposit_rate: string;
    last_executed_height: number;
    prev_a_token_supply: string;
    prev_exchange_rate: string;
  };
  currentAPY: string;
}

export function parseData({ marketStatus }: StringifiedData): Data {
  const parsedMarketStatus: Data['marketStatus'] = JSON.parse(
    marketStatus.Result,
  );
  const BLOCKS_PER_YEAR = 5256666;

  return {
    marketStatus: parsedMarketStatus,
    currentAPY: big(parsedMarketStatus.deposit_rate)
      .mul(BLOCKS_PER_YEAR)
      .toString(),
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

//export function useInterest({}: Pick<Variables, ''>): QueryResult<
//  StringifiedData,
//  StringifiedVariables
//> & { parsedData: Data | undefined } {
//  const addressProvider = useAddressProvider();
//  const { status } = useWallet();
//
//  const { data, ...result } = useQuery<StringifiedData, StringifiedVariables>(
//    query,
//    {
//      skip: status.status !== 'ready',
//      fetchPolicy: 'cache-and-network',
//      variables: stringifyVariables({
//        overseerContract
//      }),
//    },
//  );
//
//  const parsedData = useMemo(
//    () => (result.data ? parseData(result.data) : undefined),
//    [result.data],
//  );
//
//  return {
//    ...result,
//    parsedData,
//  };
//}
