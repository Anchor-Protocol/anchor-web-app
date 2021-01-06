import { gql } from '@apollo/client';

export interface StringifiedData {
  exchangeRate: {
    Result: string;
  };
}

export interface Data {
  exchangeRate: {
    Result: {
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
    };
  };
}

export function parseData({ exchangeRate: { Result } }: StringifiedData): Data {
  return {
    exchangeRate: {
      Result: JSON.parse(Result),
    },
  };
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
