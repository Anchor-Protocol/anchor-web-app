import { bluna, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface BondBLunaExchangeRateRawData {
  state: WASMContractResult;
  parameters: WASMContractResult;
}

export interface BondBLunaExchangeRateData {
  state: bluna.hub.StateResponse;
  parameters: bluna.hub.ParametersResponse;
}

export interface BondBLunaExchangeRateRawVariables {
  bLunaHubContract: string;
  stateQuery: string;
  parametersQuery: string;
}

export interface BondBLunaExchangeRateVariables {
  bLunaHubContract: string;
  stateQuery: bluna.hub.State;
  parametersQuery: bluna.hub.Parameters;
}

// language=graphql
export const BOND_BLUNA_EXCHANGE_RATE_QUERY = `
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

export interface BondBLunaExchangeRateQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BondBLunaExchangeRateVariables;
}

export async function bondBLunaExchangeRateQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: BondBLunaExchangeRateQueryParams): Promise<BondBLunaExchangeRateData> {
  const rawData = await mantleFetch<
    BondBLunaExchangeRateRawVariables,
    BondBLunaExchangeRateRawData
  >(
    BOND_BLUNA_EXCHANGE_RATE_QUERY,
    {
      bLunaHubContract: variables.bLunaHubContract,
      stateQuery: JSON.stringify(variables.stateQuery),
      parametersQuery: JSON.stringify(variables.parametersQuery),
    },
    `${mantleEndpoint}?bond--bluna-exchange-rate`,
  );

  return {
    state: JSON.parse(rawData.state.Result),
    parameters: JSON.parse(rawData.parameters.Result),
  };
}
