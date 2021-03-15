import {
  useWasmQuery,
  UseWasmQueryOptions,
  wasmQuery,
  WasmQueryOptions,
} from '@anchor-protocol/queries/wasmQuery';
import {
  cw20,
  CW20Addr,
  HumanAddr,
  terraswap,
  uToken,
} from '@anchor-protocol/types';
import { ApolloClient } from '@apollo/client';

export function useCW20Balance<T extends uToken>({
  tokenAddress,
  userAddress,
  ...options
}: Omit<UseWasmQueryOptions<cw20.Balance>, 'address' | 'query'> & {
  tokenAddress: CW20Addr;
  userAddress: HumanAddr;
}) {
  return useWasmQuery<cw20.Balance, cw20.BalanceResponse<T>>({
    ...options,
    address: tokenAddress,
    query: {
      balance: {
        address: userAddress,
      },
    },
  });
}

export function queryCW20Balance<T extends uToken>(
  client: ApolloClient<any>,
  {
    tokenAddress,
    userAddress,
    ...options
  }: Omit<WasmQueryOptions<cw20.Balance>, 'address' | 'query'> & {
    tokenAddress: CW20Addr;
    userAddress: HumanAddr;
  },
) {
  return wasmQuery<cw20.Balance, cw20.BalanceResponse<T>>(client, {
    ...options,
    address: tokenAddress,
    query: {
      balance: {
        address: userAddress,
      },
    },
  });
}

export function queryTerraswapSimulation<
  T extends uToken,
  RT extends uToken = T
>(
  client: ApolloClient<any>,
  options: WasmQueryOptions<terraswap.Simulation<T>>,
) {
  return wasmQuery<
    terraswap.Simulation<T>,
    terraswap.SimulationResponse<T, RT>
  >(client, {
    ...options,
  });
}

export function queryTerraswapReverseSimulation<
  T extends uToken,
  RT extends uToken = T
>(
  client: ApolloClient<any>,
  options: WasmQueryOptions<terraswap.ReverseSimulation<T>>,
) {
  return wasmQuery<
    terraswap.ReverseSimulation<T>,
    terraswap.ReverseSimulationResponse<T, RT>
  >(client, {
    ...options,
  });
}
