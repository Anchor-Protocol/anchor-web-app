import { anchorToken, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface GovConfigRawData {
  govConfig: WASMContractResult;
}

export interface GovConfigData {
  govConfig: anchorToken.gov.ConfigResponse;
}

export interface GovConfigRawVariables {
  govContract: string;
  configQuery: string;
}

export interface GovConfigVariables {
  govContract: string;
  configQuery: anchorToken.gov.Config;
}

// language=graphql
export const GOV_CONFIG_QUERY = `
  query ($govContract: String!, $configQuery: String!) {
    govConfig: WasmContractsContractAddressStore(
      ContractAddress: $govContract
      QueryMsg: $configQuery
    ) {
      Result
    }
  }
`;

export interface GovConfigQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: GovConfigVariables;
}

export async function govConfigQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: GovConfigQueryParams): Promise<GovConfigData> {
  const rawData = await mantleFetch<GovConfigRawVariables, GovConfigRawData>(
    GOV_CONFIG_QUERY,
    {
      govContract: variables.govContract,
      configQuery: JSON.stringify(variables.configQuery),
    },
    `${mantleEndpoint}?gov--config`,
  );

  return {
    govConfig: JSON.parse(rawData.govConfig.Result),
  };
}
