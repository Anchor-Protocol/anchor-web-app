import {
  ANC,
  AncUstLP,
  aUST,
  bEth,
  bLuna,
  bLunaLunaLP,
  Luna,
  u,
  UST,
} from '@anchor-protocol/types';
import { AnchorTax, AnchorTokenBalances } from '@anchor-protocol/webapp-fns';
import { useBank as useBank_ } from '@libs/webapp-provider';
import { useMemo } from 'react';

export interface UserBalancesData {
  uUSD: u<UST<string>>;
  uLuna: u<Luna<string>>;
  ubLuna: u<bLuna<string>>;
  ubEth: u<bEth<string>>;
  uaUST: u<aUST<string>>;
  uANC: u<ANC<string>>;
  uAncUstLP: u<AncUstLP<string>>;
  ubLunaLunaLP: u<bLunaLunaLP<string>>;
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
