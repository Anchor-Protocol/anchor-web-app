import { gql } from '@apollo/client';

export interface StringifiedData {
  bAssetBalance: {
    Result: string;
  };
}

export interface Data {
  bAssetBalance: {
    balance: string;
  };
}

export function parseData({ bAssetBalance }: StringifiedData): Data {
  return {
    bAssetBalance: JSON.parse(bAssetBalance.Result),
  };
}

export interface StringifiedVariables {
  bAssetTokenContract: string;
  bAssetBalanceQuery: string;
}

export interface Variables {
  bAssetTokenContract: string;
  bAssetBalanceQuery: {
    balance: {
      address: string;
    };
  };
}

export function stringifyVariables({
  bAssetTokenContract,
  bAssetBalanceQuery,
}: Variables): StringifiedVariables {
  return {
    bAssetTokenContract,
    bAssetBalanceQuery: JSON.stringify(bAssetBalanceQuery),
  };
}

export const query = gql`
  query bAssetBalance(
    $bAssetTokenContract: String!
    $bAssetBalanceQuery: String!
  ) {
    bAssetBalance: WasmContractsContractAddressStore(
      ContractAddress: $bAssetTokenContract
      QueryMsg: $bAssetBalanceQuery
    ) {
      Result
    }
  }
`;
