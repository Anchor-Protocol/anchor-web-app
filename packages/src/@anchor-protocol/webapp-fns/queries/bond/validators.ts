import { bluna, HumanAddr, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface StakingValidator {
  OperatorAddress: string;
  Description: {
    Moniker: string;
  };
}

export interface BondValidatorsRawData {
  validators: {
    Result: StakingValidator[];
  };
  hubWhitelistedValidators: WASMContractResult;
}

export interface BondValidatorsData {
  validators: StakingValidator[];
  whitelistedValidators: StakingValidator[];
  hubWhitelistedValidators: bluna.hub.WhitelistedValidatorsResponse;
}

export interface BondValidatorsRawVariables {
  bLunaHubContract: string;
  whitelistedValidatorsQuery: string;
}

export interface BondValidatorsVariables {
  bLunaHubContract: HumanAddr;
  whitelistedValidatorsQuery: bluna.hub.WhitelistedValidators;
}

// language=graphql
export const BOND_VALIDATORS_QUERY = `
  query (
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

    hubWhitelistedValidators: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $whitelistedValidatorsQuery
    ) {
      Result
    }
  }
`;

export interface BondValidatorsQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BondValidatorsVariables;
}

export async function bondValidatorsQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: BondValidatorsQueryParams): Promise<BondValidatorsData> {
  const rawData = await mantleFetch<
    BondValidatorsRawVariables,
    BondValidatorsRawData
  >(
    BOND_VALIDATORS_QUERY,
    {
      bLunaHubContract: variables.bLunaHubContract,
      whitelistedValidatorsQuery: JSON.stringify(
        variables.whitelistedValidatorsQuery,
      ),
    },
    `${mantleEndpoint}?bond--validators`,
  );

  const hubWhitelistedValidators: bluna.hub.WhitelistedValidatorsResponse =
    JSON.parse(rawData.hubWhitelistedValidators.Result);

  const filter: Set<string> = new Set(hubWhitelistedValidators.validators);

  const validators = rawData.validators.Result.sort(
    () => Math.random() - Math.random(),
  );
  const whitelistedValidators = validators.filter(({ OperatorAddress }) =>
    filter.has(OperatorAddress),
  );

  return {
    validators,
    whitelistedValidators,
    hubWhitelistedValidators,
  };
}
