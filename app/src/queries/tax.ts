import { Ratio, uUST } from '@anchor-protocol/notation';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useMemo } from 'react';

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

export interface Data {
  taxRate: Ratio;
  maxTaxUUSD: uUST;
}

export function parseData({ tax_rate, tax_cap_denom }: StringifiedData): Data {
  return {
    taxRate: tax_rate.Result as Ratio,
    maxTaxUUSD: tax_cap_denom.Result as uUST,
  };
}

export type StringifiedVariables = {};

export type Variables = StringifiedVariables;

export function stringifyVariables(variables: Variables): StringifiedVariables {
  return variables;
}

export const query = gql`
  query {
    tax_rate: TreasuryTaxRate {
      Height
      Result
    }
    tax_cap_denom: TreasuryTaxCapDenom(Denom: "uusd") {
      Height
      Result
    }
  }
`;

export function useTax(): QueryResult<StringifiedData, StringifiedVariables> & {
  parsedData: Data | undefined;
} {
  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    fetchPolicy: 'cache-and-network',
    variables: stringifyVariables({}),
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
