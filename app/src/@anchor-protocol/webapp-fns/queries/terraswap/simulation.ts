import { terraswap, uToken } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface TerraswapSimulationWasmQuery {
  simulation: WasmQuery<
    terraswap.Simulation<uToken>,
    terraswap.SimulationResponse<uToken>
  >;
}

export type TerraswapSimulation = WasmQueryData<TerraswapSimulationWasmQuery>;

export type TerraswapSimulationQueryParams = Omit<
  MantleParams<TerraswapSimulationWasmQuery>,
  'query' | 'variables'
>;

export async function terraswapSimulationQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: TerraswapSimulationQueryParams): Promise<TerraswapSimulation> {
  return mantle<TerraswapSimulationWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?terraswap--simulation?pair=${wasmQuery.simulation.contractAddress}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
