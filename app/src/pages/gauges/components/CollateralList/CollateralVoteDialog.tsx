import { CW20Addr, u } from '@libs/types';
import { DialogProps } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useBalances } from 'contexts/balances';
import { validateTxFee } from '@anchor-protocol/app-fns';
import { useFixedFee } from '@libs/app-provider';
import { MessageBox } from 'components/MessageBox';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { useMyVotingPowerQuery } from 'queries';
import { veANC } from '@anchor-protocol/types';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatVeAnc,
  formatVeAncInput,
} from '@anchor-protocol/notation';
import big, { BigSource } from 'big.js';
import { InputAdornment } from '@material-ui/core';
import { UST_SYMBOL, VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { demicrofy, microfy } from '@libs/formatter';
import styled from 'styled-components';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { formatOutput } from '@anchor-protocol/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useMyGaugeVotesQuery } from 'queries/gov/useMyGaugeVotesQuery';
import { AmountSlider } from 'components/sliders';
import { DialogTitle } from '@libs/ui/text/DialogTitle';
import { useVoteForGaugeWeightTx } from 'tx/terra/useVoteForGaugeWeightTx';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { StreamStatus } from '@rx-stream/react';
import { computeGaugeVoteRatio } from 'pages/gauges/logics/computeGaugeVoteRatio';
import { useMyAvailableVotingPowerQuery } from 'queries/gov/useMyAvailableVotingPowerQuery';

export interface CollateralVoteDialogParams {
  tokenAddress: CW20Addr;
}

type CollateralVoteDialogProps = DialogProps<CollateralVoteDialogParams>;

export const CollateralVoteDialog = ({
  tokenAddress,
  closeDialog,
}: CollateralVoteDialogProps) => {
  const { uUST } = useBalances();
  const fixedFee = useFixedFee();
  const invalidTxFee = validateTxFee(uUST, fixedFee);

  const { data: myVotes } = useMyGaugeVotesQuery();
  const currentAmount =
    myVotes?.votesRecord[tokenAddress]?.amount || (0 as u<veANC<BigSource>>);

  const [amount, setAmount] = useState<veANC>(
    () => demicrofy(currentAmount).toString() as veANC,
  );

  const { data: availableVotingPower } = useMyAvailableVotingPowerQuery();
  const maxAmount = big(availableVotingPower || 0).add(currentAmount) as u<
    veANC<BigSource>
  >;

  const { data: myTotalVotingPower } = useMyVotingPowerQuery();

  const [voteForGaugeWeight, voteForGaugeWeightResult] =
    useVoteForGaugeWeightTx();

  const invalidAmount =
    amount.length === 0 || !maxAmount
      ? undefined
      : big(microfy(amount)).gt(maxAmount)
      ? 'Not enough assets'
      : undefined;

  const proceed = useCallback(() => {
    if (voteForGaugeWeight && myTotalVotingPower !== undefined) {
      voteForGaugeWeight({
        gaugeAddr: tokenAddress,
        ratio: computeGaugeVoteRatio(amount, demicrofy(myTotalVotingPower)),
      });
    }
  }, [amount, myTotalVotingPower, tokenAddress, voteForGaugeWeight]);

  const isSubmitDisabled =
    invalidTxFee ||
    invalidAmount ||
    big(currentAmount).eq(microfy(amount)) ||
    myTotalVotingPower === undefined;

  if (
    voteForGaugeWeightResult?.status === StreamStatus.IN_PROGRESS ||
    voteForGaugeWeightResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Container>
          <TxResultRenderer
            resultRendering={voteForGaugeWeightResult.value}
            onExit={() => {
              switch (voteForGaugeWeightResult.status) {
                case StreamStatus.IN_PROGRESS:
                  voteForGaugeWeightResult.abort();
                  break;
                case StreamStatus.DONE:
                  voteForGaugeWeightResult.clear();
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
        <DialogTitle>Vote</DialogTitle>
        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={amount}
          maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
          error={!!invalidAmount}
          placeholder="0.00"
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setAmount(target.value as veANC)
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{VEANC_SYMBOL}</InputAdornment>
            ),
          }}
        />

        <div className="wallet" aria-invalid={!!invalidAmount}>
          <span>{invalidAmount}</span>
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
                maxAmount && setAmount(formatVeAncInput(demicrofy(maxAmount)))
              }
            >
              {maxAmount ? formatVeAnc(demicrofy(maxAmount)) : 0} {VEANC_SYMBOL}
            </span>
          </span>
        </div>

        {maxAmount && (
          <figure className="graph">
            <AmountSlider
              max={Number(demicrofy(maxAmount))}
              value={Number(amount)}
              onChange={(value) => {
                setAmount(formatVeAncInput(value.toString() as veANC));
              }}
              symbol={VEANC_SYMBOL}
            />
          </figure>
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
          {currentAmount ? 'Update vote' : 'Vote'}
        </ActionButton>
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
    margin-top: 20px;
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
