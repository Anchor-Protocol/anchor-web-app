import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { formatANC } from '@anchor-protocol/notation';
import { ANC, CW20Addr, Rate, uUST } from '@anchor-protocol/types';
import { PollMsg } from '@anchor-protocol/types/contracts/anchorToken/gov';
import { useValidateStringBytes } from '@anchor-protocol/use-string-bytes-length';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useContractAddress } from 'contexts/contract';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { FormLayout } from 'pages/gov/components/FormLayout';
import { validateLinkAddress } from 'pages/gov/logics/validateLinkAddress';
import { createPollOptions } from 'pages/gov/transactions/createPollOptions';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

export interface PollCreateModifyCollateralAttributeProps {
  className?: string;
}

function bytesHelperText(invalidStatus: 'less' | 'much' | undefined) {
  return invalidStatus === 'less'
    ? 'Too Short'
    : invalidStatus === 'much'
    ? 'Too Long'
    : undefined;
}

interface Item {
  label: string;
  value: CW20Addr;
}

function PollCreateModifyCollateralAttributeBase({
  className,
}: PollCreateModifyCollateralAttributeProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const address = useContractAddress();

  const [createPoll, createPollResult] = useOperation(createPollOptions, {});

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const txFee = fixedGas;

  const bAssetItems = useMemo<Item[]>(() => {
    return [{ label: 'bLuna', value: address.cw20.bLuna }];
  }, [address.cw20.bLuna]);

  const [title, setTitle] = useState<string>('');

  const [description, setDescription] = useState<string>('');

  const [link, setLink] = useState<string>('');

  const [bAsset, setBAsset] = useState<Item>(() => bAssetItems[0]);

  const [ltv, setLtv] = useState<string>('');

  const [amount] = useState<ANC>(() => '100' as ANC);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidTitleBytes = useValidateStringBytes(title, 4, 64);

  const invalidDescriptionBytes = useValidateStringBytes(description, 4, 1024);

  const invalidLinkBytes = useValidateStringBytes(link, 12, 128);

  const invalidLinkProtocol = useMemo(() => validateLinkAddress(link), [link]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const init = useCallback(() => {
    setTitle('');
    setDescription('');
    setLink('');
    setBAsset(bAssetItems[0]);
    setLtv('');
  }, [bAssetItems]);

  const submit = useCallback(
    async (
      walletReady: WalletReady,
      title: string,
      description: string,
      link: string,
      bAsset: Item,
      ltv: string,
      amount: ANC,
    ) => {
      const msg: PollMsg = {
        update_whitelist: {
          collateral_token: bAsset.value,
          max_ltv: big(ltv).div(100).toFixed() as Rate,
        },
      };

      const broadcasted = await createPoll({
        address: walletReady.walletAddress,
        amount,
        title,
        description,
        link: link.length > 0 ? link : undefined,
        execute_msgs: [
          {
            order: 1,
            contract: address.moneyMarket.overseer,
            msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
            //msg: btoa(JSON.stringify(msg)),
          },
        ],
        txFee: txFee.toString() as uUST,
      });

      if (!broadcasted) {
        init();
      }
    },
    [address.moneyMarket.overseer, createPoll, init, txFee],
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
      <FormLayout className={className}>
        <Section>
          <TransactionRenderer result={createPollResult} onExit={init} />
        </Section>
      </FormLayout>
    );
  }

  return (
    <FormLayout className={className}>
      <Section>
        <h1>Modify Collateral Attribute</h1>

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

        <div className="description">
          <p>Collateral bAsset</p>
          <p />
        </div>

        <NativeSelect
          className="bAsset"
          style={{ width: '100%' }}
          data-selected-value={bAsset.value}
          value={bAsset.value}
          onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
            setBAsset(
              bAssetItems?.find(({ value }) => target.value === value) ??
                bAssetItems[0],
            )
          }
        >
          {bAssetItems.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>

        <div className="description">
          <p>Max LTV</p>
          <p />
        </div>

        <NumberInput
          placeholder="MAX LTV"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          value={ltv}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setLtv(target.value)
          }
        />

        <div className="description">
          <p>Deposit</p>
          <p />
        </div>

        <TextInput
          placeholder="0.000"
          InputProps={{
            endAdornment: <InputAdornment position="end">ANC</InputAdornment>,
          }}
          value={formatANC(amount)}
          disabled
        />

        <TxFeeList className="receipt">
          <TxFeeListItem
            label={
              <IconSpan>
                Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
              </IconSpan>
            }
          >
            0 UST
          </TxFeeListItem>
        </TxFeeList>

        <ActionButton
          className="proceed"
          disabled={
            !serviceAvailable ||
            title.length === 0 ||
            description.length === 0 ||
            ltv.length === 0 ||
            !!invalidTxFee ||
            !!invalidTitleBytes ||
            !!invalidDescriptionBytes ||
            !!invalidLinkBytes ||
            !!invalidLinkProtocol
          }
          onClick={() =>
            walletReady &&
            submit(walletReady, title, description, link, bAsset, ltv, amount)
          }
        >
          Submit
        </ActionButton>
      </Section>
    </FormLayout>
  );
}

export const PollCreateModifyCollateralAttribute = styled(
  PollCreateModifyCollateralAttributeBase,
)``;
