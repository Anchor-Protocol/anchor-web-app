import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import {
  bLuna,
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
  formatLunaInput,
  formatUST,
  Luna,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  microfy,
  Ratio,
  ubLuna,
  uLuna,
} from '@anchor-protocol/notation';
import { useResolveLast } from '@anchor-protocol/use-resolve-last';
import { useRestrictedNumberInput } from '@anchor-protocol/use-restricted-input';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { useApolloClient } from '@apollo/client';
import {
  Input as MuiInput,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import big from 'big.js';
import { ArrowDownLine } from 'components/ArrowDownLine';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useAddressProvider } from 'contexts/contract';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { askSimulation } from '../logics/askSimulation';
import { offerSimulation } from '../logics/offerSimulation';
import { validateBurnAmount } from '../logics/validateBurnAmount';
import { SwapSimulation } from '../models/swapSimulation';
import { queryTerraswapAskSimulation } from '../queries/terraswapAskSimulation';
import { useTerraswapBLunaPrice } from '../queries/terraswapBLunaPrice';
import { queryTerraswapOfferSimulation } from '../queries/terraswapOfferSimulation';
import { swapOptions } from '../transactions/swapOptions';

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
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const client = useApolloClient();

  const addressProvider = useAddressProvider();

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

  const [resolveSimulation, simulation] = useResolveLast<
    SwapSimulation | undefined | null
  >(() => null);

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
    data: { terraswapPoolInfo: bLunaPrice },
  } = useTerraswapBLunaPrice();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidBurnAmount = useServiceConnectedMemo(
    () => validateBurnAmount(burnAmount, bank),
    [bank, burnAmount],
    undefined,
  );

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    if (simulation?.lunaAmount) {
      setGetAmount(formatLunaInput(demicrofy(simulation.lunaAmount)));
    }
  }, [simulation?.lunaAmount]);

  useEffect(() => {
    if (simulation?.bLunaAmount) {
      setBurnAmount(formatLunaInput(demicrofy(simulation.bLunaAmount)));
    }
  }, [simulation?.bLunaAmount]);

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
    async (nextBurnAmount: string) => {
      if (nextBurnAmount.trim().length === 0) {
        setGetAmount('' as Luna);
        setBurnAmount('' as bLuna);

        resolveSimulation(null);
      } else {
        const burnAmount: bLuna = nextBurnAmount as bLuna;
        setBurnAmount(burnAmount);

        if (serviceAvailable) {
          const amount = microfy(burnAmount).toString() as ubLuna;

          resolveSimulation(
            queryTerraswapOfferSimulation(
              client,
              addressProvider,
              amount,
            ).then(({ data: { terraswapOfferSimulation } }) =>
              terraswapOfferSimulation
                ? offerSimulation(
                    terraswapOfferSimulation.commission_amount,
                    terraswapOfferSimulation.return_amount,
                    terraswapOfferSimulation.spread_amount,
                    amount,
                    bank.tax,
                  )
                : undefined,
            ),
          );
        }
      }
    },
    [addressProvider, bank.tax, client, resolveSimulation, serviceAvailable],
  );

  const updateGetAmount = useCallback(
    (nextGetAmount: string) => {
      if (nextGetAmount.trim().length === 0) {
        setBurnAmount('' as bLuna);
        setGetAmount('' as Luna);

        resolveSimulation(null);
      } else {
        const getAmount: Luna = nextGetAmount as Luna;
        setGetAmount(getAmount);

        if (serviceAvailable) {
          const amount = microfy(getAmount).toString() as uLuna;

          resolveSimulation(
            queryTerraswapAskSimulation(
              client,
              addressProvider,
              amount,
            ).then(({ data: { terraswapAskSimulation } }) =>
              terraswapAskSimulation
                ? askSimulation(
                    terraswapAskSimulation.commission_amount,
                    terraswapAskSimulation.return_amount,
                    terraswapAskSimulation.spread_amount,
                    amount,
                    bank.tax,
                  )
                : undefined,
            ),
          );
        }
      }
    },
    [addressProvider, bank.tax, client, resolveSimulation, serviceAvailable],
  );

  const init = useCallback(() => {
    setGetAmount('' as Luna);
    setBurnAmount('' as bLuna);
  }, []);

  const proceed = useCallback(
    async (
      walletReady: WalletReady,
      burnAmount: bLuna,
      beliefPrice: Ratio,
      maxSpread: Ratio,
    ) => {
      const broadcasted = await swap({
        address: walletReady.walletAddress,
        amount: burnAmount,
        bAsset: burnCurrency.value,
        beliefPrice: formatFluidDecimalPoints(big(1).div(beliefPrice), 18, {
          fallbackValue: '0',
        }),
        maxSpread,
      });

      if (!broadcasted) {
        init();
      }
    },
    [swap, burnCurrency.value, init],
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
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      {/* Burn (bAsset) */}
      <div className="burn-description">
        <p>I want to burn</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="burn"
        gridColumns={[100, '1fr']}
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
          onKeyPress={onLunaInputKeyPress as any}
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
        gridColumns={[100, '1fr']}
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
          onKeyPress={onLunaInputKeyPress as any}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateGetAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      {burnAmount.length > 0 && bLunaPrice && simulation && (
        <TxFeeList className="receipt">
          <SwapListItem
            label="Price"
            currencyA="Luna"
            currencyB="bLuna"
            exchangeRateAB={simulation.beliefPrice}
            initialDirection="a/b"
            formatExchangeRate={(price) =>
              formatFluidDecimalPoints(
                price,
                LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
                { delimiter: true },
              )
            }
          />
          <TxFeeListItem label="Minimum Received">
            {formatLuna(demicrofy(simulation.minimumReceived))} Luna
          </TxFeeListItem>
          <TxFeeListItem label="Trading Fee">
            {formatLuna(demicrofy(simulation.swapFee))} Luna
          </TxFeeListItem>
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedGas))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          !serviceAvailable ||
          burnAmount.length === 0 ||
          big(burnAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidBurnAmount ||
          big(simulation?.swapFee ?? 0).lte(0)
        }
        onClick={() =>
          walletReady &&
          proceed(
            walletReady,
            burnAmount,
            simulation!.beliefPrice,
            simulation!.maxSpread,
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
