import { DateTime, Ratio, uLuna } from '@anchor-protocol/notation';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useMemo } from 'react';

export interface StringifiedData {
  exchangeRate: {
    Result: string;
  };
}

export interface Data {
  actual_unbonded_amount: uLuna<string>;
  exchange_rate: Ratio<string>;
  last_index_modification: DateTime;
  last_processed_batch: number;
  last_unbonded_time: DateTime;
  prev_hub_balance: uLuna<string>;
  total_bond_amount: uLuna<string>;
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

  const variables = useMemo(() => {
    return stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub(bAsset),
      stateQuery: {
        state: {},
      },
    });
  }, [addressProvider, bAsset]);

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    fetchPolicy: 'network-only',
    variables,
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
