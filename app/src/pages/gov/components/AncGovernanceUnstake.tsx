import { max } from '@terra-dev/big-math';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatANCInput,
  formatUST,
  microfy,
} from '@anchor-protocol/notation';
import { ANC, uANC } from '@anchor-protocol/types';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import { useService } from 'base/contexts/service';
import { InputAdornment } from '@material-ui/core';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { useRewardsAncGovernance } from 'pages/gov/queries/rewardsAncGovernance';
import { useTotalStaked } from 'pages/gov/queries/totalStaked';
import { ancGovernanceUnstakeOptions } from 'pages/gov/transactions/ancGovernanceUnstakeOptions';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncGovernanceUnstake() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [unstake, unstakeResult] = useOperation(
    ancGovernanceUnstakeOptions,
    {},
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [ancAmount, setANCAmount] = useState<ANC>('' as ANC);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: { userGovStakingInfo },
  } = useRewardsAncGovernance();

  const {
    data: { govState, govANCBalance },
  } = useTotalStaked();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const unstakableBalance = useMemo<uANC<Big> | undefined>(() => {
    if (!govANCBalance || !userGovStakingInfo || !govState) return undefined;

    const govShareIndex = big(
      big(govANCBalance.balance).minus(govState.total_deposit),
    ).div(govState.total_share);

    const lockedANC = max(
      0,
      ...userGovStakingInfo.locked_balance.map(([_, { balance }]) => balance),
    );

    const unstakable = big(userGovStakingInfo.share)
      .mul(govShareIndex)
      .minus(lockedANC) as uANC<Big>;

    return unstakable;
  }, [govANCBalance, govState, userGovStakingInfo]);

  const invalidTxFee = useMemo(
    () => serviceAvailable && validateTxFee(bank, fixedGas),
    [bank, fixedGas, serviceAvailable],
  );

  const invalidANCAmount = useMemo(() => {
    if (ancAmount.length === 0 || !unstakableBalance) return undefined;

    return big(microfy(ancAmount)).gt(unstakableBalance)
      ? 'Not enough assets'
      : undefined;
  }, [ancAmount, unstakableBalance]);

  const init = useCallback(() => {
    setANCAmount('' as ANC);
  }, []);

  const proceed = useCallback(
    async (walletReady: WalletReady, ancAmount: ANC) => {
      if (!unstakableBalance) return;

      const broadcasted = await unstake({
        address: walletReady.walletAddress,
        amount:
          formatANCInput(demicrofy(unstakableBalance)) === ancAmount
            ? undefined
            : ancAmount,
      });

      if (!broadcasted) {
        init();
      }
    },
    [init, unstakableBalance, unstake],
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
              unstakableBalance &&
              setANCAmount(formatANCInput(demicrofy(unstakableBalance)))
            }
          >
            {unstakableBalance ? formatANC(demicrofy(unstakableBalance)) : 0}{' '}
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
        Unstake
      </ActionButton>
    </>
  );
}
