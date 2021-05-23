import { UST, uUST } from '@anchor-protocol/types';
import {
  AnchorTokenBalances,
  earnWithdrawForm,
  EarnWithdrawFormStates,
} from '@anchor-protocol/webapp-fns';
import {
  useAnchorWebapp,
  useEarnTotalDepositQuery,
} from '@anchor-protocol/webapp-provider';
import { useForm } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import { useCallback } from 'react';

export interface EarnWithdrawFormReturn extends EarnWithdrawFormStates {
  updateWithdrawAmount: (withdrawAmount: UST) => void;
}

export function useEarnWithdrawForm(): EarnWithdrawFormReturn {
  const connectedWallet = useConnectedWallet();

  const { contants } = useAnchorWebapp();

  const { tokenBalances } = useBank<AnchorTokenBalances>();

  const { data } = useEarnTotalDepositQuery();

  const [input, states] = useForm(
    earnWithdrawForm,
    {
      isConnected: !!connectedWallet,
      fixedGas: contants.fixedGas,
      userUUSTBalance: tokenBalances.uUST,
      totalDeposit: data?.totalDeposit ?? ('0' as uUST),
    },
    () => ({ withdrawAmount: '0' as UST }),
  );

  const updateWithdrawAmount = useCallback(
    (withdrawAmount: UST) => {
      input({
        withdrawAmount,
      });
    },
    [input],
  );

  return {
    ...states,
    updateWithdrawAmount,
  };
}
