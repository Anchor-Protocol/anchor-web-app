import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  demicrofy,
  formatUST,
  formatUSTInput,
  UST,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
  uUST,
} from '@anchor-protocol/notation';
import type { DialogProps, OpenDialog } from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import big, { BigSource } from 'big.js';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useInvalidTxFee } from 'logics/useInvalidTxFee';
import type { ReactNode } from 'react';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useInvalidWithdrawAmount } from '../logics/useInvalidWithdrawAmount';
import { useWithdrawReceiveAmount } from '../logics/useWithdrawReceiveAmount';
import { useWithdrawTxFee } from '../logics/useWithdrawTxFee';
import { Data as TotalDepositData } from '../queries/totalDeposit';
import { withdrawOptions } from '../transactions/withdrawOptions';

interface FormParams {
  className?: string;
  totalDeposit: TotalDepositData;
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
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status } = useWallet();

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
  const txFee = useWithdrawTxFee(withdrawAmount, bank);
  const receiveAmount = useWithdrawReceiveAmount(withdrawAmount, txFee);

  const invalidTxFee = useInvalidTxFee(bank);
  const invalidWithdrawAmount = useInvalidWithdrawAmount(
    withdrawAmount,
    bank,
    totalDeposit.totalDeposit,
    txFee,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateWithdrawAmount = useCallback((nextWithdrawAmount: string) => {
    setWithdrawAmount(nextWithdrawAmount as UST);
  }, []);

  const proceed = useCallback(
    async (
      status: WalletStatus,
      withdrawAmount: string,
      txFee: uUST<BigSource> | undefined,
    ) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      await withdraw({
        address: status.walletAddress,
        amount: big(withdrawAmount)
          .div(totalDeposit.exchangeRate.exchange_rate)
          .toString(),
        symbol: 'usd',
        txFee: txFee!.toString() as uUST,
      });
    },
    [bank.status, totalDeposit.exchangeRate.exchange_rate, withdraw],
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

        {!!invalidTxFee && <WarningMessage>{invalidTxFee}</WarningMessage>}

        <NumberInput
          className="amount"
          value={withdrawAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidWithdrawAmount}
          onChange={({ target }) => updateWithdrawAmount(target.value)}
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
                updateWithdrawAmount(
                  formatUSTInput(demicrofy(totalDeposit.totalDeposit)),
                )
              }
            >
              {formatUST(demicrofy(totalDeposit.totalDeposit))} UST
            </span>
          </span>
        </div>

        {txFee && receiveAmount && (
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
            <TxFeeListItem label="Receive Amount">
              {formatUST(demicrofy(receiveAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            withdrawAmount.length === 0 ||
            big(withdrawAmount).lte(0) ||
            !!invalidWithdrawAmount
          }
          onClick={() => proceed(status, withdrawAmount, txFee)}
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
      color: #f5356a;
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
