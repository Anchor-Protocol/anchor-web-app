import {
  computeTotalDeposit,
  earnWithdrawForm,
  EarnWithdrawFormStates,
} from '@anchor-protocol/app-fns';
import { UST } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useCallback, useMemo } from 'react';
import { useEarnEpochStatesQuery } from '../../queries/earn/epochStates';

export interface EarnWithdrawFormReturn extends EarnWithdrawFormStates {
  updateWithdrawAmount: (withdrawAmount: UST) => void;
}

export function useEarnWithdrawForm(): EarnWithdrawFormReturn {
  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const { uUST, uaUST } = useBalances();

  const { data } = useEarnEpochStatesQuery();

  const { totalDeposit } = useMemo(() => {
    return {
      totalDeposit: computeTotalDeposit(uaUST, data?.moneyMarketEpochState),
    };
  }, [data?.moneyMarketEpochState, uaUST]);

  const [input, states] = useForm(
    earnWithdrawForm,
    {
      isConnected: connected,
      fixedGas: fixedFee,
      userUUSTBalance: uUST,
      totalDeposit: totalDeposit,
    },
    () => ({ withdrawAmount: '' as UST }),
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
