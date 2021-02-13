import { Ratio, uUST } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { MappedQueryResult } from 'queries/types';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
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

export const dataMap = createMap<RawData, Data>({
  taxRate: (_, { tax_rate }) => {
    return tax_rate.Result as Ratio;
  },
  maxTaxUUSD: (_, { tax_cap_denom }) => {
    return tax_cap_denom.Result as uUST;
  },
});

export type RawVariables = {};

export type Variables = RawVariables;

export function mapVariables(variables: Variables): RawVariables {
  return variables;
}

export const query = gql`
  query __tax {
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

export function useTax(): MappedQueryResult<RawVariables, RawData, Data> {
  const variables = useMemo(() => {
    return mapVariables({});
  }, []);

  const { data: _data, refetch: _refetch, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    fetchPolicy: 'network-only',
    variables,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
