import {
  HumanAddr,
  terraswap,
  uToken,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface TerraswapSimulationRawData {
  simulation: WASMContractResult;
}

export interface TerraswapSimulationData {
  simulation: terraswap.SimulationResponse<uToken>;
}

export interface TerraswapSimulationRawVariables {
  tokenPairContract: string;
  simulationQuery: string;
}

export interface TerraswapSimulationVariables {
  tokenPairContract: HumanAddr;
  simulationQuery: terraswap.Simulation<uToken>;
}

// language=graphql
export const TERRASWAP_SIMULATION_QUERY = `
  query($tokenPairContract: String!, $simulationQuery: String!) {
    simulation: WasmContractsContractAddressStore(
      ContractAddress: $tokenPairContract
      QueryMsg: $simulationQuery
    ) {
      Result
    }
  }
`;

export interface TerraswapSimulationQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: TerraswapSimulationVariables;
}

export async function terraswapSimulationQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: TerraswapSimulationQueryParams): Promise<TerraswapSimulationData> {
  const rawData = await mantleFetch<
    TerraswapSimulationRawVariables,
    TerraswapSimulationRawData
  >(
    TERRASWAP_SIMULATION_QUERY,
    {
      tokenPairContract: variables.tokenPairContract,
      simulationQuery: JSON.stringify(variables.simulationQuery),
    },
    `${mantleEndpoint}?terraswap--simulation?pair=${variables.tokenPairContract}`,
  );

  return {
    simulation: JSON.parse(rawData.simulation.Result),
  };
}
