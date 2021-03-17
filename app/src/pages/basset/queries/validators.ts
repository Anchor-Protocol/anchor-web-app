import { bluna, WASMContractResult } from '@anchor-protocol/types';
import { createMap, useMap } from '@terra-dev/use-map';
import { useContractAddress } from 'base/contexts/contract';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { gql, useQuery } from '@apollo/client';
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
  whitelistedValidators: WASMContractResult;
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
    const result: WASMContractResult<bluna.hub.WhitelistedValidatorsResponse> = JSON.parse(
      whitelistedValidators.Result,
    );

    const set: Set<string> = new Set(result.validators);

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
  whitelistedValidatorsQuery: bluna.hub.WhitelistedValidators;
}

export function mapVariables({
  bLunaHubContract,
  whitelistedValidatorsQuery,
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
  const { bluna } = useContractAddress();

  const variables = useMemo(() => {
    return mapVariables({
      bLunaHubContract: bluna.hub,
      whitelistedValidatorsQuery: {
        whitelisted_validators: {},
      },
    });
  }, [bluna.hub]);

  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
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
