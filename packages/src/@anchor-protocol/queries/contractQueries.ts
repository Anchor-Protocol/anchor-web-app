import {
  cw20,
  CW20Addr,
  HumanAddr,
  StableDenom,
  terraswap,
  uANC,
  uToken,
  uUST,
} from '@anchor-protocol/types';
import { ApolloClient, ApolloError } from '@apollo/client';
import { QueryDependency, useQueryDependency } from './provider';
import {
  useWasmQuery,
  UseWasmQueryOptions,
  wasmQuery,
  WasmQueryOptions,
} from './wasmQuery';

export function useCW20Balance<T extends uToken>({
  tokenAddress,
  userAddress,
  ...options
}: Omit<UseWasmQueryOptions<cw20.Balance>, 'address' | 'query'> & {
  tokenAddress: CW20Addr;
  userAddress: HumanAddr;
}) {
  const { onError } = useQueryDependency();

  return useWasmQuery<cw20.Balance, cw20.BalanceResponse<T>>({
    ...options,
    address: tokenAddress,
    query: {
      balance: {
        address: userAddress,
      },
    },
    onError: options.onError ?? onError,
  });
}

export const queryCW20Balance = <T extends uToken>({
  client,
  onError,
}: QueryDependency) => ({
  tokenAddress,
  userAddress,
  ...options
}: Omit<WasmQueryOptions<cw20.Balance>, 'address' | 'query'> & {
  tokenAddress: CW20Addr;
  userAddress: HumanAddr;
}) => {
  return wasmQuery<cw20.Balance, cw20.BalanceResponse<T>>(client, {
    ...options,
    address: tokenAddress,
    query: {
      balance: {
        address: userAddress,
      },
    },
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

export const queryTerraswapSimulation = <
  T extends uToken,
  RT extends uToken = T
>({
  client,
  onError,
}: QueryDependency) => (options: WasmQueryOptions<terraswap.Simulation<T>>) => {
  return wasmQuery<
    terraswap.Simulation<T>,
    terraswap.SimulationResponse<T, RT>
  >(client, {
    ...options,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};

queryTerraswapSimulation<uUST, uANC>({
  client: new ApolloClient<any>({} as any),
  address: {} as any,
})({
  id: '',
  address: '' as CW20Addr,
  query: {
    simulation: {
      offer_asset: {
        info: {
          native_token: {
            denom: 'uusd' as StableDenom,
          },
        },
        amount: '100' as uUST,
      },
    },
  },
});

export const queryTerraswapReverseSimulation = <
  T extends uToken,
  RT extends uToken = T
>({
  client,
  onError,
}: QueryDependency) => (
  options: WasmQueryOptions<terraswap.ReverseSimulation<T>>,
) => {
  return wasmQuery<
    terraswap.ReverseSimulation<T>,
    terraswap.ReverseSimulationResponse<T, RT>
  >(client, {
    ...options,
  }).catch((error) => {
    if (onError && error instanceof ApolloError) {
      onError(error);
    } else {
      throw error;
    }
  });
};
