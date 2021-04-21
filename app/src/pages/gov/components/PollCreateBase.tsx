import { ExecuteMsg } from '@anchor-protocol/anchor.js';
import {
  demicrofy,
  formatANC,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ANC, uUST } from '@anchor-protocol/types';
import {
  useConnectedWallet,
  ConnectedWallet,
} from '@anchor-protocol/wallet-provider';
import { InputAdornment } from '@material-ui/core';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { TextInput } from '@terra-dev/neumorphism-ui/components/TextInput';
import {
  BytesValid,
  useValidateStringBytes,
} from '@terra-dev/use-string-bytes-length';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { validateLinkAddress } from '../logics/validateLinkAddress';
import { usePollConfig } from '../queries/pollConfig';
import { createPollOptions } from '../transactions/createPollOptions';
import { FormLayout } from './FormLayout';

export interface PollCreateBaseProps {
  pollTitle: ReactNode;
  children: ReactNode;
  submitDisabled: boolean;
  onCreateMsgs: () => ExecuteMsg[] | undefined;
}

export function PollCreateBase({
  pollTitle,
  children,
  submitDisabled,
  onCreateMsgs,
}: PollCreateBaseProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { fixedGas } = useConstants();

  const history = useHistory();

  const [createPoll, createPollResult] = useOperation(createPollOptions, {});

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const txFee = fixedGas;

  const [title, setTitle] = useState<string>('');

  const [description, setDescription] = useState<string>('');

  const [link, setLink] = useState<string>('');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: { pollConfig },
  } = usePollConfig();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidTitleBytes = useValidateStringBytes(title, 4, 64);

  const invalidDescriptionBytes = useValidateStringBytes(description, 4, 1024);

  const invalidLinkBytes = useValidateStringBytes(link, 12, 128);

  const invalidLinkProtocol = useMemo(() => validateLinkAddress(link), [link]);

  const invalidUserANCBalance = useMemo(() => {
    if (!pollConfig || !connectedWallet) {
      return undefined;
    }

    return big(bank.userBalances.uANC).lt(pollConfig.proposal_deposit)
      ? `Not enough ANC`
      : undefined;
  }, [bank.userBalances.uANC, pollConfig, connectedWallet]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const goToGov = useCallback(() => {
    history.push('/gov');
  }, [history]);

  const submit = useCallback(
    async (
      walletReady: ConnectedWallet,
      title: string,
      description: string,
      link: string,
      amount: ANC,
    ) => {
      const execute_msgs = onCreateMsgs();

      if (execute_msgs && execute_msgs.length !== 1) {
        return;
      }

      await createPoll({
        address: walletReady.walletAddress,
        amount,
        title,
        description,
        link: link.length > 0 ? link : undefined,
        execute_msgs,
        txFee: txFee.toString() as uUST,
      });
    },
    [createPoll, onCreateMsgs, txFee],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    createPollResult?.status === 'in-progress' ||
    createPollResult?.status === 'done' ||
    createPollResult?.status === 'fault'
  ) {
    return (
      <FormLayout>
        <Section>
          <TransactionRenderer result={createPollResult} onExit={goToGov} />
        </Section>
      </FormLayout>
    );
  }

  return (
    <FormLayout>
      <Section>
        <h1>{pollTitle}</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <div className="description">
          <p>Title</p>
          <p />
        </div>

        <TextInput
          placeholder="Title"
          value={title}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setTitle(target.value)
          }
          error={!!invalidTitleBytes}
          helperText={
            invalidTitleBytes === BytesValid.LESS
              ? 'Title must be at least 4 bytes.'
              : invalidTitleBytes === BytesValid.MUCH
              ? 'Title cannot be longer than 64 bytes.'
              : undefined
          }
        />

        <div className="description">
          <p>Proposal Rational</p>
          <p />
        </div>

        <TextInput
          placeholder="Proposal Rational"
          multiline
          rows={4}
          value={description}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setDescription(target.value)
          }
          error={!!invalidDescriptionBytes}
          helperText={
            invalidDescriptionBytes === BytesValid.LESS
              ? 'Proposal rational must be at least 4 bytes.'
              : invalidDescriptionBytes === BytesValid.MUCH
              ? 'Proposal rational cannot be longer than 1024 bytes.'
              : undefined
          }
        />

        <div className="description">
          <p>Information Link</p>
          <p />
        </div>

        <TextInput
          placeholder="Information Link"
          value={link}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setLink(target.value)
          }
          error={!!invalidLinkBytes || !!invalidLinkProtocol}
          helperText={
            invalidLinkBytes === BytesValid.LESS
              ? 'Information link must be at least 12 bytes.'
              : invalidLinkBytes === BytesValid.MUCH
              ? 'Information link cannot be longer than 128 bytes.'
              : invalidLinkProtocol
          }
        />

        {children}

        <div className="description">
          <p>
            <IconSpan>
              Deposit{' '}
              <InfoTooltip>
                Passing the quorum will return the deposit to the creator.
                Failure to pass quorum will distribute the deposit to all ANC
                stakers.
              </InfoTooltip>
            </IconSpan>
          </p>
          <p />
        </div>

        <TextInput
          placeholder="0.000"
          InputProps={{
            endAdornment: <InputAdornment position="end">ANC</InputAdornment>,
            readOnly: true,
          }}
          value={
            pollConfig ? formatANC(demicrofy(pollConfig.proposal_deposit)) : '0'
          }
          error={!!invalidUserANCBalance}
          helperText={invalidUserANCBalance}
        />

        <TxFeeList className="receipt">
          <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
            {formatUSTWithPostfixUnits(demicrofy(txFee))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ActionButton
          className="proceed"
          disabled={
            submitDisabled ||
            !connectedWallet ||
            !connectedWallet.availablePost ||
            title.length === 0 ||
            description.length === 0 ||
            !!invalidUserANCBalance ||
            !!invalidTxFee ||
            !!invalidTitleBytes ||
            !!invalidDescriptionBytes ||
            !!invalidLinkBytes ||
            !!invalidLinkProtocol
          }
          onClick={() =>
            connectedWallet &&
            pollConfig &&
            submit(
              connectedWallet,
              title,
              description,
              link,
              demicrofy(pollConfig.proposal_deposit).toString() as ANC,
            )
          }
        >
          Submit
        </ActionButton>
      </Section>
    </FormLayout>
  );
}
