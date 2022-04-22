import { CW20Addr } from '@libs/types';
import { DialogProps } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import React, { ChangeEvent, useState } from 'react';
import { useBalances } from 'contexts/balances';
import { validateTxFee } from '@anchor-protocol/app-fns';
import { useFixedFee } from '@libs/app-provider';
import { MessageBox } from 'components/MessageBox';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { useVotingPowerQuery } from 'queries';
import { veANC } from '@anchor-protocol/types';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatVeAnc,
  formatVeAncInput,
} from '@anchor-protocol/notation';
import big from 'big.js';
import { InputAdornment } from '@material-ui/core';
import { UST_SYMBOL, VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { demicrofy, microfy } from '@libs/formatter';
import styled from 'styled-components';
import { AmountSlider } from 'pages/earn/components/AmountSlider';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { formatOutput } from '@anchor-protocol/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useMutation } from 'react-query';

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

  const [amount, setAmount] = useState<veANC>('' as veANC);

  const { data: userAmount } = useVotingPowerQuery();

  const invalidAmount =
    amount.length === 0 || !userAmount
      ? undefined
      : big(microfy(amount)).gt(userAmount)
      ? 'Not enough assets'
      : undefined;

  const { mutate: requestVote } = useMutation(
    async () => {
      console.log(`Making a vote ${tokenAddress}`);
    },
    {
      onSettled: closeDialog,
    },
  );

  return (
    <Modal open onClose={() => closeDialog()}>
      <Container onClose={() => closeDialog()}>
        <h1>Vote</h1>
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
                userAmount
                  ? {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }
                  : undefined
              }
              onClick={() =>
                userAmount && setAmount(formatVeAncInput(demicrofy(userAmount)))
              }
            >
              {userAmount ? formatVeAnc(demicrofy(userAmount)) : 0}{' '}
              {VEANC_SYMBOL}
            </span>
          </span>
        </div>

        {userAmount && (
          <figure className="graph">
            <AmountSlider
              max={Number(demicrofy(userAmount))}
              value={Number(amount)}
              onChange={(value) => {
                setAmount(formatVeAncInput(value.toString() as veANC));
              }}
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
          disabled={invalidTxFee || invalidAmount}
          onClick={requestVote}
        >
          Vote
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
