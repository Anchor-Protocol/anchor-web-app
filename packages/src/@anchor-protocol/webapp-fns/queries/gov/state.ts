import {
  anchorToken,
  HumanAddr,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface GovStateRawData {
  govState: WASMContractResult;
  govConfig: WASMContractResult;
}

export interface GovStateData {
  govState: anchorToken.gov.StateResponse;
  govConfig: anchorToken.gov.ConfigResponse;
}

export interface GovStateRawVariables {
  govContract: string;
  govStateQuery: string;
  govConfigQuery: string;
}

export interface GovStateVariables {
  govContract: HumanAddr;
  govStateQuery: anchorToken.gov.State;
  govConfigQuery: anchorToken.gov.Config;
}

// language=graphql
export const GOV_STATE_QUERY = `
  query (
    $govContract: String!
    $govStateQuery: String!
    $govConfigQuery: String!
  ) {
    govState: WasmContractsContractAddressStore(
      ContractAddress: $govContract
      QueryMsg: $govStateQuery
    ) {
      Result
    }

    govConfig: WasmContractsContractAddressStore(
      ContractAddress: $govContract
      QueryMsg: $govConfigQuery
    ) {
      Result
    }
  }
`;

export interface GovStateQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: GovStateVariables;
}

export async function govStateQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: GovStateQueryParams): Promise<GovStateData> {
  const rawData = await mantleFetch<GovStateRawVariables, GovStateRawData>(
    GOV_STATE_QUERY,
    {
      govContract: variables.govContract,
      govConfigQuery: JSON.stringify(variables.govConfigQuery),
      govStateQuery: JSON.stringify(variables.govStateQuery),
    },
    `${mantleEndpoint}?gov--state`,
  );

  return {
    govConfig: JSON.parse(rawData.govConfig.Result),
    govState: JSON.parse(rawData.govState.Result),
  };
}
