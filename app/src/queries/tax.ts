import { gql } from '@apollo/client';

export interface StringifiedData {
  tax_rate: {
    Height: string;
    Result: string;
  };
  tax_cap_denom: {
    Height: string;
    Result: string;
  };
}

export interface Data extends StringifiedData {}

export function parseData(data: StringifiedData): Data {
  return data;
}

export interface StringifiedVariables {
  Denom: string;
}

export type Variables = StringifiedVariables;

export function stringifyVariables(variables: Variables): StringifiedVariables {
  return variables;
}

export const query = gql`
  query($Denom: String!) {
    tax_rate: TreasuryTaxRate {
      Height
      Result
    }
    tax_cap_denom: TreasuryTaxCapDenom(Denom: $Denom) {
      Height
      Result
    }
  }
`;
