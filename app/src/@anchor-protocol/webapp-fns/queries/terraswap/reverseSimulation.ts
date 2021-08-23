import { terraswap, Token } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@libs/webapp-fns';

export interface TerraswapReverseSimulationWasmQuery {
  simulation: WasmQuery<
    terraswap.Simulation<Token>,
    terraswap.SimulationResponse<Token>
  >;
}

export type TerraswapReverseSimulation =
  WasmQueryData<TerraswapReverseSimulationWasmQuery>;

export type TerraswapReverseSimulationQueryParams = Omit<
  MantleParams<TerraswapReverseSimulationWasmQuery>,
  'query' | 'variables'
>;

export async function terraswapReverseSimulationQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: TerraswapReverseSimulationQueryParams): Promise<TerraswapReverseSimulation> {
  return mantle<TerraswapReverseSimulationWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?terraswap--reverse-simulation?pair=${wasmQuery.simulation.contractAddress}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
