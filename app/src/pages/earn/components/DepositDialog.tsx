import {
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { UST } from '@anchor-protocol/types';
import { EarnDepositFormReturn } from '@anchor-protocol/app-provider';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import type { DialogProps } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { useAccount } from 'contexts/account';
import { AmountSlider } from './AmountSlider';
import { UIElementProps } from '@libs/ui';
import { TxResultRendering } from '@libs/app-fns';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';

interface DepositDialogParams extends UIElementProps, EarnDepositFormReturn {
  txResult: StreamResult<TxResultRendering> | null;
}

type DepositDialogReturn = void;

type DepositDialogProps = DialogProps<DepositDialogParams, DepositDialogReturn>;

function DepositDialogBase(props: DepositDialogProps) {
  const {
    className,
    children,
    txResult,
    closeDialog,
    depositAmount,
    txFee,
    sendAmount,
    maxAmount,
    invalidTxFee,
    invalidNextTxFee,
    invalidDepositAmount,
    updateDepositAmount,
  } = props;

  const account = useAccount();

  const {
    ust: { formatOutput, formatInput, demicrofy, symbol },
  } = useFormatters();

  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={txResult.value}
            onExit={closeDialog}
          />
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
            updateDepositAmount(target.value as UST)
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
                updateDepositAmount(formatInput(demicrofy(maxAmount)))
              }
            >
              {maxAmount ? formatOutput(demicrofy(maxAmount)) : 0} {symbol}
            </span>
          </span>
        </div>
        {txFee && (
          <figure className="graph">
            <AmountSlider
              disabled={!account.connected}
              max={Number(formatInput(demicrofy(maxAmount)))}
              txFee={Number(formatOutput(demicrofy(txFee)))}
              value={Number(depositAmount)}
              onChange={(value) => {
                updateDepositAmount(formatInput(value.toString() as UST));
              }}
            />
          </figure>
        )}

        {txFee && sendAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {`${formatOutput(demicrofy(txFee))} ${symbol}`}
            </TxFeeListItem>
            <TxFeeListItem label="Send Amount">
              {`${formatOutput(demicrofy(sendAmount))} ${symbol}`}
            </TxFeeListItem>
          </TxFeeList>
        )}

        {invalidNextTxFee && maxAmount && (
          <MessageBox style={{ marginTop: 30, marginBottom: 0 }}>
            {invalidNextTxFee}
          </MessageBox>
        )}

        {children}
      </Dialog>
    </Modal>
  );
}

export const DepositDialog = styled(DepositDialogBase)`
  width: 720px;
  touch-action: none;

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

  .graph {
    margin-top: 80px;
    margin-bottom: 40px;
  }

  .receipt {
    margin-top: 30px;
  }

  .button {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
