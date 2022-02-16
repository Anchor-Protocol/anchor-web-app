import { computeTotalDeposit } from '@anchor-protocol/app-fns';
import {
  useEarnEpochStatesQuery,
  EarnWithdrawFormReturn,
} from '@anchor-protocol/app-provider';
import {
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { UST } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import type { DialogProps } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { useAccount } from 'contexts/account';
import React, { ChangeEvent, useMemo } from 'react';
import styled from 'styled-components';
import { useTokenBalances } from 'contexts/balances';
import { AmountSlider } from './AmountSlider';
import { TxResultRendering } from '@libs/app-fns';
import { UIElementProps } from '@libs/ui';

interface WithdrawDialogParams extends UIElementProps, EarnWithdrawFormReturn {
  txResult: StreamResult<TxResultRendering> | null;
}

type WithdrawDialogReturn = void;

type WithdrawDialogProps = DialogProps<
  WithdrawDialogParams,
  WithdrawDialogReturn
>;

function WithdrawDialogBase(props: WithdrawDialogProps) {
  const {
    className,
    children,
    txResult,
    closeDialog,
    withdrawAmount,
    receiveAmount,
    txFee,
    invalidTxFee,
    invalidWithdrawAmount,
    updateWithdrawAmount,
  } = props;

  const { connected } = useAccount();

  const { uaUST } = useTokenBalances();

  const { data } = useEarnEpochStatesQuery();

  const { totalDeposit } = useMemo(() => {
    return {
      totalDeposit: computeTotalDeposit(uaUST, data?.moneyMarketEpochState),
    };
  }, [data?.moneyMarketEpochState, uaUST]);

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
            updateWithdrawAmount(target.value as UST)
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
                totalDeposit.gt(0) &&
                updateWithdrawAmount(formatUSTInput(demicrofy(totalDeposit)))
              }
            >
              {formatUST(demicrofy(totalDeposit))} UST
            </span>
          </span>
        </div>

        {txFee && (
          <figure className="graph">
            <AmountSlider
              disabled={!connected}
              max={Number(formatUSTInput(demicrofy(totalDeposit)))}
              txFee={Number(formatUST(demicrofy(txFee)))}
              value={Number(withdrawAmount)}
              onChange={(value) => {
                updateWithdrawAmount(formatUSTInput(value.toString() as UST));
              }}
            />
          </figure>
        )}

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

        {children}
      </Dialog>
    </Modal>
  );
}

export const WithdrawDialog = styled(WithdrawDialogBase)`
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

  .graph {
    margin-top: 80px;
    margin-bottom: 40px;
  }

  .receipt {
    margin-top: 30px;
  }

  .button {
    margin-top: 65px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
