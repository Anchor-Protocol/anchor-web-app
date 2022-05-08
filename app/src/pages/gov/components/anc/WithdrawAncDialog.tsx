import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import type { DialogProps } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { UIElementProps } from '@libs/ui';
import { TxResultRendering } from '@libs/app-fns';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import big, { Big } from 'big.js';
import { BroadcastTxStreamResult } from 'pages/earn/components/types';
import { DialogTitle } from '@libs/ui/text/DialogTitle';
import { formatTimestamp, microfy } from '@libs/formatter';
import { u } from '@libs/types';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useMyVotingLockPeriodEndsAtQuery } from 'queries';
import { useFixedFee } from '@libs/app-provider';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useRewardsAncGovernanceRewardsQuery } from '@anchor-protocol/app-provider';
import { ANC } from '@anchor-protocol/types';
import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { ViewAddressWarning } from 'components/ViewAddressWarning';

interface WithdrawAncDialogParams extends UIElementProps {
  txResult: StreamResult<TxResultRendering> | null;
}

export type WithdrawAncDialogOuterProps = {};

type WithdrawAncDialogReturn = void;
type WithdrawAncDialogProps = DialogProps<
  WithdrawAncDialogParams,
  WithdrawAncDialogReturn
> & {
  renderBroadcastTxResult?: JSX.Element;
  onProceed: (amount: ANC<string>) => void;
};

export const WithdrawAncDialog = ({
  closeDialog,
  renderBroadcastTxResult,
  txResult,
  onProceed,
  className,
}: WithdrawAncDialogProps) => {
  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const { data: myLockPeriodEndsAt = 0 } = useMyVotingLockPeriodEndsAtQuery();

  const isLockPeriodOver =
    myLockPeriodEndsAt === undefined ? true : myLockPeriodEndsAt < Date.now();

  const [ancAmount, setANCAmount] = useState<ANC>('' as ANC);

  const { uUST } = useBalances();

  const { ust, anc } = useFormatters();

  const { data: { userGovStakingInfo } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  const unstakableBalance = (
    userGovStakingInfo && isLockPeriodOver
      ? big(userGovStakingInfo.balance)
      : Big(0)
  ) as u<ANC<Big>>;

  const invalidTxFee = connected && validateTxFee(uUST, fixedFee);

  const invalidANCAmount =
    ancAmount.length === 0 || !unstakableBalance
      ? undefined
      : big(microfy(ancAmount)).gt(unstakableBalance)
      ? 'Not enough assets'
      : undefined;

  const proceed = useCallback(
    (amount: ANC<string>) => {
      if (onProceed) {
        onProceed(amount);
      }
    },
    [onProceed],
  );

  const renderBroadcastTx = useMemo(() => {
    if (renderBroadcastTxResult) {
      return renderBroadcastTxResult;
    }

    return (
      <TxResultRenderer
        resultRendering={(txResult as BroadcastTxStreamResult).value}
        onExit={closeDialog}
      />
    );
  }, [renderBroadcastTxResult, closeDialog, txResult]);

  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>{renderBroadcastTx}</Dialog>
      </Modal>
    );
  }

  const renderMessage = () => {
    if (!!invalidTxFee) {
      return <MessageBox>{invalidTxFee}</MessageBox>;
    }

    if (!isLockPeriodOver && myLockPeriodEndsAt) {
      return (
        <MessageBox>
          Your ANC is locked until {formatTimestamp(myLockPeriodEndsAt)}
        </MessageBox>
      );
    }

    return null;
  };

  return (
    <Modal open onClose={() => closeDialog()}>
      <Container onClose={() => closeDialog()}>
        <DialogTitle>Unstake ANC</DialogTitle>
        {renderMessage()}

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
                setANCAmount(anc.demicrofy(unstakableBalance))
              }
            >
              {unstakableBalance
                ? anc.formatOutput(anc.demicrofy(unstakableBalance))
                : 0}{' '}
              ANC
            </span>
          </span>
        </div>

        {ancAmount.length > 0 && (
          <TxFeeList className="receipt">
            <TxFeeListItem label="Tx Fee">
              {ust.formatOutput(ust.demicrofy(fixedFee))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ViewAddressWarning>
          <ActionButton
            className="submit"
            disabled={
              !availablePost ||
              !connected ||
              ancAmount.length === 0 ||
              big(ancAmount).lte(0) ||
              !!invalidTxFee ||
              !isLockPeriodOver ||
              !!invalidANCAmount
            }
            onClick={() => proceed(ancAmount)}
          >
            Unstake
          </ActionButton>
        </ViewAddressWarning>
      </Container>
    </Modal>
  );
};

export const Container = styled(Dialog)`
  width: 720px;
  touch-action: none;

  h1 {
    margin-bottom: 50px;
  }

  .input {
    width: 100%;

    .MuiTypography-colorTextSecondary {
      color: currentColor;
    }
  }

  .error-text {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.negative};
  }

  .duration-slider {
    margin-top: 20px;
  }

  .duration-slider--error {
    .thumb-label {
      background-color: ${({ theme }) => theme.colors.negative};
      &::after {
        border-color: ${({ theme }) => theme.colors.negative} transparent
          transparent transparent;
      }
    }
  }

  .graph {
    margin-top: 80px;
    margin-bottom: 40px;
  }

  .receipt {
    margin-top: 30px;
  }

  .submit {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
