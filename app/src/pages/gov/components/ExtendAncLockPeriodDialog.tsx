import { Second } from '@libs/types';
import { DialogProps } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import React, { useCallback, useEffect, useState } from 'react';
import { useBalances } from 'contexts/balances';
import { validateTxFee } from '@anchor-protocol/app-fns';
import { useFixedFee } from '@libs/app-provider';
import { MessageBox } from 'components/MessageBox';
import big from 'big.js';
import { UST_SYMBOL } from '@anchor-protocol/token-symbols';
import { demicrofy } from '@libs/formatter';
import styled from 'styled-components';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { formatOutput } from '@anchor-protocol/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useVotingEscrowConfigQuery } from 'queries/gov/useVotingEscrowConfigQuery';
import { useExtendAncLockPeriodTx } from 'tx/gov/useExtendAncLockPeriodTx';
import { useAccount } from 'contexts/account';
import { StreamStatus } from '@rx-stream/react';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { DurationSlider, SliderPlaceholder } from 'components/sliders';
import { useMyVotingLockPeriod } from 'queries/gov/useMyVotingLockPeriod';

type ExtendAncLockPeriodDialogProps = DialogProps<{}>;

export const ExtendAncLockPeriodDialog = ({
  closeDialog,
}: ExtendAncLockPeriodDialogProps) => {
  const { availablePost, connected } = useAccount();

  const { uUST } = useBalances();
  const fixedFee = useFixedFee();
  const invalidTxFee = validateTxFee(uUST, fixedFee);

  const { data: lockConfig } = useVotingEscrowConfigQuery();
  const [period, setPeriod] = useState<Second | undefined>();
  const currentPeriod = useMyVotingLockPeriod();

  useEffect(() => {
    if (currentPeriod !== undefined && period === undefined) {
      setPeriod(currentPeriod);
    }
  }, [currentPeriod, period]);

  const isSubmitDisabled =
    !availablePost || invalidTxFee || currentPeriod === period;

  const [extendPeriod, extendPeriodResult] = useExtendAncLockPeriodTx();

  const proceed = useCallback(() => {
    if (
      !connected ||
      !extendPeriod ||
      !period ||
      isSubmitDisabled ||
      !currentPeriod
    ) {
      return;
    }

    extendPeriod({
      period: (period - currentPeriod) as Second,
      onTxSucceed: () => {
        closeDialog();
      },
    });
  }, [
    closeDialog,
    connected,
    currentPeriod,
    extendPeriod,
    isSubmitDisabled,
    period,
  ]);

  if (
    extendPeriodResult?.status === StreamStatus.IN_PROGRESS ||
    extendPeriodResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Container>
          <TxResultRenderer
            resultRendering={extendPeriodResult.value}
            onExit={() => {
              switch (extendPeriodResult.status) {
                case StreamStatus.IN_PROGRESS:
                  extendPeriodResult.abort();
                  break;
                case StreamStatus.DONE:
                  extendPeriodResult.clear();
                  break;
              }
              closeDialog();
            }}
          />
        </Container>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Container onClose={() => closeDialog()}>
        <h1>Extend lock period</h1>
        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        {period !== undefined &&
        currentPeriod !== undefined &&
        lockConfig !== undefined ? (
          <DurationSlider
            value={period}
            min={currentPeriod}
            max={lockConfig.maxLockTime}
            step={lockConfig.periodDuration}
            onChange={setPeriod}
          />
        ) : (
          <SliderPlaceholder />
        )}

        <TxFeeList className="receipt">
          {big(fixedFee).gt(0) && (
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {`${formatOutput(demicrofy(fixedFee))} ${UST_SYMBOL}`}
            </TxFeeListItem>
          )}
        </TxFeeList>

        <ActionButton
          className="submit"
          disabled={isSubmitDisabled}
          onClick={proceed}
        >
          Extend
        </ActionButton>
      </Container>
    </Modal>
  );
};

export const Container = styled(Dialog)`
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

  .submit {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
