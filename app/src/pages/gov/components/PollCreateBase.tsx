import { ExecuteMsg } from '@anchor-protocol/app-fns';
import {
  formatANC,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ANC } from '@anchor-protocol/types';
import {
  useGovConfigQuery,
  useGovCreatePollTx,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import {
  BytesValid,
  useValidateStringBytes,
} from '@libs/use-string-bytes-length';
import { InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { validateTxFee } from '@anchor-protocol/app-fns';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { validateLinkAddress } from '../logics/validateLinkAddress';
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
  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const navigate = useNavigate();

  const [createPoll, createPollResult] = useGovCreatePollTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const txFee = fixedFee;

  const [title, setTitle] = useState<string>('');

  const [description, setDescription] = useState<string>('');

  const [link, setLink] = useState<string>('');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const { data: { govConfig: pollConfig } = {} } = useGovConfigQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => connected && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connected],
  );

  const invalidTitleBytes = useValidateStringBytes(title, 4, 64);

  const invalidDescriptionBytes = useValidateStringBytes(description, 4, 1024);

  const invalidLinkBytes = useValidateStringBytes(link, 12, 128);

  const invalidLinkProtocol = useMemo(() => validateLinkAddress(link), [link]);

  const invalidUserANCBalance = useMemo(() => {
    if (!pollConfig || !connected) {
      return undefined;
    }

    return big(bank.tokenBalances.uANC).lt(pollConfig.proposal_deposit)
      ? `Not enough ANC`
      : undefined;
  }, [bank.tokenBalances.uANC, pollConfig, connected]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const goToGov = useCallback(() => {
    navigate('/gov');
  }, [navigate]);

  const submit = useCallback(
    (
      //walletReady: ConnectedWallet,
      title: string,
      description: string,
      link: string,
      amount: ANC,
    ) => {
      if (!connected || !createPoll) {
        return;
      }

      const executeMsgs = onCreateMsgs();

      //if (executeMsgs && executeMsgs.length !== 1) {
      //  return;
      //}

      createPoll({
        amount,
        title,
        description,
        link: link.length > 0 ? link : undefined,
        executeMsgs,
      });
    },
    [connected, createPoll, onCreateMsgs],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    createPollResult?.status === StreamStatus.IN_PROGRESS ||
    createPollResult?.status === StreamStatus.DONE
  ) {
    return (
      <FormLayout>
        <Section>
          <TxResultRenderer
            resultRendering={createPollResult.value}
            onExit={goToGov}
          />
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

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={
              submitDisabled ||
              !availablePost ||
              !connected ||
              !createPoll ||
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
              pollConfig &&
              submit(
                title,
                description,
                link,
                demicrofy(pollConfig.proposal_deposit).toString() as ANC,
              )
            }
          >
            Submit
          </ActionButton>
        </ViewAddressWarning>
      </Section>
    </FormLayout>
  );
}
