import { UST } from '@anchor-protocol/types';
import {
  AnchorTokenBalances,
  computeTotalDeposit,
  earnWithdrawForm,
  EarnWithdrawFormStates,
} from '@anchor-protocol/webapp-fns';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@libs/webapp-provider';
import { useCallback, useMemo } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { useEarnEpochStatesQuery } from '../../queries/earn/epochStates';

export interface EarnWithdrawFormReturn extends EarnWithdrawFormStates {
  updateWithdrawAmount: (withdrawAmount: UST) => void;
}

export function useEarnWithdrawForm(): EarnWithdrawFormReturn {
  const connectedWallet = useConnectedWallet();

  const { constants } = useAnchorWebapp();

  const { tokenBalances } = useBank<AnchorTokenBalances>();

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
      isConnected: !!connectedWallet,
      fixedGas: constants.fixedGas,
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
