import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatANC,
  formatANCInput,
  formatUST,
} from '@anchor-protocol/notation';
import { ANC } from '@anchor-protocol/types';
import { useRewardsAncGovernanceRewardsQuery } from '@anchor-protocol/app-provider';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy, microfy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { validateTxFee } from '@anchor-protocol/app-fns';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useBalances } from 'contexts/balances';
import { useLockAncTx } from 'tx/gov/useLockAncTx';

export function AncGovernanceStake() {
  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const [lock, lockResult] = useLockAncTx();

  const [amount, setAmount] = useState<ANC>('' as ANC);

  const { uUST } = useBalances();

  const { data: { userANCBalance } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  const invalidTxFee = connected && validateTxFee(uUST, fixedFee);

  const invalidANCAmount =
    amount.length === 0 || !userANCBalance
      ? undefined
      : big(microfy(amount)).gt(userANCBalance.balance)
      ? 'Not enough assets'
      : undefined;

  const proceed = useCallback(() => {
    if (!connected || !lock) {
      return;
    }

    lock({
      amount,
      onTxSucceed: () => {
        setAmount('' as ANC);
      },
    });
  }, [amount, connected, lock]);

  if (
    lockResult?.status === StreamStatus.IN_PROGRESS ||
    lockResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={lockResult.value}
        onExit={() => {
          setAmount('' as ANC);

          switch (lockResult.status) {
            case StreamStatus.IN_PROGRESS:
              lockResult.abort();
              break;
            case StreamStatus.DONE:
              lockResult.clear();
              break;
          }
        }}
      />
    );
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      <NumberInput
        className="amount"
        value={amount}
        amount={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        error={!!invalidANCAmount}
        placeholder="0.00"
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setAmount(target.value as ANC)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">ANC</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidANCAmount}>
        <span>{invalidANCAmount}</span>
        <span>
          Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              userANCBalance &&
              setAmount(formatANCInput(demicrofy(userANCBalance.balance)))
            }
          >
            {userANCBalance ? formatANC(demicrofy(userANCBalance.balance)) : 0}{' '}
            ANC
          </span>
        </span>
      </div>

      {amount.length > 0 && (
        <TxFeeList className="receipt">
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedFee))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      <ViewAddressWarning>
        <ActionButton
          className="submit"
          disabled={
            !availablePost ||
            !connected ||
            !lock ||
            amount.length === 0 ||
            big(amount).lte(0) ||
            !!invalidTxFee ||
            !!invalidANCAmount
          }
          onClick={proceed}
        >
          Stake
        </ActionButton>
      </ViewAddressWarning>
    </>
  );
}
