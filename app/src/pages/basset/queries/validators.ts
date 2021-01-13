import { gql, QueryResult, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useMemo } from 'react';

export interface StringifiedData {
  validators: {
    Result: {
      OperatorAddress: string;
      Description: {
        Moniker: string;
      };
    }[];
  };
  whitelistedValidators: {
    Result: string;
  };
}

export interface Data {
  validators: {
    OperatorAddress: string;
    Description: {
      Moniker: string;
    };
  }[];
  whitelistedValidators: {
    OperatorAddress: string;
    Description: {
      Moniker: string;
    };
  }[];
}

export function parseData({
  validators,
  whitelistedValidators,
}: StringifiedData): Data {
  const set: Set<string> = new Set(
    JSON.parse(whitelistedValidators.Result).validators,
  );

  return {
    validators: validators.Result,
    whitelistedValidators: validators.Result.filter(({ OperatorAddress }) =>
      set.has(OperatorAddress),
    ),
  };
}

export interface StringifiedVariables {
  bLunaHubContract: string;
  whitelistedValidatorsQuery: string;
}

export interface Variables {
  bLunaHubContract: string;
  whitelistedValidatorsQuery?: {
    whitelisted_validators: {};
  };
}

export function stringifyVariables({
  bLunaHubContract,
  whitelistedValidatorsQuery = { whitelisted_validators: {} },
}: Variables): StringifiedVariables {
  return {
    bLunaHubContract,
    whitelistedValidatorsQuery: JSON.stringify(whitelistedValidatorsQuery),
  };
}

export const query = gql`
  query($bLunaHubContract: String!, $whitelistedValidatorsQuery: String!) {
    validators: StakingValidators {
      Result {
        OperatorAddress
        Description {
          Moniker
        }
      }
    }

    whitelistedValidators: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $whitelistedValidatorsQuery
    ) {
      Result
    }
  }
`;

export function useValidators({
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
      whitelistedValidatorsQuery: {
        whitelisted_validators: {},
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
