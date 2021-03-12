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
import { useBank } from '@anchor-protocol/web-contexts/contexts/bank';
import { useConstants } from '@anchor-protocol/web-contexts/contexts/contants';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { useRewardsAncUstLp } from 'pages/gov/queries/rewardsAncUstLp';
import { ancUstLpUnstakeOptions } from 'pages/gov/transactions/ancUstLpUnstakeOptions';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncUstLpUnstake() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [unstake, unstakeResult] = useOperation(ancUstLpUnstakeOptions, {});

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [lpAmount, setLpAmount] = useState<AncUstLP>('' as AncUstLP);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: { userLPStakingInfo },
  } = useRewardsAncUstLp();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => serviceAvailable && validateTxFee(bank, fixedGas),
    [bank, fixedGas, serviceAvailable],
  );

  const invalidLpAmount = useMemo(() => {
    if (lpAmount.length === 0 || !userLPStakingInfo) return undefined;

    return big(microfy(lpAmount)).gt(userLPStakingInfo.bond_amount)
      ? 'Not enough assets'
      : undefined;
  }, [lpAmount, userLPStakingInfo]);

  const init = useCallback(() => {
    setLpAmount('' as AncUstLP);
  }, []);

  const proceed = useCallback(
    async (walletReady: WalletReady, lpAmount: AncUstLP) => {
      const broadcasted = await unstake({
        address: walletReady.walletAddress,
        amount: lpAmount,
      });

      if (!broadcasted) {
        init();
      }
    },
    [init, unstake],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    unstakeResult?.status === 'in-progress' ||
    unstakeResult?.status === 'done' ||
    unstakeResult?.status === 'fault'
  ) {
    return <TransactionRenderer result={unstakeResult} onExit={init} />;
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

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
          Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              userLPStakingInfo &&
              setLpAmount(
                formatLPInput(demicrofy(userLPStakingInfo.bond_amount)),
              )
            }
          >
            {userLPStakingInfo
              ? formatLP(demicrofy(userLPStakingInfo.bond_amount))
              : 0}{' '}
            LP
          </span>
        </span>
      </div>

      {lpAmount.length > 0 && (
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
          lpAmount.length === 0 ||
          big(lpAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidLpAmount
        }
        onClick={() => walletReady && proceed(walletReady, lpAmount)}
      >
        Unstake
      </ActionButton>
    </>
  );
}
