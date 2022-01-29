import {
  computeTotalDeposit,
  earnWithdrawForm,
  EarnWithdrawFormStates,
} from '@anchor-protocol/app-fns';
import { UST } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { useCallback, useMemo } from 'react';
import { useAccount } from 'contexts/account';
import { useEarnEpochStatesQuery } from '../../queries/earn/epochStates';
import { useTokenBalances } from 'contexts/balances';

export interface EarnWithdrawFormReturn extends EarnWithdrawFormStates {
  updateWithdrawAmount: (withdrawAmount: UST) => void;
}

export function useEarnWithdrawForm(): EarnWithdrawFormReturn {
  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const tokenBalances = useTokenBalances();

  const { data } = useEarnEpochStatesQuery();

  const { totalDeposit } = useMemo(() => {
    return {
      totalDeposit: computeTotalDeposit(
        tokenBalances.uaUST,
        data?.moneyMarketEpochState,
      ),
    };
  }, [data?.moneyMarketEpochState, tokenBalances.uaUST]);

  const [input, states] = useForm(
    earnWithdrawForm,
    {
      isConnected: connected,
      fixedGas: fixedFee,
      userUUSTBalance: tokenBalances.uUST,
      totalDeposit: totalDeposit,
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
