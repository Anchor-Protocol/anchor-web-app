import {
  earnDepositForm,
  EarnDepositFormStates,
} from '@anchor-protocol/app-fns';
import { UST } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorBank } from '../../hooks/useAnchorBank';

export interface EarnDepositFormReturn extends EarnDepositFormStates {
  updateDepositAmount: (depositAmount: UST) => void;
}

export function useEarnDepositForm(): EarnDepositFormReturn {
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const { tokenBalances, tax } = useAnchorBank();

  const [input, states] = useForm(
    earnDepositForm,
    {
      isConnected: !!connectedWallet,
      fixedGas: fixedFee,
      taxRate: tax.taxRate,
      maxTaxUUSD: tax.maxTaxUUSD,
      //taxRate: tax.taxRate,
      //maxTaxUUSD: tax.maxTaxUUSD,
      userUUSTBalance: tokenBalances.uUST,
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
