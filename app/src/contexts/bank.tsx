import { MICRO } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { Data as TaxData, useTax } from 'queries/tax';
import {
  Data as UserBalancesData,
  useUserBalances,
} from 'queries/userBalances';
import type { ReactNode } from 'react';
import {
  Consumer,
  Context,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';

export interface BankProviderProps {
  children: ReactNode;
}

export interface BankState {
  status: 'demo' | 'connected';
  tax: TaxData;
  refetchTax: () => void;
  userBalances: UserBalancesData;
  refetchUserBalances: () => void;
}

// @ts-ignore
const BankContext: Context<BankState> = createContext<BankState>();

export function BankProvider({ children }: BankProviderProps) {
  const { status } = useWallet();

  const { parsedData: taxData, refetch: refetchTax } = useTax();

  const {
    parsedData: userBalancesData,
    refetch: refetchUserBalances,
  } = useUserBalances();

  const state = useMemo<BankState>(() => {
    return status.status === 'ready' && !!taxData && !!userBalancesData
      ? {
          status: 'connected',
          tax: taxData,
          refetchTax,
          userBalances: userBalancesData,
          refetchUserBalances,
        }
      : {
          status: 'demo',
          tax: taxData
            ? taxData
            : {
                taxRate: '0.1',
                maxTaxUUSD: (0.1 * MICRO).toString(),
              },
          refetchTax,
          userBalances: {
            uUSD: '0',
            uLuna: '0',
            ubLuna: '0',
            uaUST: '0',
          },
          refetchUserBalances,
        };
  }, [
    refetchTax,
    refetchUserBalances,
    status.status,
    taxData,
    userBalancesData,
  ]);

  useEffect(() => {
    refetchTax();

    if (status.status === 'ready') {
      refetchUserBalances();
    }
  }, [refetchTax, refetchUserBalances, status.status]);

  return <BankContext.Provider value={state}>{children}</BankContext.Provider>;
}

export function useBank(): BankState {
  return useContext(BankContext);
}

export const BankConsumer: Consumer<BankState> = BankContext.Consumer;
