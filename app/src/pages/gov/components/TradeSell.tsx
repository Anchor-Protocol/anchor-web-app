import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatANCInput,
  formatFluidDecimalPoints,
  formatUST,
  formatUSTInput,
  microfy,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import {
  ANC,
  Denom,
  Rate,
  terraswap,
  uANC,
  UST,
  uUST,
} from '@anchor-protocol/types';
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
import { useContractAddress } from 'contexts/contract';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { sellAskSimulation } from 'pages/gov/logics/sellAskSimulation';
import { sellOfferSimulation } from 'pages/gov/logics/sellOfferSimulation';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { sellOptions } from 'pages/gov/transactions/sellOptions';
import { queryTerraswapOfferSimulation } from 'queries/terraswapOfferSimulation';
import { queryTerraswapReverseOfferSimulation } from 'queries/terraswapReverseOfferSimulation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

interface Item {
  label: string;
  value: string;
}

const burnCurrencies: Item[] = [{ label: 'ANC', value: 'anc' }];
const getCurrencies: Item[] = [{ label: 'UST', value: 'ust' }];

export function TradeSell() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const client = useApolloClient();

  const address = useContractAddress();

  const [sell, sellResult] = useOperation(sellOptions, {});

  const { onKeyPress: onUstInputKeyPress } = useRestrictedNumberInput({
    maxIntegerPoinsts: UST_INPUT_MAXIMUM_INTEGER_POINTS,
    maxDecimalPoints: UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  });

  const { onKeyPress: onAncInputKeyPress } = useRestrictedNumberInput({
    maxIntegerPoinsts: ANC_INPUT_MAXIMUM_INTEGER_POINTS,
    maxDecimalPoints: ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  });

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [getAmount, setGetAmount] = useState<UST>('' as UST);
  const [burnAmount, setBurnAmount] = useState<ANC>('' as ANC);

  const [resolveSimulation, simulation] = useResolveLast<
    TradeSimulation<uUST, uANC> | undefined | null
  >(() => null);

  const [burnCurrency, setBurnCurrency] = useState<Item>(
    () => burnCurrencies[0],
  );
  const [getCurrency, setGetCurrency] = useState<Item>(() => getCurrencies[0]);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidBurnAmount = useServiceConnectedMemo(
    () => undefined,
    [],
    undefined,
  );

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    if (simulation?.getAmount) {
      setGetAmount(formatUSTInput(demicrofy(simulation.getAmount)));
    }
  }, [simulation?.getAmount]);

  useEffect(() => {
    if (simulation?.burnAmount) {
      setBurnAmount(formatANCInput(demicrofy(simulation.burnAmount)));
    }
  }, [simulation?.burnAmount]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBurnCurrency = useCallback((nextBurnCurrencyValue: string) => {
    setBurnCurrency(
      burnCurrencies.find(({ value }) => nextBurnCurrencyValue === value) ??
        burnCurrencies[0],
    );
  }, []);

  const updateGetCurrency = useCallback((nextGetCurrencyValue: string) => {
    setGetCurrency(
      getCurrencies.find(({ value }) => nextGetCurrencyValue === value) ??
        getCurrencies[0],
    );
  }, []);

  const updateBurnAmount = useCallback(
    async (nextBurnAmount: string) => {
      if (nextBurnAmount.trim().length === 0) {
        setGetAmount('' as UST);
        setBurnAmount('' as ANC);

        resolveSimulation(null);
      } else {
        const burnAmount: ANC = nextBurnAmount as ANC;
        setBurnAmount(burnAmount);

        if (serviceAvailable) {
          const amount = microfy(burnAmount).toString() as uANC;

          resolveSimulation(
            queryTerraswapOfferSimulation(
              client,
              address,
              amount,
              address.terraswap.ancUstPair,
              address.cw20.ANC,
            ).then(({ data: { terraswapOfferSimulation } }) =>
              terraswapOfferSimulation
                ? sellOfferSimulation(
                    terraswapOfferSimulation as terraswap.SimulationResponse<uUST>,
                    amount,
                    bank.tax,
                    fixedGas,
                  )
                : undefined,
            ),
          );
        }
      }
    },
    [address, bank.tax, client, fixedGas, resolveSimulation, serviceAvailable],
  );

  const updateGetAmount = useCallback(
    (nextGetAmount: string) => {
      if (nextGetAmount.trim().length === 0) {
        setBurnAmount('' as ANC);
        setGetAmount('' as UST);

        resolveSimulation(null);
      } else {
        const getAmount: UST = nextGetAmount as UST;
        setGetAmount(getAmount);

        if (serviceAvailable) {
          const amount = microfy(getAmount).toString() as uUST;

          resolveSimulation(
            queryTerraswapReverseOfferSimulation(
              client,
              address,
              amount,
              address.terraswap.ancUstPair,
              'uusd' as Denom,
            ).then(({ data: { terraswapOfferSimulation } }) =>
              terraswapOfferSimulation
                ? sellAskSimulation(
                    terraswapOfferSimulation as terraswap.SimulationResponse<uUST>,
                    amount,
                    bank.tax,
                    fixedGas,
                  )
                : undefined,
            ),
          );
        }
      }
    },
    [address, bank.tax, client, fixedGas, resolveSimulation, serviceAvailable],
  );

  const init = useCallback(() => {
    setGetAmount('' as UST);
    setBurnAmount('' as ANC);
  }, []);

  const proceed = useCallback(
    async (
      walletReady: WalletReady,
      burnAmount: ANC,
      beliefPrice: Rate,
      maxSpread: Rate,
    ) => {
      const broadcasted = await sell({
        address: walletReady.walletAddress,
        amount: burnAmount,
        beliefPrice: formatFluidDecimalPoints(big(1).div(beliefPrice), 18, {
          fallbackValue: '0',
        }),
        maxSpread,
      });

      if (!broadcasted) {
        init();
      }
    },
    [sell, init],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    sellResult?.status === 'in-progress' ||
    sellResult?.status === 'done' ||
    sellResult?.status === 'fault'
  ) {
    return <TransactionRenderer result={sellResult} onExit={init} />;
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
                    formatANCInput(demicrofy(bank.userBalances.uANC)),
                  )
                }
              >
                {formatANC(demicrofy(bank.userBalances.uANC))}{' '}
                {burnCurrency.label}
              </span>
            </span>
          )
        }
      >
        <MuiNativeSelect
          value={burnCurrency}
          onChange={({ target }) => updateBurnCurrency(target.value)}
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
          placeholder="0"
          error={!!invalidBurnAmount}
          value={burnAmount}
          onKeyPress={onUstInputKeyPress as any}
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
          IconComponent={getCurrencies.length < 2 ? BlankComponent : undefined}
          disabled={getCurrencies.length < 2}
        >
          {getCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput
          placeholder="0"
          error={!!invalidBurnAmount}
          value={getAmount}
          onKeyPress={onAncInputKeyPress as any}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateGetAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      {burnAmount.length > 0 && simulation && (
        <TxFeeList className="receipt">
          <SwapListItem
            label="Price"
            currencyA="UST"
            currencyB="ANC"
            exchangeRateAB={simulation.beliefPrice}
            initialDirection="a/b"
            formatExchangeRate={(price, direction) =>
              formatFluidDecimalPoints(
                price,
                direction === 'a/b'
                  ? UST_INPUT_MAXIMUM_DECIMAL_POINTS
                  : ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
                { delimiter: true },
              )
            }
          />
          <TxFeeListItem label="Minimum Received">
            {formatUST(demicrofy(simulation.minimumReceived))} UST
          </TxFeeListItem>
          <TxFeeListItem label="Trading Fee">
            {formatUST(demicrofy(simulation.swapFee))} UST
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
