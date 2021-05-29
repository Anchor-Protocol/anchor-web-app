import {
  HumanAddr,
  moneyMarket,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface GovDistributionModelUpdateConfigRawData {
  distributionModelConfig: WASMContractResult;
}

export interface GovDistributionModelUpdateConfigData {
  distributionModelConfig: moneyMarket.distributionModel.ConfigResponse;
}

export interface GovDistributionModelUpdateConfigRawVariables {
  distributionModelContract: string;
  distributionModelConfigQuery: string;
}

export interface GovDistributionModelUpdateConfigVariables {
  distributionModelContract: HumanAddr;
  distributionModelConfigQuery: moneyMarket.distributionModel.Config;
}

// language=graphql
export const GOV_DISTRIBUTION_MODEL_UPDATE_CONFIG_QUERY = `
  query (
    $distributionModelContract: String!
    $distributionModelConfigQuery: String!
  ) {
    distributionModelConfig: WasmContractsContractAddressStore(
      ContractAddress: $distributionModelContract
      QueryMsg: $distributionModelConfigQuery
    ) {
      Result
    }
  }
`;

export interface GovDistributionModelUpdateConfigQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: GovDistributionModelUpdateConfigVariables;
}

export async function govDistributionModelUpdateConfigQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: GovDistributionModelUpdateConfigQueryParams): Promise<GovDistributionModelUpdateConfigData> {
  const rawData = await mantleFetch<
    GovDistributionModelUpdateConfigRawVariables,
    GovDistributionModelUpdateConfigRawData
  >(
    GOV_DISTRIBUTION_MODEL_UPDATE_CONFIG_QUERY,
    {
      distributionModelContract: variables.distributionModelContract,
      distributionModelConfigQuery: JSON.stringify(
        variables.distributionModelConfigQuery,
      ),
    },
    `${mantleEndpoint}?gov--distribution-model-update-config`,
  );

  return {
    distributionModelConfig: JSON.parse(rawData.distributionModelConfig.Result),
  };
}
