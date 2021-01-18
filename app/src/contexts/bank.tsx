import { MICRO } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { useOracle } from 'api/queries/oracle';
import { Data as TaxData, useTax } from 'api/queries/tax';
import {
  Data as UserBalancesData,
  useUserBalances,
} from 'api/queries/userBalances';
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
  oraclePrice: string;
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

  const { parsedData: oracleData } = useOracle();

  const state = useMemo<BankState>(() => {
    return status.status === 'ready' &&
      !!taxData &&
      !!userBalancesData &&
      !!oracleData
      ? {
          status: 'connected',
          tax: taxData,
          refetchTax,
          userBalances: userBalancesData,
          refetchUserBalances,
          oraclePrice: oracleData.oraclePrice.rate,
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
          oraclePrice: '0.5',
        };
  }, [
    oracleData,
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
