import { gql } from '@apollo/client';

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
    Result: {
      OperatorAddress: string;
      Description: {
        Moniker: string;
      };
    }[];
  };
  whitelistedValidators: {
    Result: {
      OperatorAddress: string;
      Description: {
        Moniker: string;
      };
    }[];
  };
}

export function parseData({
  validators,
  whitelistedValidators,
}: StringifiedData): Data {
  const set: Set<string> = new Set(
    JSON.parse(whitelistedValidators.Result).validators,
  );

  return {
    validators,
    whitelistedValidators: {
      Result: validators.Result.filter(({ OperatorAddress }) =>
        set.has(OperatorAddress),
      ),
    },
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
