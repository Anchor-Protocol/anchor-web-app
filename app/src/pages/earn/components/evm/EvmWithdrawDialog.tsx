import React from 'react';
import {
  useEarnEpochStatesQuery,
  useEarnWithdrawForm,
} from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { WithdrawDialog } from '../WithdrawDialog';
import { aUST } from '@anchor-protocol/types';
import { Big } from 'big.js';
import { useWithdrawUstTx } from 'tx/evm';
import { DialogProps } from '@libs/use-dialog';

export function EvmWithdrawDialog(props: DialogProps<{}, void>) {
  const { connected } = useAccount();

  const { data } = useEarnEpochStatesQuery();

  const state = useEarnWithdrawForm();

  const [withdraw, withdrawTxResult] = useWithdrawUstTx();

  const { withdrawAmount, availablePost } = state;

  return (
    <WithdrawDialog {...props} {...state} txResult={withdrawTxResult}>
      <ViewAddressWarning>
        <ActionButton
          className="button"
          disabled={
            !availablePost || !connected || !withdraw || !availablePost || !data
          }
          onClick={() =>
            withdraw!({
              withdrawAmount: Big(withdrawAmount)
                .div(data!.moneyMarketEpochState.exchange_rate)
                .toString() as aUST,
            })
          }
        >
          Proceed
        </ActionButton>
      </ViewAddressWarning>
    </WithdrawDialog>
  );
}
