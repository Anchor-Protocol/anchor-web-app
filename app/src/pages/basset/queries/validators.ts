import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useAddressProvider } from 'contexts/contract';
import { useService } from 'contexts/service';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
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

export const dataMap = createMap<RawData, Data>({
  validators: (_, { validators }) => {
    return validators.Result;
  },
  whitelistedValidators: (existing, { validators, whitelistedValidators }) => {
    const set: Set<string> = new Set(
      JSON.parse(whitelistedValidators.Result).validators,
    );

    return validators.Result.filter(({ OperatorAddress }) =>
      set.has(OperatorAddress),
    );
  },
});

export interface RawVariables {
  bLunaHubContract: string;
  whitelistedValidatorsQuery: string;
}

export interface Variables {
  bLunaHubContract: string;
  whitelistedValidatorsQuery?: {
    whitelisted_validators: {};
  };
}

export function mapVariables({
  bLunaHubContract,
  whitelistedValidatorsQuery = { whitelisted_validators: {} },
}: Variables): RawVariables {
  return {
    bLunaHubContract,
    whitelistedValidatorsQuery: JSON.stringify(whitelistedValidatorsQuery),
  };
}

export const query = gql`
  query __validators(
    $bLunaHubContract: String!
    $whitelistedValidatorsQuery: String!
  ) {
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
}): MappedQueryResult<RawVariables, RawData, Data> {
  const addressProvider = useAddressProvider();

  const { online } = useService();

  const variables = useMemo(() => {
    return mapVariables({
      bLunaHubContract: addressProvider.blunaHub(bAsset),
      whitelistedValidatorsQuery: {
        whitelisted_validators: {},
      },
    });
  }, [addressProvider, bAsset]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !online,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
