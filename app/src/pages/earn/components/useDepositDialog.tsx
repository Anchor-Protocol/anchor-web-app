import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@anchor-protocol/neumorphism-ui/components/useConfirm';
import {
  demicrofy,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { UST, uUST } from '@anchor-protocol/types';
import type { DialogProps, OpenDialog } from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import big, { BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { depositRecommendationAmount } from 'pages/earn/logics/depositRecommendationAmount';
import { depositSendAmount } from 'pages/earn/logics/depositSendAmount';
import { depositTxFee } from 'pages/earn/logics/depositTxFee';
import { validateDepositAmount } from 'pages/earn/logics/validateDepositAmount';
import { validateDepositNextTransaction } from 'pages/earn/logics/validateDepositNextTransaction';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { depositOptions } from '../transactions/depositOptions';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useDepositDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [deposit, depositResult] = useOperation(depositOptions, {});

  const [openConfirm, confirmElement] = useConfirm();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [depositAmount, setDepositAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const txFee = useMemo(() => depositTxFee(depositAmount, bank, fixedGas), [
    bank,
    depositAmount,
    fixedGas,
  ]);

  const sendAmount = useMemo(() => depositSendAmount(depositAmount, txFee), [
    depositAmount,
    txFee,
  ]);

  const maxAmount = useServiceConnectedMemo(
    () => depositRecommendationAmount(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidDepositAmount = useServiceConnectedMemo(
    () => validateDepositAmount(depositAmount, bank, txFee),
    [bank, depositAmount, txFee],
    undefined,
  );

  const invalidNextTransaction = useServiceConnectedMemo(
    () =>
      validateDepositNextTransaction(
        depositAmount,
        bank,
        txFee,
        fixedGas,
        !!invalidDepositAmount || !maxAmount,
      ),
    [bank, depositAmount, fixedGas, invalidDepositAmount, maxAmount, txFee],
    undefined,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback((nextDepositAmount: string) => {
    setDepositAmount(nextDepositAmount as UST);
  }, []);

  const proceed = useCallback(
    async (
      status: WalletReady,
      depositAmount: string,
      txFee: uUST<BigSource> | undefined,
      confirm: ReactNode,
    ) => {
      if (confirm) {
        const userConfirm = await openConfirm({
          description: confirm,
          agree: 'Proceed',
          disagree: 'Cancel',
        });

        if (!userConfirm) {
          return;
        }
      }

      await deposit({
        address: status.walletAddress,
        amount: depositAmount,
        symbol: 'usd',
        txFee: txFee!.toString() as uUST,
      });
    },
    [deposit, openConfirm],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    depositResult?.status === 'in-progress' ||
    depositResult?.status === 'done' ||
    depositResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <TransactionRenderer result={depositResult} onExit={closeDialog} />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Deposit</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={depositAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidDepositAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateDepositAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidDepositAmount}>
          <span>{invalidDepositAmount}</span>
          <span>
            Max:{' '}
            <span
              style={
                maxAmount
                  ? {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }
                  : undefined
              }
              onClick={() =>
                maxAmount &&
                updateDepositAmount(formatUSTInput(demicrofy(maxAmount)))
              }
            >
              {maxAmount ? formatUST(demicrofy(maxAmount)) : 0} UST
            </span>
          </span>
        </div>

        {txFee && sendAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem
              label={
                <IconSpan>
                  Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
                </IconSpan>
              }
            >
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Send Amount">
              {formatUST(demicrofy(sendAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        {invalidNextTransaction && maxAmount && (
          <MessageBox style={{ marginTop: 30, marginBottom: 0 }}>
            {invalidNextTransaction}
          </MessageBox>
        )}

        <ActionButton
          className="proceed"
          style={
            invalidNextTransaction
              ? {
                  backgroundColor: '#c12535',
                }
              : undefined
          }
          disabled={
            !serviceAvailable ||
            depositAmount.length === 0 ||
            big(depositAmount).lte(0) ||
            !!invalidDepositAmount
          }
          onClick={() =>
            walletReady &&
            proceed(walletReady, depositAmount, txFee, invalidNextTransaction)
          }
        >
          Proceed
        </ActionButton>

        {confirmElement}
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
      color: #f5356a;
    }
  }

  .receipt {
    margin-top: 30px;
  }

  .proceed {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
