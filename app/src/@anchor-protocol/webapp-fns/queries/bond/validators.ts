import { bluna, HumanAddr, Num } from '@anchor-protocol/types';
import {
  hiveFetch,
  HiveQueryClient,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

export interface StakingValidator {
  OperatorAddress: string;
  Description: {
    Moniker: string;
  };
}

interface BondValidatorsWasmQuery {
  hubWhitelistedValidators: WasmQuery<
    bluna.hub.WhitelistedValidators,
    bluna.hub.WhitelistedValidatorsResponse
  >;
}

export type BondValidators = WasmQueryData<BondValidatorsWasmQuery> & {
  validators: StakingValidator[];
  whitelistedValidators: StakingValidator[];
};

interface BondValidatorsQueryResult {
  validators: {
    Result: StakingValidator[];
  };
}

// language=graphql
export const BOND_VALIDATORS_QUERY = `
  query {
    validators: StakingValidators {
      Result {
        OperatorAddress
        Description {
          Moniker
        }
      }
    }
  }
`;

// language=graphql
export const VALIDATOR_VOTING_POWER_QUERY = `
  query ($address: String!) {
    votingPower: StakingValidatorsValidatorAddr(ValidatorAddr: $address) {
      Result {
        Tokens
      }
    }
  }
`;

interface ValidatorVotingPowerQueryParams {
  address: string;
}

interface ValidatorVotingPowerQueryResult {
  votingPower: {
    Result: {
      Tokens: Num;
    };
  };
}

export async function bondValidatorsQuery(
  bLunaHubContract: HumanAddr,
  hiveQueryClient: HiveQueryClient,
): Promise<BondValidators> {
  const { validators: _validators, hubWhitelistedValidators } = await hiveFetch<
    BondValidatorsWasmQuery,
    {},
    BondValidatorsQueryResult
  >({
    ...hiveQueryClient,
    id: `bond--validators`,
    query: BOND_VALIDATORS_QUERY,
    variables: {},
    wasmQuery: {
      hubWhitelistedValidators: {
        contractAddress: bLunaHubContract,
        query: {
          whitelisted_validators: {},
        },
      },
    },
  });

  const filter: Set<string> = new Set(hubWhitelistedValidators.validators);

  const validators = _validators.Result.sort(
    () => Math.random() - Math.random(),
  );
  const whitelistedValidators = validators.filter(({ OperatorAddress }) =>
    filter.has(OperatorAddress),
  );

  const votingPowers = await Promise.all(
    whitelistedValidators.map(({ OperatorAddress }) => {
      return hiveFetch<
        {},
        ValidatorVotingPowerQueryParams,
        ValidatorVotingPowerQueryResult
      >({
        ...hiveQueryClient,
        id: `bond-validator-voting-power=${OperatorAddress}`,
        variables: {
          address: OperatorAddress,
        },
        wasmQuery: {},
        query: VALIDATOR_VOTING_POWER_QUERY,
      }).then(({ votingPower }) => {
        return votingPower.Result.Tokens;
      });
    }),
  );

  const sortedValidators = whitelistedValidators
    .map((validator, i) => [votingPowers[i], validator] as const)
    .sort(([a], [b]) => +a - +b)
    .map(([, validator]) => validator);

  return {
    validators,
    whitelistedValidators: sortedValidators,
    hubWhitelistedValidators,
  };
}
