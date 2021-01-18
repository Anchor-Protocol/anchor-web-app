import { gql, QueryResult, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useMemo } from 'react';

export interface StringifiedData {
  oraclePrice: {
    Result: string;
  };
}

export interface Data {
  oraclePrice: {
    rate: string;
    last_updated_base: number;
    last_updated_quote: number;
  };
}

export function parseData({ oraclePrice }: StringifiedData): Data {
  return {
    oraclePrice: JSON.parse(oraclePrice.Result).rate,
  };
}

export interface StringifiedVariables {
  oracleContractAddress: string;
  oracleQuery: string;
}

export interface Variables {
  oracleContractAddress: string;
  oracleQuery: {
    price: {
      base: string;
      quote: string;
    };
  };
}

export function stringifyVariables({
  oracleContractAddress,
  oracleQuery,
}: Variables): StringifiedVariables {
  return {
    oracleContractAddress,
    oracleQuery: JSON.stringify(oracleQuery),
  };
}

export const query = gql`
  query($oracleContractAddress: String!, $oracleQuery: String!) {
    oraclePrice: WasmContractsContractAddressStore(
      ContractAddress: $oracleContractAddress
      QueryMsg: $oracleQuery
    ) {
      Result
    }
  }
`;

export function useOracle(): QueryResult<
  StringifiedData,
  StringifiedVariables
> & { parsedData: Data | undefined } {
  const addressProvider = useAddressProvider();

  const result = useQuery<StringifiedData, StringifiedVariables>(query, {
    fetchPolicy: 'cache-and-network',
    variables: stringifyVariables({
      oracleContractAddress: addressProvider.oracle(),
      oracleQuery: {
        price: {
          base: addressProvider.bAssetToken('ubluna'),
          quote: 'uusd',
        },
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
