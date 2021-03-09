import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatUST,
  microfy,
} from '@anchor-protocol/notation';
import { ANC } from '@anchor-protocol/types';
import {
  DialogProps,
  OpenDialog,
  useDialog,
} from '@anchor-protocol/use-dialog';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { ThumbDown, ThumbUp } from '@material-ui/icons';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { voteOptions } from 'pages/gov/transactions/voteOptions';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  pollId: number;
}

type FormReturn = void;

export function usePollVoteDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
  pollId,
}: DialogProps<FormParams, FormReturn>) {
  const [vote, voteResult] = useOperation(voteOptions, {});

  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const bank = useBank();

  const [voteFor, setVoteFor] = useState<null | 'yes' | 'no'>(null);
  const [amount, setAmount] = useState<ANC>('' as ANC);

  const invalidTxFee = useMemo(() => validateTxFee(bank, fixedGas), [
    bank,
    fixedGas,
  ]);

  const invalidAmount = useMemo(() => {
    if (amount.length === 0) return undefined;

    return microfy(amount).gt(bank.userBalances.uANC)
      ? 'Not enough assets'
      : undefined;
  }, [amount, bank.userBalances.uANC]);

  const txFee = fixedGas;

  const submit = useCallback(
    async (walletReady: WalletReady, voteFor: 'yes' | 'no', amount: ANC) => {
      await vote({
        address: walletReady.walletAddress,
        poll_id: pollId,
        vote: voteFor,
        amount,
      });
    },
    [pollId, vote],
  );

  if (
    voteResult?.status === 'in-progress' ||
    voteResult?.status === 'done' ||
    voteResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <TransactionRenderer result={voteResult} onExit={closeDialog} />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Vote</h1>

        <MessageBox
          level="info"
          hide={{ id: 'vote', period: 1000 * 60 * 60 * 24 * 7 }}
        >
          Vote cannot be changed after submission. Staked ANC used to vote in
          polls are locked and cannot be withdrawn until the poll finishes.
        </MessageBox>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <ul className="vote">
          <li
            data-selected={voteFor === 'yes'}
            onClick={() => setVoteFor('yes')}
          >
            <IconSpan>
              <ThumbUp /> YES
            </IconSpan>
          </li>
          <li data-selected={voteFor === 'no'} onClick={() => setVoteFor('no')}>
            <IconSpan>
              <ThumbDown /> NO
            </IconSpan>
          </li>
        </ul>

        <NumberInput
          className="amount"
          value={amount}
          maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidAmount}
          helperText={invalidAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setAmount(target.value as ANC)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">ANC</InputAdornment>,
          }}
        />

        {txFee && (
          <TxFeeList className="receipt">
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="submit"
          disabled={
            !serviceAvailable ||
            amount.length === 0 ||
            !voteFor ||
            big(amount).lte(0) ||
            !!invalidTxFee ||
            !!invalidAmount
          }
          onClick={() =>
            walletReady && !!voteFor && submit(walletReady, voteFor, amount)
          }
        >
          Submit
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

  .vote {
    list-style: none;
    padding: 0;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 100px;
    grid-gap: 20px;

    li {
      cursor: pointer;
      display: grid;
      place-content: center;
      color: ${({ theme }) => theme.dimTextColor};
      border: 1px solid currentColor;
      border-radius: 5px;

      &[data-selected='true'] {
        color: ${({ theme }) => theme.textColor};
      }
    }

    margin-bottom: 20px;
  }

  .amount {
    width: 100%;
    margin-bottom: 40px;

    .MuiTypography-colorTextSecondary {
      color: currentColor;
    }
  }

  .receipt {
    margin-bottom: 30px;
  }

  .submit {
    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
