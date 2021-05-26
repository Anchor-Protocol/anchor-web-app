import { bluna, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface BondBAssetExchangeRateRawData {
  state: WASMContractResult;
  parameters: WASMContractResult;
}

export interface BondBAssetExchangeRateData {
  state: bluna.hub.StateResponse;
  parameters: bluna.hub.ParametersResponse;
}

export interface BondBAssetExchangeRateRawVariables {
  bLunaHubContract: string;
  stateQuery: string;
  parametersQuery: string;
}

export interface BondBAssetExchangeRateVariables {
  bLunaHubContract: string;
  stateQuery: bluna.hub.State;
  parametersQuery: bluna.hub.Parameters;
}

// language=graphql
export const BOND_BASSET_EXCHANGE_RATE_QUERY = `
  query (
    $bLunaHubContract: String!
    $stateQuery: String!
    $parametersQuery: String!
  ) {
    state: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $stateQuery
    ) {
      Result
    }

    parameters: WasmContractsContractAddressStore(
      ContractAddress: $bLunaHubContract
      QueryMsg: $parametersQuery
    ) {
      Result
    }
  }
`;

export interface BondBAssetExchangeRateQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BondBAssetExchangeRateVariables;
}

export async function bondBAssetExchangeRateQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: BondBAssetExchangeRateQueryParams): Promise<BondBAssetExchangeRateData> {
  const rawData = await mantleFetch<
    BondBAssetExchangeRateRawVariables,
    BondBAssetExchangeRateRawData
  >(
    BOND_BASSET_EXCHANGE_RATE_QUERY,
    {
      bLunaHubContract: variables.bLunaHubContract,
      stateQuery: JSON.stringify(variables.stateQuery),
      parametersQuery: JSON.stringify(variables.parametersQuery),
    },
    `${mantleEndpoint}?bond--basset-exchange-rate`,
  );

  return {
    state: JSON.parse(rawData.state.Result),
    parameters: JSON.parse(rawData.parameters.Result),
  };
}
