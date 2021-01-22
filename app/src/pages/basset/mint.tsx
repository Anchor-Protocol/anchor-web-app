import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators/basset/basset-bond';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
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
import { WarningArticle } from 'components/WarningArticle';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import * as txi from 'queries/txInfos';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';
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
    maxIntegerPoinsts: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
    maxDecimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  });

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [bondAmount, setBondAmount] = useState<Luna>('' as Luna);
  const [mintAmount, setMintAmount] = useState<bLuna>('' as bLuna);

  const [bondCurrency, setBondCurrency] = useState<Item>(
    () => assetCurrencies[0],
  );
  const [mintCurrency, setMintCurrency] = useState<Item>(
    () => bAssetCurrencies[0],
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
  const invalidTxFee = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD).lt(fixedGasUUSD)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidBondAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || bondAmount.length === 0) {
      return undefined;
    } else if (microfy(bondAmount).gt(bank.userBalances.uLuna ?? 0)) {
      return `Not enough assets`;
    }
    return undefined;
  }, [bank.status, bank.userBalances.uLuna, bondAmount]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBondCurrency = useCallback((nextAssetCurrencyValue: string) => {
    setBondCurrency(
      assetCurrencies.find(({ value }) => nextAssetCurrencyValue === value) ??
        assetCurrencies[0],
    );
  }, []);

  const updateMintCurrency = useCallback((nextBAssetCurrencyValue: string) => {
    setMintCurrency(
      bAssetCurrencies.find(({ value }) => nextBAssetCurrencyValue === value) ??
        bAssetCurrencies[0],
    );
  }, []);

  const updateBondAmount = useCallback(
    (nextBondAmount: string) => {
      if (nextBondAmount.trim().length === 0) {
        setBondAmount('' as Luna);
        setMintAmount('' as bLuna);
      } else {
        const bondAmount: Luna = nextBondAmount as Luna;
        const mintAmount: bLuna = formatLunaInput(
          big(bondAmount).div(exchangeRate?.exchange_rate ?? 1) as bLuna<Big>,
        );

        setBondAmount(bondAmount);
        setMintAmount(mintAmount);
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const updateMintAmount = useCallback(
    (nextMintAmount: string) => {
      if (nextMintAmount.trim().length === 0) {
        setBondAmount('' as Luna);
        setMintAmount('' as bLuna);
      } else {
        const mintAmount: bLuna = nextMintAmount as bLuna;
        const bondAmount: Luna = formatLunaInput(
          big(mintAmount).mul(exchangeRate?.exchange_rate ?? 1) as Luna<Big>,
        );

        setBondAmount(bondAmount);
        setMintAmount(mintAmount);
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const mint = useCallback(
    async ({
      status,
      bondAmount,
      selectedValidator,
    }: {
      status: WalletStatus;
      bondAmount: Luna;
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
            amount: bondAmount,
            bAsset: mintCurrency.value,
            validator: selectedValidator,
          })(addressProvider),
        })
          .then(({ payload }) => payload)
          .then(parseResult),
        client,
      });

      // is this component does not unmounted
      if (data) {
        setBondAmount('' as Luna);
        setMintAmount('' as bLuna);
        setSelectedValidator(null);
      }
    },
    [bank.status, queryMint, post, mintCurrency.value, addressProvider, client],
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
            `1 ${bondCurrency.label} = ${formatLuna(
              (big(1).div(exchangeRate.exchange_rate) as Big) as Luna<Big>,
            )} ${mintCurrency.label}`}
        </p>
      </div>

      <SelectAndTextInputContainer
        className="bond"
        error={!!invalidBondAmount}
        leftHelperText={invalidBondAmount}
        rightHelperText={
          status.status === 'ready' && (
            <span>
              Balance:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  updateBondAmount(
                    formatLunaInput(demicrofy(bank.userBalances.uLuna)),
                  )
                }
              >
                {formatLuna(demicrofy(bank.userBalances.uLuna))}{' '}
                {bondCurrency.label}
              </span>
            </span>
          )
        }
      >
        <MuiNativeSelect
          value={bondCurrency}
          onChange={({ target }) => updateBondCurrency(target.value)}
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
          error={!!invalidBondAmount}
          value={bondAmount}
          onKeyPress={onLunaInputKeyPress as any}
          onChange={({ target }) => updateBondAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      {/* Mint (bAsset) */}
      <div className="mint-description">
        <p>and mint</p>
        <p>
          {exchangeRate &&
            `1 ${mintCurrency.label} = ${formatLuna(
              (exchangeRate.exchange_rate as string) as Luna,
            )} ${bondCurrency.label}`}
        </p>
      </div>

      <SelectAndTextInputContainer className="mint" error={!!invalidBondAmount}>
        <MuiNativeSelect
          value={mintCurrency}
          onChange={({ target }) => updateMintCurrency(target.value)}
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
          error={!!invalidBondAmount}
          value={mintAmount}
          onKeyPress={onLunaInputKeyPress as any}
          onChange={({ target }) => updateMintAmount(target.value)}
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

      {bondAmount.length > 0 && (
        <TxFeeList className="receipt">
          <TxFeeListItem
            label={
              <IconSpan>
                Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
              </IconSpan>
            }
          >
            {formatUST(demicrofy(fixedGasUUSD))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          status.status !== 'ready' ||
          bank.status !== 'connected' ||
          bondAmount.length === 0 ||
          big(bondAmount).lte(0) ||
          !!invalidBondAmount ||
          !!invalidTxFee ||
          !selectedValidator
        }
        onClick={() =>
          mint({
            bondAmount,
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
