import { fabricatebAssetBurn } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import {
  bLuna,
  demicrofy,
  formatLuna,
  formatLunaInput,
  formatUST,
  Luna,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  microfy,
} from '@anchor-protocol/notation';
import {
  BroadcastableQueryOptions,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import { useRestrictedNumberInput } from '@anchor-protocol/use-restricted-input';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient } from '@apollo/client';
import {
  Input as MuiInput,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import { CreateTxOptions } from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'components/TxResultRenderer';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { FIXED_GAS, TRANSACTION_FEE } from 'env';
import { useExchangeRate } from 'pages/basset/queries/exchangeRate';
import * as txi from 'queries/txInfos';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { queryOptions } from 'transactions/queryOptions';
import { parseTxResult, StringifiedTxResult, TxResult } from 'transactions/tx';

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

  const { onKeyPress: onLunaInputKeyPress } = useRestrictedNumberInput({
    maxIntegerPoinsts: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
    maxDecimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  });

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [burnAmount, setBurnAmount] = useState<bLuna>('' as bLuna);
  const [getAmount, setGetAmount] = useState<Luna>('' as Luna);

  const [burnCurrency, setBurnCurrency] = useState<Item>(
    () => bAssetCurrencies[0],
  );
  const [getCurrency, setGetCurrency] = useState<Item>(
    () => assetCurrencies[0],
  );

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { parsedData: exchangeRate } = useExchangeRate({
    bAsset: getCurrency.value,
  });

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const invalidTxFee = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD).lt(FIXED_GAS)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidBurnAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || burnAmount.length === 0) {
      return undefined;
    } else if (microfy(burnAmount).gt(bank.userBalances.ubLuna ?? 0)) {
      return `Not enough bAssets`;
    }
    return undefined;
  }, [bank.status, bank.userBalances.ubLuna, burnAmount]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBurnCurrency = useCallback((nextBurnCurrencyValue: string) => {
    setBurnCurrency(
      bAssetCurrencies.find(({ value }) => nextBurnCurrencyValue === value) ??
        bAssetCurrencies[0],
    );
  }, []);

  const updateGetCurrency = useCallback((nextGetCurrencyValue: string) => {
    setGetCurrency(
      assetCurrencies.find(({ value }) => nextGetCurrencyValue === value) ??
        assetCurrencies[0],
    );
  }, []);

  const updateBurnAmount = useCallback(
    (nextBurnAmount: string) => {
      if (nextBurnAmount.trim().length === 0) {
        setGetAmount('' as Luna);
        setBurnAmount('' as bLuna);
      } else {
        const burnAmount: bLuna = nextBurnAmount as bLuna;
        const getAmount: Luna = formatLunaInput(
          big(burnAmount).mul(exchangeRate?.exchange_rate ?? 1) as Luna<Big>,
        );

        setGetAmount(getAmount);
        setBurnAmount(burnAmount);
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const updateGetAmount = useCallback(
    (nextGetAmount: string) => {
      if (nextGetAmount.trim().length === 0) {
        setBurnAmount('' as bLuna);
        setGetAmount('' as Luna);
      } else {
        const getAmount: Luna = nextGetAmount as Luna;
        const burnAmount: bLuna = formatLunaInput(
          big(getAmount).div(exchangeRate?.exchange_rate ?? 1) as bLuna<Big>,
        );

        setBurnAmount(burnAmount);
        setGetAmount(getAmount);
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const burn = useCallback(
    async ({
      status,
      burnAmount,
    }: {
      status: WalletStatus;
      burnAmount: bLuna;
    }) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      const data = await queryBurn({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...TRANSACTION_FEE,
          msgs: fabricatebAssetBurn({
            address: status.walletAddress,
            amount: burnAmount,
            bAsset: burnCurrency.value,
          })(addressProvider),
        })
          .then(({ payload }) => payload)
          .then(parseTxResult),
        client,
      });

      // is this component not unmounted
      if (data) {
        setGetAmount('' as Luna);
        setBurnAmount('' as bLuna);
      }
    },
    [bank.status, queryBurn, post, burnCurrency.value, addressProvider, client],
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
      {!!invalidTxFee && <WarningMessage>{invalidTxFee}</WarningMessage>}

      {/* Burn (bAsset) */}
      <div className="burn-description">
        <p>I want to burn</p>
        <p>
          {exchangeRate &&
            `1 ${burnCurrency.label} = ${formatLuna(
              (exchangeRate.exchange_rate as string) as Luna,
            )} ${getCurrency.label}`}
        </p>
      </div>

      <SelectAndTextInputContainer
        className="burn"
        error={!!invalidBurnAmount}
        leftHelperText={invalidBurnAmount}
        rightHelperText={
          status.status === 'ready' && (
            <span>
              Balance:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  updateBurnAmount(
                    formatLunaInput(demicrofy(bank.userBalances.ubLuna)),
                  )
                }
              >
                {formatLuna(demicrofy(bank.userBalances.ubLuna))}{' '}
                {burnCurrency.label}
              </span>
            </span>
          )
        }
      >
        <MuiNativeSelect
          value={burnCurrency}
          onChange={({ target }) => updateBurnCurrency(target.value)}
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
          placeholder="0"
          error={!!invalidBurnAmount}
          value={burnAmount}
          onKeyPress={onLunaInputKeyPress as any}
          onChange={({ target }) => updateBurnAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      {/* Get (Asset) */}
      <div className="gett-description">
        <p>and get</p>
        <p>
          {exchangeRate &&
            `1 ${getCurrency.label} = ${formatLuna(
              (big(1).div(exchangeRate.exchange_rate) as Big) as Luna<Big>,
            )} ${burnCurrency.label}`}
        </p>
      </div>

      <SelectAndTextInputContainer className="gett" error={!!invalidBurnAmount}>
        <MuiNativeSelect
          value={getCurrency}
          onChange={({ target }) => updateGetCurrency(target.value)}
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
          placeholder="0"
          error={!!invalidBurnAmount}
          value={getAmount}
          onKeyPress={onLunaInputKeyPress as any}
          onChange={({ target }) => updateGetAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      {burnAmount.length > 0 && (
        <TxFeeList className="receipt">
          <TxFeeListItem
            label={
              <IconSpan>
                Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
              </IconSpan>
            }
          >
            {formatUST(demicrofy(FIXED_GAS))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          status.status !== 'ready' ||
          bank.status !== 'connected' ||
          burnAmount.length === 0 ||
          big(burnAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidBurnAmount
        }
        onClick={() =>
          burn({
            status,
            burnAmount,
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

  .receipt {
    margin-bottom: 40px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
