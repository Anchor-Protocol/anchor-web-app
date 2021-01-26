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
  UST,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import type {
  DialogProps,
  DialogTemplate,
  OpenDialog,
} from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { useApolloClient } from '@apollo/client';
import { InputAdornment, Modal } from '@material-ui/core';
import big from 'big.js';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { useInvalidTxFee } from 'logics/useInvalidTxFee';
import type { ReactNode } from 'react';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDepositRecommentationAmount } from '../logics/useDepositRecommentationAmount';
import { useDepositSendAmount } from '../logics/useDepositSendAmount';
import { useDepositTxFee } from '../logics/useDepositTxFee';
import { useInvalidDepositAmount } from '../logics/useInvalidDepositAmount';
import { useInvalidDepositNextTransaction } from '../logics/useInvalidDepositNextTransaction';
import { depositOptions } from '../transactions/depositOptions';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useDepositDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Template);
}

const Template: DialogTemplate<FormParams, FormReturn> = (props) => {
  return <Component {...props} />;
};

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const client = useApolloClient();

  const [deposit, depositResult] = useOperation(depositOptions, {
    addressProvider,
    post,
    client,
  });

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
  const txFee = useDepositTxFee(depositAmount, bank);
  const sendAmount = useDepositSendAmount(depositAmount, txFee);
  const recommendationAssetAmount = useDepositRecommentationAmount(bank);

  const invalidTxFee = useInvalidTxFee(bank);
  const invalidDepositAmount = useInvalidDepositAmount(
    depositAmount,
    bank,
    txFee,
  );
  const invalidNextTransaction = useInvalidDepositNextTransaction(
    depositAmount,
    bank,
    txFee,
    !!invalidDepositAmount,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback((nextDepositAmount: string) => {
    setDepositAmount(nextDepositAmount as UST);
  }, []);

  const proceed = useCallback(
    async (status: WalletStatus, depositAmount: string, confirm: ReactNode) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

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
      });
    },
    [bank.status, deposit, openConfirm],
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
          <h1>Deposit</h1>
          <TransactionRenderer result={depositResult} onExit={closeDialog} />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Deposit</h1>

        {!!invalidTxFee && <WarningMessage>{invalidTxFee}</WarningMessage>}

        <NumberInput
          className="amount"
          value={depositAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidDepositAmount}
          onChange={({ target }) => updateDepositAmount(target.value)}
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
                recommendationAssetAmount
                  ? {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }
                  : undefined
              }
              onClick={() =>
                recommendationAssetAmount &&
                updateDepositAmount(
                  formatUSTInput(demicrofy(recommendationAssetAmount)),
                )
              }
            >
              {recommendationAssetAmount
                ? formatUST(demicrofy(recommendationAssetAmount))
                : 0}{' '}
              UST
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

        {invalidNextTransaction && recommendationAssetAmount && (
          <WarningMessage style={{ marginTop: 30, marginBottom: 0 }}>
            {invalidNextTransaction}
          </WarningMessage>
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
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            depositAmount.length === 0 ||
            big(depositAmount).lte(0) ||
            !!invalidDepositAmount
          }
          onClick={() => proceed(status, depositAmount, invalidNextTransaction)}
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
