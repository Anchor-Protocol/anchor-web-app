import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators/basset/basset-bond';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { MICRO, toFixedNoRounding } from '@anchor-protocol/notation';
import {
  BroadcastableQueryOptions,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient } from '@apollo/client';
import {
  Input as MuiInput,
  InputAdornment,
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
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
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

const assetCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];
const bAssetCurrencies: Item[] = [{ label: 'bLuna', value: 'bluna' }];

function MintBase({ className }: MintProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [mint, mintResult, resetMintResult] = useBroadcastableQuery(
    mintQueryOptions,
  );

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [assetAmount, setAssetAmount] = useState<string>('');
  const [bAssetAmount, setBAssetAmount] = useState<string>('');

  const [bAssetCurrency, setBAssetCurrency] = useState<Item>(
    () => bAssetCurrencies[0],
  );

  const [assetCurrency, setAssetCurrency] = useState<Item>(
    () => assetCurrencies[0],
  );

  const [selectedValidator, setSelectedValidator] = useState<
    val.Data['validators'][number] | null
  >(null);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { parsedData: validators } = useValidators({
    bAsset: bAssetCurrency.value,
  });
  const { parsedData: exchangeRate } = useExchangeRate({
    bAsset: bAssetCurrency.value,
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

  const invalidAssetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (
      big(assetAmount.length > 0 ? assetAmount : 0)
        .mul(MICRO)
        .gt(big(bank.userBalances.uLuna ?? 0))
    ) {
      return `Insufficient balance: Not enough Assets (${big(
        bank.userBalances.uLuna ?? 0,
      ).div(MICRO)} Luna)`;
    }
    return undefined;
  }, [bank.status, bank.userBalances.uLuna, assetAmount]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateAssetAmount = useCallback(
    (nextAssetAmount: string) => {
      setAssetAmount(nextAssetAmount);
      setBAssetAmount(
        nextAssetAmount.length === 0
          ? ''
          : big(nextAssetAmount)
              .div(exchangeRate?.exchange_rate ?? 0)
              .toString(),
      );
    },
    [exchangeRate?.exchange_rate],
  );

  const updateBAssetAmount = useCallback(
    (nextBAssetAmount: string) => {
      setAssetAmount(
        nextBAssetAmount.length === 0
          ? ''
          : big(nextBAssetAmount)
              .mul(exchangeRate?.exchange_rate ?? 0)
              .toString(),
      );
      setBAssetAmount(nextBAssetAmount);
    },
    [exchangeRate?.exchange_rate],
  );

  const transactMint = useCallback(
    async ({
      status,
      assetAmount,
      selectedValidator,
    }: {
      status: WalletStatus;
      assetAmount: string;
      selectedValidator: string | undefined;
    }) => {
      if (status.status !== 'ready' || !selectedValidator) {
        return;
      }

      const data = await mint({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricatebAssetBond({
            address: status.walletAddress,
            amount: big(assetAmount).toNumber(),
            bAsset: bAssetCurrency.value,
            validator: selectedValidator,
          })(addressProvider),
        })
          .then(({ payload }) => payload)
          .then(parseResult),
        client,
      });

      // is this component does not unmounted
      if (data) {
        setAssetAmount('');
        setSelectedValidator(null);
      }
    },
    [addressProvider, client, mint, bAssetCurrency.value, post],
  );

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
        {/* TODO implement messages */}
        <TxResultRenderer result={mintResult} resetResult={resetMintResult} />
      </Section>
    );
  }

  return (
    <Section className={className}>
      {/* Bond (Asset) */}
      <div className="bond-description">
        <p>I want to bond</p>
        <p>
          {exchangeRate &&
            `1 Luna = ${toFixedNoRounding(
              big(1).div(exchangeRate.exchange_rate),
            )} bLuna`}
        </p>
      </div>

      <SelectAndTextInputContainer
        className="bond"
        error={!!invalidTxFee || !!invalidAssetAmount}
        helperText={invalidTxFee || invalidAssetAmount}
      >
        <MuiNativeSelect
          value={assetCurrency}
          onChange={(evt) =>
            setAssetCurrency(
              assetCurrencies.find(({ value }) => evt.target.value === value) ??
                assetCurrencies[0],
            )
          }
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
          error={!!invalidTxFee || !!invalidAssetAmount}
          value={assetAmount}
          onChange={({ target }) => updateAssetAmount(target.value)}
          endAdornment={
            <InputAdornment position="end" style={{ opacity: 0.5 }}>
              / {toFixedNoRounding(big(bank.userBalances.uUSD).div(MICRO), 2)}
            </InputAdornment>
          }
        />
      </SelectAndTextInputContainer>

      {/* Mint (bAsset) */}
      <div className="mint-description">
        <p>and mint</p>
        <p>
          {exchangeRate &&
            `1 bLuna = ${toFixedNoRounding(exchangeRate.exchange_rate)} Luna`}
        </p>
      </div>

      <SelectAndTextInputContainer
        className="mint"
        error={!!invalidTxFee || !!invalidAssetAmount}
      >
        <MuiNativeSelect
          value={bAssetCurrency}
          onChange={(evt) =>
            setBAssetCurrency(
              bAssetCurrencies.find(
                ({ value }) => evt.target.value === value,
              ) ?? bAssetCurrencies[0],
            )
          }
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
          error={!!invalidTxFee || !!invalidAssetAmount}
          value={bAssetAmount}
          onChange={({ target }) => updateBAssetAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      <HorizontalRuler />

      {/* Validators */}
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

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          status.status !== 'ready' ||
          bank.status !== 'connected' ||
          !!invalidAssetAmount ||
          !!invalidTxFee ||
          !selectedValidator
        }
        onClick={() =>
          transactMint({
            assetAmount: assetAmount,
            status,
            selectedValidator: selectedValidator?.OperatorAddress,
          })
        }
      >
        Mint
      </ActionButton>
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
