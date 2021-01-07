import { fabricatebAssetBurn } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { MICRO, toFixedNoRounding } from '@anchor-protocol/number-notation';
import {
  BroadcastableQueryOptions,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient, useQuery } from '@apollo/client';
import {
  Input as MuiInput,
  InputAdornment,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import { Error as ErrorIcon } from '@material-ui/icons';
import { CreateTxOptions } from '@terra-money/terra.js';
import big from 'big.js';
import { transactionFee } from 'env';
import * as exc from 'pages/basset/queries/exchangeRate';
import * as txi from 'queries/txInfos';
import * as bas from 'queries/userBAssetBalance';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'transactions/TxResultRenderer';
import React, { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAddressProvider } from '../../providers/address-provider';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';

export interface BurnProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const gettCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];

const burnCurrencies: Item[] = [{ label: 'bLuna', value: 'bluna' }];

function BurnBase({ className }: BurnProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [fetchBurn, burnResult, resetBurnResult] = useBroadcastableQuery(
    burnQueryOptions,
  );

  const client = useApolloClient();

  // TODO: get exchange rate

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [burnAmount, setBurnAmount] = useState<string>('');

  const [burnCurrency, setBurnCurrency] = useState<Item>(
    () => burnCurrencies[0],
  );

  const [gettCurrency, setGettCurrency] = useState<Item>(
    () => gettCurrencies[0],
  );

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: exchangeRateData } = useQuery<
    exc.StringifiedData,
    exc.StringifiedVariables
  >(exc.query, {
    variables: exc.stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub(gettCurrency.value),
    }),
  });

  const { data: userBassetBalance } = useQuery<
    bas.StringifiedData,
    bas.StringifiedVariables
  >(bas.query, {
    skip: status.status !== 'ready',
    variables: bas.stringifyVariables({
      bAssetTokenContract: addressProvider.bAssetToken('ubluna'),
      bAssetBalanceQuery: {
        balance: {
          address: status.status === 'ready' ? status.walletAddress : '',
        },
      },
    }),
  });

  const exchangeRate = useMemo(
    () =>
      exchangeRateData
        ? exc.parseData(exchangeRateData).exchangeRate.Result
        : undefined,
    [exchangeRateData],
  );

  const userUblunaBalance = useMemo(() => {
    return userBassetBalance
      ? bas.parseData(userBassetBalance).bAssetBalance.balance
      : undefined;
  }, [userBassetBalance]);

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const burnInputError = useMemo<ReactNode>(() => {
    if (
      big(burnAmount.length > 0 ? burnAmount : 0)
        .mul(MICRO)
        .gt(big(userUblunaBalance ?? 0))
    ) {
      return `Insufficient balance: Not enough bAssets (${big(
        userUblunaBalance ?? 0,
      ).div(MICRO)} bLuna)`;
    }
    return undefined;
  }, [burnAmount, userUblunaBalance]);

  console.log('burn.tsx..BurnBase()', burnResult);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    burnResult?.status === 'in-progress' ||
    burnResult?.status === 'done' ||
    burnResult?.status === 'error'
  ) {
    return (
      <Section className={className}>
        <TxResultRenderer result={burnResult} resetResult={resetBurnResult} />
      </Section>
    );
  }

  return (
    <Section className={className}>
      <div className="burn-description">
        <p>I want to burn</p>
        <p>
          {exchangeRate &&
            `1 bLuna = ${toFixedNoRounding(exchangeRate.exchange_rate)} Luna`}
        </p>
      </div>

      <SelectAndTextInputContainer className="burn">
        <MuiNativeSelect
          value={burnCurrency}
          onChange={(evt) =>
            setBurnCurrency(
              burnCurrencies.find(({ value }) => evt.target.value === value) ??
                burnCurrencies[0],
            )
          }
          IconComponent={burnCurrencies.length < 2 ? BlankComponent : undefined}
          disabled={burnCurrencies.length < 2}
        >
          {burnCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput
          type="number"
          placeholder="0.00"
          error={!!burnInputError}
          endAdornment={
            burnInputError ? (
              <InputAdornment position="end">
                <Tooltip
                  open
                  color="error"
                  title={burnInputError}
                  placement="top"
                >
                  <ErrorIcon />
                </Tooltip>
              </InputAdornment>
            ) : undefined
          }
          value={burnAmount}
          onChange={({ target }) => setBurnAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      <div className="gett-description">
        <p>and get</p>
        <p>
          {exchangeRate &&
            `1 Luna = ${toFixedNoRounding(
              big(1).div(big(exchangeRate.exchange_rate)),
            )} bLuna`}
        </p>
      </div>

      <SelectAndTextInputContainer className="gett">
        <MuiNativeSelect
          value={gettCurrency}
          onChange={(evt) =>
            setGettCurrency(
              gettCurrencies.find(({ value }) => evt.target.value === value) ??
                gettCurrencies[0],
            )
          }
          IconComponent={gettCurrencies.length < 2 ? BlankComponent : undefined}
          disabled={gettCurrencies.length < 2}
        >
          {gettCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput
          placeholder="0.00"
          value={
            burnAmount.length > 0
              ? big(burnAmount)
                  .div(big(exchangeRate?.exchange_rate ?? 0))
                  .toString()
              : ''
          }
          disabled
        />
      </SelectAndTextInputContainer>

      {status.status === 'ready' &&
      burnAmount.length > 0 &&
      big(burnAmount).gt(0) &&
      !burnInputError ? (
        <ActionButton
          className="submit"
          onClick={() =>
            fetchBurn({
              post: post<CreateTxOptions, StringifiedTxResult>({
                ...transactionFee,
                msgs: fabricatebAssetBurn({
                  address: status.walletAddress,
                  amount: burnAmount,
                  bAsset: burnCurrency.value,
                })(addressProvider),
              })
                .then(({ payload }) => payload)
                .then(parseResult),
              client,
            }).then((data) => {
              if (data) {
                // the meaning that data is exists is this component does not unmounted
                setBurnAmount('');
              }
            })
          }
        >
          Burn
        </ActionButton>
      ) : (
        <ActionButton className="submit" disabled>
          Burn
        </ActionButton>
      )}
    </Section>
  );
}

const burnQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'basset/burn',
  notificationFactory: txNotificationFactory,
};

function BlankComponent() {
  return <div />;
}

export const Burn = styled(BurnBase)`
  .burn-description,
  .gett-description {
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

  .burn,
  .gett {
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
