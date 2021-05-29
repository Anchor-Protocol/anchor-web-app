import {
  CW20Addr,
  terraswap,
  uToken,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface TerraswapReverseSimulationRawData {
  simulation: WASMContractResult;
}

export interface TerraswapReverseSimulationData {
  simulation: terraswap.SimulationResponse<uToken>;
}

export interface TerraswapReverseSimulationRawVariables {
  tokenPairContract: string;
  simulationQuery: string;
}

export interface TerraswapReverseSimulationVariables {
  tokenPairContract: CW20Addr;
  simulationQuery: terraswap.Simulation<uToken>;
}

// language=graphql
export const TERRASWAP_REVERSE_SIMULATION_QUERY = `
  query($tokenPairContract: String!, $simulationQuery: String!) {
    simulation: WasmContractsContractAddressStore(
      ContractAddress: $tokenPairContract
      QueryMsg: $simulationQuery
    ) {
      Result
    }
  }
`;

export interface TerraswapReverseSimulationQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: TerraswapReverseSimulationVariables;
}

export async function terraswapReverseSimulationQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: TerraswapReverseSimulationQueryParams): Promise<TerraswapReverseSimulationData> {
  const rawData = await mantleFetch<
    TerraswapReverseSimulationRawVariables,
    TerraswapReverseSimulationRawData
  >(
    TERRASWAP_REVERSE_SIMULATION_QUERY,
    {
      tokenPairContract: variables.tokenPairContract,
      simulationQuery: JSON.stringify(variables.simulationQuery),
    },
    `${mantleEndpoint}?terraswap--reverse-simulation?pair=${variables.tokenPairContract}`,
  );

  return {
    simulation: JSON.parse(rawData.simulation.Result),
  };
}
