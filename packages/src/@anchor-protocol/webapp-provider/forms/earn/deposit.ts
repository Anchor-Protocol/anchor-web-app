import { UST } from '@anchor-protocol/types';
import {
  AnchorTax,
  AnchorTokenBalances,
  EarnDepositForm,
  EarnDepositFormStates,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface EarnDepositFormReturn extends EarnDepositFormStates {
  updateDepositAmount: (depositAmount: UST) => void;
}

export function useEarnDepositForm(): EarnDepositFormReturn {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { contants } = useAnchorWebapp();

  const { tokenBalances, tax } = useBank<AnchorTokenBalances, AnchorTax>();

  const [form] = useState(() => {
    return new EarnDepositForm({
      isConnected: !!connectedWallet,
      fixedGas: contants.fixedGas,
      taxRate: tax.taxRate,
      maxTaxUUSD: tax.maxTaxUUSD,
      userUUSTBalance: tokenBalances.uUST,
    });
  });

  useEffect(() => {
    form.dependency({
      isConnected: !!connectedWallet,
      fixedGas: contants.fixedGas,
      taxRate: tax.taxRate,
      maxTaxUUSD: tax.maxTaxUUSD,
      userUUSTBalance: tokenBalances.uUST,
    });
  }, [
    connectedWallet,
    contants.fixedGas,
    form,
    tax.maxTaxUUSD,
    tax.taxRate,
    tokenBalances.uUST,
  ]);

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [states, setStates] = useState<EarnDepositFormStates>(() =>
    form.getLastStates(),
  );

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    const subscription = form.states().subscribe(setStates);

    return () => {
      subscription.unsubscribe();
      form.destroy();
    };
  }, [form]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback(
    (depositAmount: UST) => {
      form.userInput({
        depositAmount,
      });
    },
    [form],
  );

  // ---------------------------------------------
  // output
  // ---------------------------------------------
  return useMemo(
    () => ({
      ...states,
      updateDepositAmount,
    }),
    [states, updateDepositAmount],
  );
}
