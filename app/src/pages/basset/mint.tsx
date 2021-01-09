import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators/basset/basset-bond';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { MICRO, toFixedNoRounding } from '@anchor-protocol/notation';
import {
  BroadcastableQueryOptions,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient } from '@apollo/client';
import {
  Input as MuiInput,
  InputAdornment,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import { Error as ErrorIcon } from '@material-ui/icons';
import { CreateTxOptions } from '@terra-money/terra.js';
import * as txi from 'api/queries/txInfos';
import { queryOptions } from 'api/transactions/queryOptions';
import {
  parseResult,
  StringifiedTxResult,
  TxResult,
} from 'api/transactions/tx';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'api/transactions/TxResultRenderer';
import big from 'big.js';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { transactionFee } from 'env';
import React, { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useExchangeRate } from './queries/exchangeRate';
import * as val from './queries/validators';
import { useValidators } from './queries/validators';

export interface MintProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const bondCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];
const mintCurrencies: Item[] = [{ label: 'bLuna', value: 'bluna' }];

function MintBase({ className }: MintProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [fetchMint, mintResult, resetMintResult] = useBroadcastableQuery(
    mintQueryOptions,
  );

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [bondAmount, setBondAmount] = useState<string>('');

  const [mintCurrency, setMintCurrency] = useState<Item>(
    () => mintCurrencies[0],
  );

  const [bondCurrency, setBondCurrency] = useState<Item>(
    () => bondCurrencies[0],
  );

  const [selectedValidator, setSelectedValidator] = useState<
    val.Data['validators'][number] | null
  >(null);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { parsedData: validators } = useValidators({
    bAsset: mintCurrency.value,
  });
  const { parsedData: exchangeRate } = useExchangeRate({
    bAsset: mintCurrency.value,
  });

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const bondInputError = useMemo<ReactNode>(() => {
    if (
      big(bondAmount.length > 0 ? bondAmount : 0)
        .mul(MICRO)
        .gt(big(bank.userBalances.uLuna ?? 0))
    ) {
      return `Insufficient balance: Not enough Assets (${big(
        bank.userBalances.uLuna ?? 0,
      ).div(MICRO)} Luna)`;
    }
    return undefined;
  }, [bank.userBalances.uLuna, bondAmount]);

  console.log('mint.tsx..MintBase()', {exchangeRate, mintResult});

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    mintResult?.status === 'in-progress' ||
    mintResult?.status === 'done' ||
    mintResult?.status === 'error'
  ) {
    return (
      <Section className={className}>
        <TxResultRenderer result={mintResult} resetResult={resetMintResult} />
      </Section>
    );
  }

  return (
    <Section className={className}>
      <div className="bond-description">
        <p>I want to bond</p>
        <p>
          {exchangeRate &&
            `1 Luna = ${toFixedNoRounding(
              big(1).div(exchangeRate.exchange_rate),
            )} bLuna`}
        </p>
      </div>

      <SelectAndTextInputContainer className="bond">
        <MuiNativeSelect
          value={bondCurrency}
          onChange={(evt) =>
            setBondCurrency(
              bondCurrencies.find(({ value }) => evt.target.value === value) ??
                bondCurrencies[0],
            )
          }
          IconComponent={bondCurrencies.length < 2 ? BlankComponent : undefined}
          disabled={bondCurrencies.length < 2}
        >
          {bondCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>

        <MuiInput
          type="number"
          placeholder="0.00"
          error={!!bondInputError}
          endAdornment={
            bondInputError ? (
              <InputAdornment position="end">
                <Tooltip
                  open
                  color="error"
                  title={bondInputError}
                  placement="top"
                >
                  <ErrorIcon />
                </Tooltip>
              </InputAdornment>
            ) : undefined
          }
          value={bondAmount}
          onChange={({ target }) => setBondAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      <div className="mint-description">
        <p>and mint</p>
        <p>
          {exchangeRate &&
            `1 bLuna = ${toFixedNoRounding(exchangeRate.exchange_rate)} Luna`}
        </p>
      </div>

      <SelectAndTextInputContainer className="mint">
        <MuiNativeSelect
          value={mintCurrency}
          onChange={(evt) =>
            setMintCurrency(
              mintCurrencies.find(({ value }) => evt.target.value === value) ??
                mintCurrencies[0],
            )
          }
          IconComponent={mintCurrencies.length < 2 ? BlankComponent : undefined}
          disabled={mintCurrencies.length < 2}
        >
          {mintCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput
          placeholder="0.00"
          value={
            bondAmount.length > 0
              ? big(bondAmount)
                  .mul(big(exchangeRate?.exchange_rate ?? 0))
                  .toString()
              : ''
          }
          disabled
        />
      </SelectAndTextInputContainer>

      <HorizontalRuler />

      <NativeSelect
        className="validator"
        data-selected-value={selectedValidator?.OperatorAddress ?? ''}
        value={selectedValidator?.OperatorAddress ?? ''}
        onChange={({ target }) =>
          setSelectedValidator(
            validators?.whitelistedValidators.find(
              ({ OperatorAddress }) => target.value === OperatorAddress,
            ) ?? null,
          )
        }
        disabled={validators?.whitelistedValidators.length === 0}
      >
        <option value="">Select validator</option>
        {validators?.whitelistedValidators.map(
          ({ Description, OperatorAddress }) => (
            <option key={OperatorAddress} value={OperatorAddress}>
              {Description.Moniker}
            </option>
          ),
        )}
      </NativeSelect>

      {status.status === 'ready' &&
      selectedValidator &&
      bondAmount.length > 0 &&
      big(bondAmount).gt(0) &&
      !bondInputError ? (
        <ActionButton
          className="submit"
          onClick={() =>
            fetchMint({
              post: post<CreateTxOptions, StringifiedTxResult>({
                ...transactionFee,
                msgs: fabricatebAssetBond({
                  address: status.walletAddress,
                  amount: big(bondAmount).toNumber(),
                  bAsset: mintCurrency.value,
                  validator: selectedValidator.OperatorAddress,
                })(addressProvider),
              })
                .then(({ payload }) => payload)
                .then(parseResult),
              client,
            }).then((data) => {
              if (data) {
                // the meaning that data is exists is this component does not unmounted
                setBondAmount('');
                setSelectedValidator(null);
              }
            })
          }
        >
          Mint
        </ActionButton>
      ) : (
        <ActionButton className="submit" disabled>
          Mint
        </ActionButton>
      )}
    </Section>
  );
}

const mintQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'basset/mint',
  notificationFactory: txNotificationFactory,
};

function BlankComponent() {
  return <div />;
}

export const Mint = styled(MintBase)`
  .bond-description,
  .mint-description {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 16px;
    color: ${({ theme }) => theme.dimTextColor};

    > :last-child {
      font-size: 12px;
    }

    margin-bottom: 12px;
  }

  .bond,
  .mint {
    margin-bottom: 30px;

    > :first-child {
      width: 100px;
    }

    > :nth-child(2) {
      flex: 1;
    }
  }

  hr {
    margin: 40px 0;
  }

  .validator {
    width: 100%;
    margin-bottom: 40px;

    &[data-selected-value=''] {
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
