import {
  microfy,
  Ratio,
  uaUST,
  ubLuna,
  uLuna,
  UST,
  uUST,
} from '@anchor-protocol/notation';
import { BigSource } from 'big.js';
import { useService } from 'contexts/service';
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

export interface Bank {
  tax: TaxData;
  refetchTax: () => void;
  userBalances: UserBalancesData;
  refetchUserBalances: () => void;
}

// @ts-ignore
const BankContext: Context<Bank> = createContext<Bank>();

export function BankProvider({ children }: BankProviderProps) {
  const { serviceAvailable } = useService();

  const { data: taxData, refetch: refetchTax } = useTax();

  const {
    data: balancesData,
    refetch: refetchUserBalances,
  } = useUserBalances();

  const state = useMemo<Bank>(() => {
    const tax = {
      taxRate: taxData.taxRate ?? ('0.1' as Ratio),
      maxTaxUUSD:
        taxData.maxTaxUUSD ??
        (microfy(0.1 as UST<BigSource>).toString() as uUST),
    };

    return serviceAvailable
      ? {
          tax,
          refetchTax,
          userBalances: {
            uUSD: balancesData.uUSD ?? ('0' as uUST),
            uLuna: balancesData.uLuna ?? ('0' as uLuna),
            uaUST: balancesData.uaUST ?? ('0' as uaUST),
            ubLuna: balancesData.ubLuna ?? ('0' as ubLuna),
          },
          refetchUserBalances,
        }
      : {
          tax,
          refetchTax: () => {},
          userBalances: {
            uUSD: '0' as uUST,
            uLuna: '0' as uLuna,
            ubLuna: '0' as ubLuna,
            uaUST: '0' as uaUST,
          },
          refetchUserBalances,
        };
  }, [
    balancesData.uLuna,
    balancesData.uUSD,
    balancesData.uaUST,
    balancesData.ubLuna,
    refetchTax,
    refetchUserBalances,
    serviceAvailable,
    taxData.maxTaxUUSD,
    taxData.taxRate,
  ]);

  useEffect(() => {
    if (serviceAvailable) {
      refetchTax();
      refetchUserBalances();
    }
  }, [refetchTax, refetchUserBalances, serviceAvailable]);

  return <BankContext.Provider value={state}>{children}</BankContext.Provider>;
}

export function useBank(): Bank {
  return useContext(BankContext);
}

export const BankConsumer: Consumer<Bank> = BankContext.Consumer;
