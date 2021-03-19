import {
  demicrofy,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { Rate, UST, uUST } from '@anchor-protocol/types';
import {
  useConnectedWallet,
  WalletReady,
} from '@anchor-protocol/wallet-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import type { DialogProps, OpenDialog } from '@terra-dev/use-dialog';
import { useDialog } from '@terra-dev/use-dialog';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import big, { Big, BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { validateWithdrawAmount } from 'pages/earn/logics/validateWithdrawAmount';
import { withdrawReceiveAmount } from 'pages/earn/logics/withdrawReceiveAmount';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { withdrawOptions } from '../transactions/withdrawOptions';

interface FormParams {
  className?: string;
  totalDeposit: uUST<BigSource>;
  exchangeRate: Rate<BigSource>;
}

type FormReturn = void;

export function useWithdrawDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
  totalDeposit,
  exchangeRate,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { fixedGas } = useConstants();

  const [withdraw, withdrawResult] = useOperation(withdrawOptions, {});

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [withdrawAmount, setWithdrawAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const txFee = useMemo(() => big(fixedGas) as uUST<Big>, [fixedGas]);

  const receiveAmount = useMemo(
    () => withdrawReceiveAmount(withdrawAmount, txFee),
    [txFee, withdrawAmount],
  );

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidWithdrawAmount = useMemo(
    () => validateWithdrawAmount(withdrawAmount, bank, totalDeposit, txFee),
    [bank, totalDeposit, txFee, withdrawAmount],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateWithdrawAmount = useCallback((nextWithdrawAmount: string) => {
    setWithdrawAmount(nextWithdrawAmount as UST);
  }, []);

  const proceed = useCallback(
    async (
      status: WalletReady,
      withdrawAmount: string,
      txFee: uUST<BigSource> | undefined,
    ) => {
      await withdraw({
        address: status.walletAddress,
        amount: big(withdrawAmount).div(exchangeRate).toString(),
        symbol: 'usd',
        txFee: txFee!.toString() as uUST,
      });
    },
    [exchangeRate, withdraw],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    withdrawResult?.status === 'in-progress' ||
    withdrawResult?.status === 'done' ||
    withdrawResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <TransactionRenderer result={withdrawResult} onExit={closeDialog} />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Withdraw</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={withdrawAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidWithdrawAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateWithdrawAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidWithdrawAmount}>
          <span>{invalidWithdrawAmount}</span>
          <span>
            Max:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateWithdrawAmount(formatUSTInput(demicrofy(totalDeposit)))
              }
            >
              {formatUST(demicrofy(totalDeposit))} UST
            </span>
          </span>
        </div>

        {txFee && receiveAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Receive Amount">
              {formatUST(demicrofy(receiveAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            !connectedWallet ||
            withdrawAmount.length === 0 ||
            big(withdrawAmount).lte(0) ||
            !!invalidWithdrawAmount
          }
          onClick={() =>
            connectedWallet && proceed(connectedWallet, withdrawAmount, txFee)
          }
        >
          Proceed
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .amount {
    width: 100%;
    margin-bottom: 5px;

    .MuiTypography-colorTextSecondary {
      color: currentColor;
    }
  }

  .wallet {
    display: flex;
    justify-content: space-between;

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    &[aria-invalid='true'] {
      color: ${({ theme }) => theme.colors.negative};
    }
  }

  .receipt {
    margin-top: 30px;
  }

  .proceed {
    margin-top: 65px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
