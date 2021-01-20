import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators/basset/basset-bond';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import {
  formatLuna,
  formatLunaInput,
  formatUST,
  MICRO,
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
import * as txi from 'queries/txInfos';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'components/TxResultRenderer';
import big from 'big.js';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningArticle } from 'components/WarningArticle';
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

  const [queryMint, mintResult, resetMintResult] = useBroadcastableQuery(
    mintQueryOptions,
  );

  const client = useApolloClient();

  const { onKeyPress: onLunaInputKeyPress } = useRestrictedNumberInput({
    maxDecimalPoints: 6,
  });

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
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidAssetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (
      big(assetAmount.length > 0 ? assetAmount : 0)
        .mul(MICRO)
        .gt(bank.userBalances.uLuna ?? 0)
    ) {
      return `Not enough assets`;
    }
    return undefined;
  }, [bank.status, bank.userBalances.uLuna, assetAmount]);

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
        const assetAmount: string = nextAssetAmount;

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
        const bAssetAmount: string = nextBAssetAmount;

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

  const mint = useCallback(
    async ({
      status,
      assetAmount,
      selectedValidator,
    }: {
      status: WalletStatus;
      assetAmount: string;
      selectedValidator: string | undefined;
    }) => {
      if (
        status.status !== 'ready' ||
        bank.status !== 'connected' ||
        !selectedValidator
      ) {
        return;
      }

      const data = await queryMint({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricatebAssetBond({
            address: status.walletAddress,
            amount: assetAmount,
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
        setBAssetAmount('');
        setSelectedValidator(null);
      }
    },
    [
      bank.status,
      queryMint,
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
      {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

      {/* Bond (Asset) */}
      <div className="bond-description">
        <p>I want to bond</p>
        <p>
          {exchangeRate &&
            `1 Luna = ${formatLuna(
              big(1).div(exchangeRate.exchange_rate),
            )} bLuna`}
        </p>
      </div>

      <SelectAndTextInputContainer
        className="bond"
        error={!!invalidAssetAmount}
        leftHelperText={invalidAssetAmount}
        rightHelperText={
          status.status === 'ready' && (
            <span>
              Balance:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  updateAssetAmount(
                    formatLunaInput(big(bank.userBalances.uLuna).div(MICRO)),
                  )
                }
              >
                {formatLuna(big(bank.userBalances.uLuna).div(MICRO))} Luna
              </span>
            </span>
          )
        }
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
          placeholder="0.00"
          error={!!invalidAssetAmount}
          value={assetAmount}
          onKeyPress={onLunaInputKeyPress as any}
          onChange={({ target }) => updateAssetAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      {/* Mint (bAsset) */}
      <div className="mint-description">
        <p>and mint</p>
        <p>
          {exchangeRate &&
            `1 bLuna = ${formatLuna(exchangeRate.exchange_rate)} Luna`}
        </p>
      </div>

      <SelectAndTextInputContainer
        className="mint"
        error={!!invalidAssetAmount}
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
          placeholder="0.00"
          error={!!invalidAssetAmount}
          value={bAssetAmount}
          onKeyPress={onLunaInputKeyPress as any}
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

      {assetAmount.length > 0 && (
        <TxFeeList className="receipt">
          <TxFeeListItem
            label={
              <IconSpan>
                Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
              </IconSpan>
            }
          >
            {formatUST(big(fixedGasUUSD).div(MICRO))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          status.status !== 'ready' ||
          bank.status !== 'connected' ||
          assetAmount.length === 0 ||
          big(assetAmount).lte(0) ||
          !!invalidAssetAmount ||
          !!invalidTxFee ||
          !selectedValidator
        }
        onClick={() =>
          mint({
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

  .receipt {
    margin-bottom: 40px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
