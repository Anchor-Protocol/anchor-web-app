import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  demicrofy,
  formatANC,
  formatANCInput,
  formatExecuteMsgNumber,
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
  terraswap,
  uANC,
  UST,
  uToken,
  uUST,
} from '@anchor-protocol/types';
import {
  useConnectedWallet,
  WalletReady,
} from '@anchor-protocol/wallet-provider';
import { useApolloClient } from '@apollo/client';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { min } from '@terra-dev/big-math';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { isZero } from '@terra-dev/is-zero';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { NumberMuiInput } from '@terra-dev/neumorphism-ui/components/NumberMuiInput';
import { SelectAndTextInputContainer } from '@terra-dev/neumorphism-ui/components/SelectAndTextInputContainer';
import { useResolveLast } from '@terra-dev/use-resolve-last';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import { useContractAddress } from 'base/contexts/contract';
import { queryReverseSimulation } from 'base/queries/reverseSimulation';
import { querySimulation } from 'base/queries/simulation';
import big, { Big } from 'big.js';
import { IconLineSeparator } from 'components/IconLineSeparator';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { MAX_SPREAD } from 'pages/gov/env';
import { buyFromSimulation } from 'pages/gov/logics/buyFromSimulation';
import { buyToSimulation } from 'pages/gov/logics/buyToSimulation';
import { AncPrice } from 'pages/gov/models/ancPrice';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { buyOptions } from 'pages/gov/transactions/buyOptions';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface Item {
  label: string;
  value: string;
}

const fromCurrencies: Item[] = [{ label: 'UST', value: 'ust' }];
const toCurrencies: Item[] = [{ label: 'ANC', value: 'anc' }];

export function TradeBuy() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { fixedGas } = useConstants();

  const client = useApolloClient();

  const address = useContractAddress();

  const bank = useBank();

  const [buy, buyResult] = useOperation(buyOptions, { bank });

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [fromAmount, setFromAmount] = useState<UST>('' as UST);
  const [toAmount, setToAmount] = useState<ANC>('' as ANC);

  const [resolveSimulation, simulation] = useResolveLast<
    TradeSimulation<uANC, uUST, uToken> | undefined | null
  >(() => null);

  const [fromCurrency, setFromCurrency] = useState<Item>(
    () => fromCurrencies[0],
  );
  const [toCurrency, setToCurrency] = useState<Item>(() => toCurrencies[0]);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const {
    data: { ancPrice },
  } = useANCPrice();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const ustBalance = useMemo(() => {
    const txFee = min(
      big(big(bank.userBalances.uUSD).minus(fixedGas)).div(
        big(1).plus(bank.tax.taxRate),
      ),
      bank.tax.maxTaxUUSD,
    );

    return big(bank.userBalances.uUSD)
      .minus(txFee)
      .minus(fixedGas * 2) as uUST<Big>;
  }, [bank.tax.maxTaxUUSD, bank.tax.taxRate, bank.userBalances.uUSD, fixedGas]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidFromAmount = useMemo(() => {
    if (fromAmount.length === 0 || !connectedWallet) return undefined;

    return microfy(fromAmount).gt(bank.userBalances.uUSD)
      ? 'Not enough assets'
      : undefined;
  }, [bank.userBalances.uUSD, fromAmount, connectedWallet]);

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    if (simulation?.toAmount) {
      setToAmount(formatANCInput(demicrofy(simulation.toAmount)));
    }
  }, [simulation?.toAmount]);

  useEffect(() => {
    if (simulation?.fromAmount) {
      setFromAmount(formatUSTInput(demicrofy(simulation.fromAmount)));
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
        setToAmount('' as ANC);
        setFromAmount('' as UST);

        resolveSimulation(null);
      } else if (isZero(nextFromAmount)) {
        setToAmount('' as ANC);
        setFromAmount(nextFromAmount as UST);
        resolveSimulation(null);
      } else {
        const fromAmount: UST = nextFromAmount as UST;
        setFromAmount(fromAmount);

        const amount = microfy(fromAmount).toString() as uUST;

        resolveSimulation(
          querySimulation(
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
              ? buyToSimulation(
                  simulation as terraswap.SimulationResponse<uANC>,
                  amount,
                  bank.tax,
                  fixedGas,
                )
              : undefined,
          ),
        );
      }
    },
    [address, bank.tax, client, fixedGas, resolveSimulation],
  );

  const updateToAmount = useCallback(
    (nextToAmount: string) => {
      if (nextToAmount.trim().length === 0) {
        setFromAmount('' as UST);
        setToAmount('' as ANC);

        resolveSimulation(null);
      } else if (isZero(nextToAmount)) {
        console.log('TradeBuy.tsx..()', nextToAmount);
        setFromAmount('' as UST);
        setToAmount(nextToAmount as ANC);
        resolveSimulation(null);
      } else {
        const toAmount: ANC = nextToAmount as ANC;
        setToAmount(toAmount);

        const amount = microfy(toAmount).toString() as uANC;

        resolveSimulation(
          queryReverseSimulation(
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
              ? buyFromSimulation(
                  simulation as terraswap.SimulationResponse<uANC, uUST>,
                  amount,
                  bank.tax,
                  fixedGas,
                )
              : undefined,
          ),
        );
      }
    },
    [address, bank.tax, client, fixedGas, resolveSimulation],
  );

  const init = useCallback(() => {
    setToAmount('' as ANC);
    setFromAmount('' as UST);
  }, []);

  const proceed = useCallback(
    async (
      walletReady: WalletReady,
      fromAmount: UST,
      ancPrice: AncPrice,
      txFee: uUST,
    ) => {
      const broadcasted = await buy({
        address: walletReady.walletAddress,
        amount: fromAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(ancPrice.USTPoolSize).div(ancPrice.ANCPoolSize),
        ),
        maxSpread: MAX_SPREAD.toString(),
        denom: 'uusd',
        txFee,
      });

      if (!broadcasted) {
        init();
      }
    },
    [buy, init],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    buyResult?.status === 'in-progress' ||
    buyResult?.status === 'done' ||
    buyResult?.status === 'fault'
  ) {
    return <TransactionRenderer result={buyResult} onExit={init} />;
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
        error={!!invalidFromAmount}
        leftHelperText={invalidFromAmount}
        rightHelperText={
          !!connectedWallet && (
            <span>
              Balance:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  updateFromAmount(
                    formatUSTInput(
                      demicrofy(ustBalance ?? bank.userBalances.uUSD),
                    ),
                  )
                }
              >
                {formatUST(demicrofy(ustBalance ?? bank.userBalances.uUSD))}{' '}
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
        <NumberMuiInput
          placeholder="0.00"
          error={!!invalidFromAmount}
          value={fromAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateFromAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      <IconLineSeparator />

      {/* Get (Asset) */}
      <div className="gett-description">
        <p>To</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="gett"
        gridColumns={[120, '1fr']}
        error={!!invalidFromAmount}
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
        <NumberMuiInput
          placeholder="0.00"
          error={!!invalidFromAmount}
          value={toAmount}
          maxIntegerPoinsts={5}
          maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
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
            initialDirection="b/a"
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
            {formatANC(demicrofy(simulation.minimumReceived))} ANC
          </TxFeeListItem>
          <TxFeeListItem label="Trading Fee">
            {formatANC(demicrofy(simulation.swapFee))} ANC
          </TxFeeListItem>
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(simulation.txFee))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          !connectedWallet ||
          !ancPrice ||
          fromAmount.length === 0 ||
          big(fromAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidFromAmount ||
          !simulation ||
          big(simulation?.swapFee ?? 0).lte(0)
        }
        onClick={() =>
          connectedWallet &&
          ancPrice &&
          simulation &&
          proceed(connectedWallet, fromAmount, ancPrice, simulation.txFee)
        }
      >
        Proceed
      </ActionButton>
    </>
  );
}

function BlankComponent() {
  return <div />;
}
