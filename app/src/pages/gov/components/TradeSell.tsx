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
import { sellFromSimulation } from 'pages/gov/logics/sellFromSimulation';
import { sellToSimulation } from 'pages/gov/logics/sellToSimulation';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { sellOptions } from 'pages/gov/transactions/sellOptions';
import { queryReverseSimulation } from 'queries/reverseSimulation';
import { querySimulation } from 'queries/simulation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

interface Item {
  label: string;
  value: string;
}

const fromCurrencies: Item[] = [{ label: 'ANC', value: 'anc' }];
const toCurrencies: Item[] = [{ label: 'UST', value: 'ust' }];

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
  const [fromAmount, setFromAmount] = useState<ANC>('' as ANC);
  const [toAmount, setToAmount] = useState<UST>('' as UST);

  const [resolveSimulation, simulation] = useResolveLast<
    TradeSimulation<uUST, uANC> | undefined | null
  >(() => null);

  const [fromCurrency, setFromCurrency] = useState<Item>(
    () => fromCurrencies[0],
  );
  const [toCurrency, setToCurrency] = useState<Item>(() => toCurrencies[0]);

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
    if (simulation?.toAmount) {
      setToAmount(formatUSTInput(demicrofy(simulation.toAmount)));
    }
  }, [simulation?.toAmount]);

  useEffect(() => {
    if (simulation?.fromAmount) {
      setFromAmount(formatANCInput(demicrofy(simulation.fromAmount)));
    }
  }, [simulation?.fromAmount]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateFromCurrency = useCallback((nextFromCurrencyValue: string) => {
    setFromCurrency(
      fromCurrencies.find(({ value }) => nextFromCurrencyValue === value) ??
        fromCurrencies[0],
    );
  }, []);

  const updateToCurrency = useCallback((nextToCurrencyValue: string) => {
    setToCurrency(
      toCurrencies.find(({ value }) => nextToCurrencyValue === value) ??
        toCurrencies[0],
    );
  }, []);

  const updateFromAmount = useCallback(
    async (nextFromAmount: string) => {
      if (nextFromAmount.trim().length === 0) {
        setToAmount('' as UST);
        setFromAmount('' as ANC);

        resolveSimulation(null);
      } else {
        const fromAmount: ANC = nextFromAmount as ANC;
        setFromAmount(fromAmount);

        if (serviceAvailable) {
          const amount = microfy(fromAmount).toString() as uANC;

          resolveSimulation(
            querySimulation(
              client,
              address,
              amount,
              address.terraswap.ancUstPair,
              {
                token: {
                  contract_addr: address.cw20.ANC,
                },
              },
            ).then(({ data: { simulation } }) =>
              simulation
                ? sellToSimulation(
                    simulation as terraswap.SimulationResponse<uUST>,
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

  const updateToAmount = useCallback(
    (nextToAmount: string) => {
      if (nextToAmount.trim().length === 0) {
        setFromAmount('' as ANC);
        setToAmount('' as UST);

        resolveSimulation(null);
      } else {
        const toAmount: UST = nextToAmount as UST;
        setToAmount(toAmount);

        if (serviceAvailable) {
          const amount = microfy(toAmount).toString() as uUST;

          resolveSimulation(
            queryReverseSimulation(
              client,
              address,
              amount,
              address.terraswap.ancUstPair,
              {
                native_token: {
                  denom: 'uusd' as Denom,
                },
              },
            ).then(({ data: { simulation } }) =>
              simulation
                ? sellFromSimulation(
                    simulation as terraswap.SimulationResponse<uUST>,
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
    setToAmount('' as UST);
    setFromAmount('' as ANC);
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
        <p>From</p>
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
                  updateFromAmount(
                    formatANCInput(demicrofy(bank.userBalances.uANC)),
                  )
                }
              >
                {formatANC(demicrofy(bank.userBalances.uANC))}{' '}
                {fromCurrency.label}
              </span>
            </span>
          )
        }
      >
        <MuiNativeSelect
          value={fromCurrency}
          onChange={({ target }) => updateFromCurrency(target.value)}
          IconComponent={fromCurrencies.length < 2 ? BlankComponent : undefined}
          disabled={fromCurrencies.length < 2}
        >
          {fromCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput
          placeholder="0"
          error={!!invalidBurnAmount}
          value={fromAmount}
          onKeyPress={onUstInputKeyPress as any}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateFromAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      <ArrowDownLine />

      {/* Get (Asset) */}
      <div className="gett-description">
        <p>To</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="gett"
        gridColumns={[120, '1fr']}
        error={!!invalidBurnAmount}
      >
        <MuiNativeSelect
          value={toCurrency}
          onChange={({ target }) => updateToCurrency(target.value)}
          IconComponent={toCurrencies.length < 2 ? BlankComponent : undefined}
          disabled={toCurrencies.length < 2}
        >
          {toCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput
          placeholder="0"
          error={!!invalidBurnAmount}
          value={toAmount}
          onKeyPress={onAncInputKeyPress as any}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateToAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      {fromAmount.length > 0 && simulation && (
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
          fromAmount.length === 0 ||
          big(fromAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidBurnAmount ||
          big(simulation?.swapFee ?? 0).lte(0)
        }
        onClick={() =>
          walletReady &&
          proceed(
            walletReady,
            fromAmount,
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
