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
import {
  useConnectedWallet,
  WalletReady,
} from '@anchor-protocol/wallet-provider';
import { InputAdornment } from '@material-ui/core';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { useRewardsAncGovernance } from 'pages/gov/queries/rewardsAncGovernance';
import { ancGovernanceStakeOptions } from 'pages/gov/transactions/ancGovernanceStakeOptions';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncGovernanceStake() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

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
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidANCAmount = useMemo(() => {
    if (ancAmount.length === 0 || !userANCBalance) return undefined;

    return big(microfy(ancAmount)).gt(userANCBalance.balance)
      ? 'Not enough assets'
      : undefined;
  }, [ancAmount, userANCBalance]);

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
          !connectedWallet ||
          ancAmount.length === 0 ||
          big(ancAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidANCAmount
        }
        onClick={() => connectedWallet && proceed(connectedWallet, ancAmount)}
      >
        Stake
      </ActionButton>
    </>
  );
}
