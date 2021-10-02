import { UST } from '@anchor-protocol/types';
import {
  AnchorTax,
  AnchorTokenBalances,
  earnDepositForm,
  EarnDepositFormStates,
} from '@anchor-protocol/webapp-fns';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@libs/webapp-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';

export interface EarnDepositFormReturn extends EarnDepositFormStates {
  updateDepositAmount: (depositAmount: UST) => void;
}

export function useEarnDepositForm(): EarnDepositFormReturn {
  const connectedWallet = useConnectedWallet();

  const { constants } = useAnchorWebapp();

  const { tokenBalances, tax } = useBank<AnchorTokenBalances, AnchorTax>();

  const [input, states] = useForm(
    earnDepositForm,
    {
      isConnected: !!connectedWallet,
      fixedGas: constants.fixedFee,
      tax,
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
