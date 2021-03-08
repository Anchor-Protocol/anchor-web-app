import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatANCInput,
  formatUST,
  microfy,
} from '@anchor-protocol/notation';
import { ANC } from '@anchor-protocol/types';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { useRewardsAncGovernance } from 'pages/gov/queries/rewardsAncGovernance';
import { ancGovernanceStakeOptions } from 'pages/gov/transactions/ancGovernanceStakeOptions';
import React, { ChangeEvent, useCallback, useState } from 'react';

export function AncGovernanceStake() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [stake, stakeResult] = useOperation(ancGovernanceStakeOptions, {});

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [ancAmount, setANCAmount] = useState<ANC>('' as ANC);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: { userANCBalance },
  } = useRewardsAncGovernance();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidANCAmount = useServiceConnectedMemo(
    () => {
      if (ancAmount.length === 0 || !userANCBalance) return undefined;

      return big(microfy(ancAmount)).gt(userANCBalance.balance)
        ? 'Not enough assets'
        : undefined;
    },
    [ancAmount, userANCBalance],
    undefined,
  );

  const init = useCallback(() => {
    setANCAmount('' as ANC);
  }, []);

  const proceed = useCallback(
    async (walletReady: WalletReady, ancAmount: ANC) => {
      const broadcasted = await stake({
        address: walletReady.walletAddress,
        amount: ancAmount,
      });

      if (!broadcasted) {
        init();
      }
    },
    [init, stake],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    stakeResult?.status === 'in-progress' ||
    stakeResult?.status === 'done' ||
    stakeResult?.status === 'fault'
  ) {
    return <TransactionRenderer result={stakeResult} onExit={init} />;
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      <NumberInput
        className="amount"
        value={ancAmount}
        maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        error={!!invalidANCAmount}
        placeholder="0.00"
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setANCAmount(target.value as ANC)
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
              setANCAmount(formatANCInput(demicrofy(userANCBalance.balance)))
            }
          >
            {userANCBalance ? formatANC(demicrofy(userANCBalance.balance)) : 0}{' '}
            ANC
          </span>
        </span>
      </div>

      {ancAmount.length > 0 && (
        <TxFeeList className="receipt">
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedGas))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          !serviceAvailable ||
          ancAmount.length === 0 ||
          big(ancAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidANCAmount
        }
        onClick={() => walletReady && proceed(walletReady, ancAmount)}
      >
        Stake
      </ActionButton>
    </>
  );
}
