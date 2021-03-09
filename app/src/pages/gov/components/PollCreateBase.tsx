import { ExecuteMsg } from '@anchor-protocol/anchor.js';
import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import {
  demicrofy,
  formatANC,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ANC, uUST } from '@anchor-protocol/types';
import { useValidateStringBytes } from '@anchor-protocol/use-string-bytes-length';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { InputAdornment } from '@material-ui/core';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from '@anchor-protocol/web-contexts/contexts/bank';
import { useConstants } from '@anchor-protocol/web-contexts/contexts/contants';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { FormLayout } from 'pages/gov/components/FormLayout';
import { bytesHelperText } from 'pages/gov/logics/bytesHelperText';
import { validateLinkAddress } from 'pages/gov/logics/validateLinkAddress';
import { usePollConfig } from 'pages/gov/queries/pollConfig';
import { createPollOptions } from 'pages/gov/transactions/createPollOptions';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';

export interface PollCreateBaseProps {
  pollTitle: ReactNode;
  children: ReactNode;
  submitDisabled: boolean;
  onCreateMsgs: () => ExecuteMsg[];
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
  const { serviceAvailable, walletReady } = useService();

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
  const invalidTxFee = useMemo(() => validateTxFee(bank, fixedGas), [
    bank,
    fixedGas,
  ]);

  const invalidTitleBytes = useValidateStringBytes(title, 4, 64);

  const invalidDescriptionBytes = useValidateStringBytes(description, 4, 1024);

  const invalidLinkBytes = useValidateStringBytes(link, 12, 128);

  const invalidLinkProtocol = useMemo(() => validateLinkAddress(link), [link]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const goToGov = useCallback(() => {
    history.push('/gov');
  }, [history]);

  const submit = useCallback(
    async (
      walletReady: WalletReady,
      title: string,
      description: string,
      link: string,
      amount: ANC,
    ) => {
      const execute_msgs = onCreateMsgs();

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
          helperText={bytesHelperText(invalidTitleBytes)}
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
          helperText={bytesHelperText(invalidDescriptionBytes)}
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
            bytesHelperText(invalidTitleBytes) ?? invalidLinkProtocol
              ? 'Only allow starts with http:// or https://'
              : undefined
          }
        />

        {children}

        <div className="description">
          <p>Deposit</p>
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
            !serviceAvailable ||
            title.length === 0 ||
            description.length === 0 ||
            !!invalidTxFee ||
            !!invalidTitleBytes ||
            !!invalidDescriptionBytes ||
            !!invalidLinkBytes ||
            !!invalidLinkProtocol
          }
          onClick={() =>
            walletReady &&
            pollConfig &&
            submit(
              walletReady,
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
