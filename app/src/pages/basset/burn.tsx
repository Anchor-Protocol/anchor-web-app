import { fabricatebAssetBurn } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import {
  formatLuna,
  formatLunaInput,
  formatLunaUserInput,
  MICRO,
} from '@anchor-protocol/notation';
import {
  BroadcastableQueryOptions,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient } from '@apollo/client';
import {
  Input as MuiInput,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
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
import { WarningArticle } from 'components/messages/WarningArticle';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import { useExchangeRate } from 'pages/basset/queries/exchangeRate';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

export interface BurnProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const assetCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];
const bAssetCurrencies: Item[] = [{ label: 'bLuna', value: 'bluna' }];

function BurnBase({ className }: BurnProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [queryBurn, burnResult, resetBurnResult] = useBroadcastableQuery(
    burnQueryOptions,
  );

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [assetAmount, setAssetAmount] = useState<string>('');
  const [bAssetAmount, setBAssetAmount] = useState<string>('');

  const [assetCurrency, setAssetCurrency] = useState<Item>(
    () => assetCurrencies[0],
  );

  const [bAssetCurrency, setBAssetCurrency] = useState<Item>(
    () => bAssetCurrencies[0],
  );

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { parsedData: exchangeRate } = useExchangeRate({
    bAsset: assetCurrency.value,
  });

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const invalidTxFee = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD).lt(fixedGasUUSD)) {
      return 'Not Enough Tx Fee';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidBAssetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (
      big(bAssetAmount.length > 0 ? bAssetAmount : 0)
        .mul(MICRO)
        .gt(bank.userBalances?.ubLuna ?? 0)
    ) {
      return `Insufficient balance: Not enough bAssets (${big(
        bank.userBalances?.ubLuna ?? 0,
      ).div(MICRO)} bLuna)`;
    }
    return undefined;
  }, [bank.status, bank.userBalances?.ubLuna, bAssetAmount]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateAssetCurrency = useCallback((nextAssetCurrencyValue: string) => {
    setAssetCurrency(
      assetCurrencies.find(({ value }) => nextAssetCurrencyValue === value) ??
        assetCurrencies[0],
    );
  }, []);

  const updateBAssetCurrency = useCallback(
    (nextBAssetCurrencyValue: string) => {
      setBAssetCurrency(
        bAssetCurrencies.find(
          ({ value }) => nextBAssetCurrencyValue === value,
        ) ?? bAssetCurrencies[0],
      );
    },
    [],
  );

  const updateAssetAmount = useCallback(
    (nextAssetAmount: string) => {
      if (nextAssetAmount.trim().length === 0) {
        setAssetAmount('');
        setBAssetAmount('');
      } else {
        const assetAmount: string = formatLunaUserInput(nextAssetAmount);

        setAssetAmount(assetAmount);
        setBAssetAmount(
          formatLunaInput(
            big(assetAmount).div(exchangeRate?.exchange_rate ?? 1),
          ),
        );
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const updateBAssetAmount = useCallback(
    (nextBAssetAmount: string) => {
      if (nextBAssetAmount.trim().length === 0) {
        setAssetAmount('');
        setBAssetAmount('');
      } else {
        const bAssetAmount: string = formatLunaUserInput(nextBAssetAmount);

        setAssetAmount(
          formatLunaInput(
            big(bAssetAmount).mul(exchangeRate?.exchange_rate ?? 1),
          ),
        );
        setBAssetAmount(bAssetAmount);
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const burn = useCallback(
    async ({
      status,
      bAssetAmount,
    }: {
      status: WalletStatus;
      bAssetAmount: string;
    }) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      const data = await queryBurn({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricatebAssetBurn({
            address: status.walletAddress,
            amount: bAssetAmount,
            bAsset: bAssetCurrency.value,
          })(addressProvider),
        })
          .then(({ payload }) => payload)
          .then(parseResult),
        client,
      });

      // is this component not unmounted
      if (data) {
        setAssetAmount('');
        setBAssetAmount('');
      }
    },
    [
      bank.status,
      queryBurn,
      post,
      bAssetCurrency.value,
      addressProvider,
      client,
    ],
  );

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
        {/* TODO implement messages */}
        <TxResultRenderer result={burnResult} resetResult={resetBurnResult} />
      </Section>
    );
  }

  return (
    <Section className={className}>
      {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

      {/* Burn (bAsset) */}
      <div className="burn-description">
        <p>I want to burn</p>
        <p>
          {exchangeRate &&
            `1 bLuna = ${formatLuna(exchangeRate.exchange_rate)} Luna`}
        </p>
      </div>

      <SelectAndTextInputContainer
        className="burn"
        error={!!invalidBAssetAmount}
        leftHelperText={invalidBAssetAmount}
        rightHelperText={
          <span>
            Balance:{' '}
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() =>
                updateBAssetAmount(
                  big(bank.userBalances.ubLuna).div(MICRO).toString(),
                )
              }
            >
              {big(bank.userBalances.ubLuna).div(MICRO).toString()} bLuna
            </span>
          </span>
        }
      >
        <MuiNativeSelect
          value={bAssetCurrency}
          onChange={({ target }) => updateBAssetCurrency(target.value)}
          IconComponent={
            bAssetCurrencies.length < 2 ? BlankComponent : undefined
          }
          disabled={bAssetCurrencies.length < 2}
        >
          {bAssetCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput
          type="number"
          placeholder="0.00"
          error={!!invalidBAssetAmount}
          value={bAssetAmount}
          onChange={({ target }) => updateBAssetAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      {/* Get (Asset) */}
      <div className="gett-description">
        <p>and get</p>
        <p>
          {exchangeRate &&
            `1 Luna = ${formatLuna(
              big(1).div(big(exchangeRate.exchange_rate)),
            )} bLuna`}
        </p>
      </div>

      <SelectAndTextInputContainer
        className="gett"
        error={!!invalidBAssetAmount}
      >
        <MuiNativeSelect
          value={assetCurrency}
          onChange={({ target }) => updateAssetCurrency(target.value)}
          IconComponent={
            assetCurrencies.length < 2 ? BlankComponent : undefined
          }
          disabled={assetCurrencies.length < 2}
        >
          {assetCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput
          type="number"
          placeholder="0.00"
          error={!!invalidBAssetAmount}
          value={assetAmount}
          onChange={({ target }) => updateAssetAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          status.status !== 'ready' ||
          bank.status !== 'connected' ||
          !!invalidTxFee ||
          !!invalidBAssetAmount
        }
        onClick={() =>
          burn({
            status,
            bAssetAmount: bAssetAmount,
          })
        }
      >
        Burn
      </ActionButton>
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
