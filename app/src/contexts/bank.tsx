import {
  uANC,
  uAncUstLP,
  uaUST,
  ubEth,
  ubLuna,
  ubLunaLunaLP,
  uLuna,
  uUST,
} from '@anchor-protocol/types';
import { AnchorTax, AnchorTokenBalances } from '@anchor-protocol/webapp-fns';
import { useBank as useBank_ } from '@libs/webapp-provider';
import { useMemo } from 'react';

export interface UserBalancesData {
  uUSD: uUST<string>;
  uLuna: uLuna<string>;
  ubLuna: ubLuna<string>;
  ubEth: ubEth<string>;
  uaUST: uaUST<string>;
  uANC: uANC<string>;
  uAncUstLP: uAncUstLP<string>;
  ubLunaLunaLP: ubLunaLunaLP<string>;
}

export interface Bank {
  tax: AnchorTax;
  refetchTax: () => void;
  userBalances: UserBalancesData;
  refetchUserBalances: () => void;
}

/**
 * @deprecated use insteadof @libs/webapp-provider
 */
export function useBank(): Bank {
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

  return state;
}
