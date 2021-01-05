import { gql } from '@apollo/client';

export interface StringifiedData {
  BankBalancesAddress: {
    Result: {
      Denom: string;
      Amount: string;
    }[];
  };
}

export type Data = Map<
  string,
  StringifiedData['BankBalancesAddress']['Result'][number]
>;

export function parseData(data: StringifiedData): Data {
  return data.BankBalancesAddress.Result.reduce((map, balance) => {
    map.set(balance.Denom, balance);
    return map;
  }, new Map());
}

export interface StringifiedVariables {
  userAddress: string;
}

export type Variables = StringifiedVariables;

export function stringifyVariables(variables: Variables): StringifiedVariables {
  return variables;
}

export const query = gql`
  query userBankBalances($userAddress: String!) {
    BankBalancesAddress(Address: $userAddress) {
      Result {
        Denom
        Amount
      }
    }
  }
`;
