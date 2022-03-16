import {
  earnDepositForm,
  EarnDepositFormStates,
} from '@anchor-protocol/app-fns';
import { UST } from '@anchor-protocol/types';
import { useFixedFee, useUstTax } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useCallback } from 'react';

export interface EarnDepositFormReturn extends EarnDepositFormStates {
  updateDepositAmount: (depositAmount: UST) => void;
}

export function useEarnDepositForm(): EarnDepositFormReturn {
  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const { uUST } = useBalances();

  const { taxRate, maxTax } = useUstTax();

  const [input, states] = useForm(
    earnDepositForm,
    {
      isConnected: connected,
      fixedGas: fixedFee,
      taxRate: taxRate,
      maxTaxUUSD: maxTax,
      userUUSTBalance: uUST,
    },
    () => ({ depositAmount: '' as UST }),
  );

  const updateDepositAmount = useCallback(
    (depositAmount: UST) => {
      input({
        depositAmount,
      });
    },
    [input],
  );

  return {
    ...states,
    updateDepositAmount,
  };
}
