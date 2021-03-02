import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatLP,
  formatLPInput,
  formatUST,
  microfy,
} from '@anchor-protocol/notation';
import { AncUstLP } from '@anchor-protocol/types';
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
import { useRewardsAncUstLp } from 'pages/gov/queries/rewardsAncUstLp';
import { ancUstLpStakeOptions } from 'pages/gov/transactions/ancUstLpStakeOptions';
import React, { ChangeEvent, useCallback, useState } from 'react';

export function AncUstLpStake() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [stake, stakeResult] = useOperation(ancUstLpStakeOptions, {});

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [lpAmount, setLpAmount] = useState<AncUstLP>('' as AncUstLP);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: { userLPBalance },
  } = useRewardsAncUstLp();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidLpAmount = useServiceConnectedMemo(
    () => {
      if (lpAmount.length === 0 || !userLPBalance) return undefined;

      return big(microfy(lpAmount)).gt(userLPBalance.balance)
        ? 'Not enough assets'
        : undefined;
    },
    [lpAmount, userLPBalance],
    undefined,
  );

  const init = useCallback(() => {
    setLpAmount('' as AncUstLP);
  }, []);

  const proceed = useCallback(
    async (walletReady: WalletReady, lpAmount: AncUstLP) => {
      const broadcasted = await stake({
        address: walletReady.walletAddress,
        amount: lpAmount,
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

      {/* ANC */}
      <div className="description">
        <p>Input</p>
        <p />
      </div>

      <NumberInput
        className="amount"
        value={lpAmount}
        maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        error={!!invalidLpAmount}
        placeholder="0.00"
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setLpAmount(target.value as AncUstLP)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">LP</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidLpAmount}>
        <span>{invalidLpAmount}</span>
        <span>
          ANC-UST LP Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              userLPBalance &&
              setLpAmount(formatLPInput(demicrofy(userLPBalance.balance)))
            }
          >
            {userLPBalance ? formatLP(demicrofy(userLPBalance.balance)) : 0} LP
          </span>
        </span>
      </div>

      <TxFeeList className="receipt">
        <TxFeeListItem label="Tx Fee">
          {formatUST(demicrofy(fixedGas))} UST
        </TxFeeListItem>
      </TxFeeList>

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          !serviceAvailable ||
          lpAmount.length === 0 ||
          big(lpAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidLpAmount
        }
        onClick={() => walletReady && proceed(walletReady, lpAmount)}
      >
        Stake
      </ActionButton>
    </>
  );
}
