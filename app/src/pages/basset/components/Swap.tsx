import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
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
  Ratio,
  uLuna,
} from '@anchor-protocol/notation';
import { useRestrictedNumberInput } from '@anchor-protocol/use-restricted-input';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import {
  Input as MuiInput,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import big, { Big } from 'big.js';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { FIXED_GAS } from 'env';
import { useInvalidTxFee } from 'logics/useInvalidTxFee';
import { useInvalidBurnAmount } from 'pages/basset/logics/useInvalidBurnAmount';
import { useTerraswapBLunaPrice } from 'pages/basset/queries/terraswapBLunaPrice';
import { useTerraswapOfferSimulation } from 'pages/basset/queries/terraswapOfferSimulation';
import { swapOptions } from 'pages/basset/transactions/swapOptions';
import React, { useCallback, useState } from 'react';

interface Item {
  label: string;
  value: string;
}

const assetCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];
const bAssetCurrencies: Item[] = [{ label: 'bLuna', value: 'bluna' }];

export function Swap() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status } = useWallet();

  const [swap, swapResult] = useOperation(swapOptions, {});

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

  const { parsedData: bLunaPrice } = useTerraswapBLunaPrice();

  const { parsedData: offerSimulation } = useTerraswapOfferSimulation({
    burnAmount,
  });
  //const { parsedData: exchangeRate } = useExchangeRate({
  //  bAsset: getCurrency.value,
  //});

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useInvalidTxFee(bank);
  const invalidBurnAmount = useInvalidBurnAmount(burnAmount, bank);

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
          big(burnAmount).mul(bLunaPrice?.bLunaPrice ?? 1) as Luna<Big>,
        );

        setGetAmount(getAmount);
        setBurnAmount(burnAmount);
      }
    },
    [bLunaPrice?.bLunaPrice],
  );

  const updateGetAmount = useCallback(
    (nextGetAmount: string) => {
      if (nextGetAmount.trim().length === 0) {
        setBurnAmount('' as bLuna);
        setGetAmount('' as Luna);
      } else {
        const getAmount: Luna = nextGetAmount as Luna;
        const burnAmount: bLuna = formatLunaInput(
          big(getAmount).div(bLunaPrice?.bLunaPrice ?? 1) as bLuna<Big>,
        );

        setBurnAmount(burnAmount);
        setGetAmount(getAmount);
      }
    },
    [bLunaPrice?.bLunaPrice],
  );

  const init = useCallback(() => {
    setGetAmount('' as Luna);
    setBurnAmount('' as bLuna);
  }, []);

  const proceed = useCallback(
    async (
      status: WalletStatus,
      burnAmount: bLuna,
      swapFee: uLuna,
      beliefPrice: Ratio,
      maxSpread: Ratio,
    ) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      console.log('Swap.tsx..()', {
        address: status.walletAddress,
        amount: burnAmount,
        bAsset: burnCurrency.value,
        swapFee,
        beliefPrice,
        maxSpread,
      });

      const broadcasted = await swap({
        address: status.walletAddress,
        amount: burnAmount,
        bAsset: burnCurrency.value,
        swapFee,
        beliefPrice,
        maxSpread,
      });

      if (!broadcasted) {
        init();
      }
    },
    [bank.status, swap, burnCurrency.value, init],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    swapResult?.status === 'in-progress' ||
    swapResult?.status === 'done' ||
    swapResult?.status === 'fault'
  ) {
    return <TransactionRenderer result={swapResult} onExit={init} />;
  }

  return (
    <>
      {!!invalidTxFee && <WarningMessage>{invalidTxFee}</WarningMessage>}

      {/* Burn (bAsset) */}
      <div className="burn-description">
        <p>I want to burn</p>
        <p>
          {bLunaPrice?.bLunaPrice &&
            `1 ${burnCurrency.label} = ${formatLuna(
              (big(1).div(bLunaPrice?.bLunaPrice) as Big) as Luna<Big>,
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
          {bLunaPrice?.bLunaPrice &&
            `1 ${getCurrency.label} = ${formatLuna(
              (bLunaPrice?.bLunaPrice as string) as Luna,
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

      {burnAmount.length > 0 && bLunaPrice && offerSimulation && (
        <TxFeeList className="receipt">
          <TxFeeListItem label="Price">
            {formatLuna(bLunaPrice.bLunaPrice)} Luna per bLuna
          </TxFeeListItem>
          <TxFeeListItem label="Minimum Received">
            {formatLuna(demicrofy(offerSimulation.minimumReceived))} Luna
          </TxFeeListItem>
          <TxFeeListItem label="Swap Fee">
            {formatLuna(demicrofy(offerSimulation.swapFee))} Luna +{' '}
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
          !!invalidBurnAmount ||
          big(offerSimulation?.swapFee ?? 0).lte(0)
        }
        onClick={() =>
          proceed(
            status,
            burnAmount,
            offerSimulation!.swapFee,
            offerSimulation!.beliefPrice,
            offerSimulation!.maxSpread,
          )
        }
      >
        Burn
      </ActionButton>
    </>
  );
}

function BlankComponent() {
  return <div />;
}
