import {
  anchorToken,
  HumanAddr,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface AncLpStakingStateRawData {
  lpStakingState: WASMContractResult;
}

export interface AncLpStakingStateData {
  lpStakingState: anchorToken.staking.StateResponse;
}

export interface AncLpStakingStateRawVariables {
  ancStakingContract: string;
  lpStakingStateQuery: string;
}

export interface AncLpStakingStateVariables {
  ancStakingContract: HumanAddr;
  lpStakingStateQuery: anchorToken.staking.State;
}

// language=graphql
export const ANC_LP_STAKING_STATE_QUERY = `
  query (
    $ancStakingContract: String!
    $lpStakingStateQuery: String!
  ) {
    lpStakingState: WasmContractsContractAddressStore(
      ContractAddress: $ancStakingContract
      QueryMsg: $lpStakingStateQuery
    ) {
      Result
    }
  }
`;

export interface AncLpStakingStateQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: AncLpStakingStateVariables;
}

export async function ancLpStakingStateQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: AncLpStakingStateQueryParams): Promise<AncLpStakingStateData> {
  const rawData = await mantleFetch<
    AncLpStakingStateRawVariables,
    AncLpStakingStateRawData
  >(
    ANC_LP_STAKING_STATE_QUERY,
    {
      ancStakingContract: variables.ancStakingContract,
      lpStakingStateQuery: JSON.stringify(variables.lpStakingStateQuery),
    },
    `${mantleEndpoint}?anc--lp-staking-state`,
  );

  return {
    lpStakingState: JSON.parse(rawData.lpStakingState.Result),
  };
}
