import { bluna } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface StakingValidator {
  OperatorAddress: string;
  Description: {
    Moniker: string;
  };
}

export interface BondValidatorsWasmQuery {
  hubWhitelistedValidators: WasmQuery<
    bluna.hub.WhitelistedValidators,
    bluna.hub.WhitelistedValidatorsResponse
  >;
}

export type BondValidators = WasmQueryData<BondValidatorsWasmQuery> & {
  validators: StakingValidator[];
  whitelistedValidators: StakingValidator[];
};

export interface BondValidatorsQueryResult {
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

export type BondValidatorsQueryParams = Omit<
  MantleParams<BondValidatorsWasmQuery>,
  'query' | 'variables'
>;

export async function bondValidatorsQuery({
  mantleEndpoint,
  ...params
}: BondValidatorsQueryParams): Promise<BondValidators> {
  const { validators: _validators, hubWhitelistedValidators } = await mantle<
    BondValidatorsWasmQuery,
    {},
    BondValidatorsQueryResult
  >({
    mantleEndpoint: `${mantleEndpoint}?bond--validators`,
    query: BOND_VALIDATORS_QUERY,
    variables: {},
    ...params,
  });

  const filter: Set<string> = new Set(hubWhitelistedValidators.validators);

  const validators = _validators.Result.sort(
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
