import { AnchorTax, AnchorTokenBalances } from '@anchor-protocol/webapp-fns';
import { useBank as useBank_ } from '@terra-money/webapp-provider';
import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext, useMemo } from 'react';
import { Data as TaxData } from '../queries/tax';
import { Data as UserBalancesData } from '../queries/userBalances';

export interface BankProviderProps {
  children: ReactNode;
}

export interface Bank {
  tax: TaxData;
  refetchTax: () => void;
  userBalances: UserBalancesData;
  refetchUserBalances: () => void;
}

// @ts-ignore
const BankContext: Context<Bank> = createContext<Bank>();

// TODO remove after refactoring done
export function BankProvider({ children }: BankProviderProps) {
  const { tokenBalances, tax, refetchTax, refetchTokenBalances } = useBank_<
    AnchorTokenBalances,
    AnchorTax
  >();

  const state = useMemo<Bank>(() => {
    return {
      tax,
      refetchTax,
      userBalances: {
        ...tokenBalances,
        uUSD: tokenBalances.uUST,
      },
      refetchUserBalances: refetchTokenBalances,
    };
  }, [tax, refetchTax, tokenBalances, refetchTokenBalances]);

  return <BankContext.Provider value={state}>{children}</BankContext.Provider>;
}

/**
 * @deprecated use insteadof @terra-money/webapp-provider
 */
export function useBank(): Bank {
  return useContext(BankContext);
}

export const BankConsumer: Consumer<Bank> = BankContext.Consumer;
