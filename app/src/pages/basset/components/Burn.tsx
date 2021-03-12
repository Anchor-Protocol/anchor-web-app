import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { SelectAndTextInputContainer } from '@terra-dev/neumorphism-ui/components/SelectAndTextInputContainer';
import {
  demicrofy,
  formatLuna,
  formatLunaInput,
  formatUST,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import type { bLuna, Luna, uUST } from '@anchor-protocol/types';
import { useRestrictedNumberInput } from '@terra-dev/use-restricted-input';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { useBank } from '@anchor-protocol/web-contexts/contexts/bank';
import { useConstants } from '@anchor-protocol/web-contexts/contexts/contants';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import {
  Input as MuiInput,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import big, { Big } from 'big.js';
import { ArrowDownLine } from 'components/ArrowDownLine';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { pegRecovery } from 'pages/basset/logics/pegRecovery';
import { validateBurnAmount } from 'pages/basset/logics/validateBurnAmount';
import { useExchangeRate } from 'pages/basset/queries/exchangeRate';
import { burnOptions } from 'pages/basset/transactions/burnOptions';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

interface Item {
  label: string;
  value: string;
}

const assetCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];
const bAssetCurrencies: Item[] = [{ label: 'bLuna', value: 'bluna' }];

export function Burn() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [burn, burnResult] = useOperation(burnOptions, {});

  const lunaInputHandlers = useRestrictedNumberInput({
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

  const {
    data: { exchangeRate, parameters },
  } = useExchangeRate({
    bAsset: getCurrency.value,
  });

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const pegRecoveryFee = useMemo(() => pegRecovery(exchangeRate, parameters), [
    exchangeRate,
    parameters,
  ]);

  const invalidTxFee = useMemo(
    () => serviceAvailable && validateTxFee(bank, fixedGas),
    [bank, fixedGas, serviceAvailable],
  );

  const invalidBurnAmount = useMemo(
    () => validateBurnAmount(burnAmount, bank),
    [bank, burnAmount],
  );

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

  const init = useCallback(() => {
    setGetAmount('' as Luna);
    setBurnAmount('' as bLuna);
  }, []);

  const proceed = useCallback(
    async (walletReady: WalletReady, burnAmount: bLuna) => {
      const broadcasted = await burn({
        address: walletReady.walletAddress,
        amount: burnAmount,
        bAsset: burnCurrency.value,
        txFee: fixedGas.toString() as uUST,
      });

      if (!broadcasted) {
        init();
      }
    },
    [burn, burnCurrency.value, fixedGas, init],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    burnResult?.status === 'in-progress' ||
    burnResult?.status === 'done' ||
    burnResult?.status === 'fault'
  ) {
    return <TransactionRenderer result={burnResult} onExit={init} />;
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      {pegRecoveryFee && (
        <MessageBox
          level="info"
          hide={{ id: 'burn_peg', period: 1000 * 60 * 60 * 24 * 7 }}
        >
          When exchange rate is lower than threshold,
          <br />
          protocol charges peg recovery fee for each Mint/Burn action.
        </MessageBox>
      )}

      <MessageBox
        level="info"
        hide={{ id: 'burn', period: 1000 * 60 * 60 * 24 * 7 }}
      >
        Default bLuna redemptions take at least 21 days to process.
        <br />
        Slashing events during the 21 days may affect the final amount
        withdrawn.
      </MessageBox>

      {/* Burn (bAsset) */}
      <div className="burn-description">
        <p>I want to burn</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="burn"
        gridColumns={[120, '1fr']}
        error={!!invalidBurnAmount}
        leftHelperText={invalidBurnAmount}
        rightHelperText={
          serviceAvailable && (
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
          {...lunaInputHandlers}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateBurnAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      <ArrowDownLine />

      {/* Get (Asset) */}
      <div className="gett-description">
        <p>and get</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="gett"
        gridColumns={[120, '1fr']}
        error={!!invalidBurnAmount}
      >
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
          {...lunaInputHandlers}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateGetAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      <TxFeeList className="receipt">
        {exchangeRate && (
          <SwapListItem
            label="Price"
            currencyA={burnCurrency.label}
            currencyB={getCurrency.label}
            exchangeRateAB={exchangeRate.exchange_rate}
            formatExchangeRate={(ratio) => formatLuna(ratio as Luna<Big>)}
          />
        )}
        {!!pegRecoveryFee && getAmount.length > 0 && (
          <TxFeeListItem label={<IconSpan>Peg Recovery Fee</IconSpan>}>
            {formatLuna(demicrofy(pegRecoveryFee(getAmount)))} Luna
          </TxFeeListItem>
        )}
        {burnAmount.length > 0 && (
          <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
            {formatUST(demicrofy(fixedGas))} UST
          </TxFeeListItem>
        )}
      </TxFeeList>

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          !serviceAvailable ||
          burnAmount.length === 0 ||
          big(burnAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidBurnAmount
        }
        onClick={() => walletReady && proceed(walletReady, burnAmount)}
      >
        Burn
      </ActionButton>
    </>
  );
}

function BlankComponent() {
  return <div />;
}
