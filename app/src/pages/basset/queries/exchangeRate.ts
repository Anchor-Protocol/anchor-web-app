import { gql, QueryResult, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useMemo } from 'react';

export interface StringifiedData {
  exchangeRate: {
    Result: string;
  };
}

export interface Data {
  /** number */
  actual_unbonded_amount: string;
  /** number */
  exchange_rate: string;
  /** datetime */
  last_index_modification: number;
  /** ? */
  last_processed_batch: number;
  /** datetime */
  last_unbonded_time: number;
  /** number */
  prev_hub_balance: string;
  /** number */
  total_bond_amount: string;
}

export function parseData(data: StringifiedData): Data {
  return JSON.parse(data.exchangeRate.Result);
}

export interface StringifiedVariables {
  bLunaHubContract: string;
  stateQuery: string;
}

export interface Variables {
  bLunaHubContract: string;
  stateQuery?: {
    state: {};
  };
}

export function stringifyVariables({
  bLunaHubContract,
  stateQuery = { state: {} },
}: Variables): StringifiedVariables {
  return {
    bLunaHubContract,
    stateQuery: JSON.stringify(stateQuery),
  };
}

export const query = gql`
  query bLunaExchangeRate($bLunaHubContract: String!, $stateQuery: String!) {
    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $stateQuery
    ) {
      Result
    }
  }
`;

export function useExchangeRate({
  bAsset,
}: {
  bAsset: string;
}): QueryResult<StringifiedData, StringifiedVariables> & {
  parsedData: Data | undefined;
} {
  const addressProvider = useAddressProvider();

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    fetchPolicy: 'cache-and-network',
    variables: stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub(bAsset),
      stateQuery: {
        state: {},
      },
    }),
  });

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data) : undefined),
    [result.data],
  );

  return {
    ...result,
    parsedData,
  };
}
