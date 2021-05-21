import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { useTerraWebapp } from './context';
import { useNativeTokenBalances } from './internal/useNativeTokenBalances';

export interface TokenBalancesProviderProps {
  children: ReactNode;

  // cw20 token contracts
  cw20TokenContracts?: Record<string, string>;
}

export interface TokenBalances {
  // native token balances
  nativeTokenBalances: Record<string, string>;
  refetchNativeTokenBalances: () => Promise<Record<string, string>>;

  // cw20 token balances
  cw20TokenBalances: Record<string, string>;
  refetchCW20TokenBalances: (
    ...refetchTokens: string[]
  ) => Promise<Record<string, string>>;
}

// @ts-ignore
const TokenBalancesContext: Context<TokenBalances> = createContext<TokenBalances>();

export function TokenBalancesProvider({
  children,
  cw20TokenContracts,
}: TokenBalancesProviderProps) {
  const { mantleEndpoint, mantleFetch } = useTerraWebapp();

  const {
    nativeTokenBalances,
    refetchNativeTokenBalances,
  } = useNativeTokenBalances({
    mantleEndpoint,
    mantleFetch,
  });

  const states = useMemo<TokenBalances>(
    () => ({
      nativeTokenBalances,
      refetchNativeTokenBalances,
      cw20TokenBalances: {},
      refetchCW20TokenBalances: () => Promise.resolve({}),
    }),
    [nativeTokenBalances, refetchNativeTokenBalances],
  );

  return (
    <TokenBalancesContext.Provider value={states}>
      {children}
    </TokenBalancesContext.Provider>
  );
}

export function useTokenBalances(): TokenBalances {
  return useContext(TokenBalancesContext);
}

export const TokenBalancesConsumer: Consumer<TokenBalances> =
  TokenBalancesContext.Consumer;
