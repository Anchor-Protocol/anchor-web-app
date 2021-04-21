import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatANCInput,
  formatExecuteMsgNumber,
  formatFluidDecimalPoints,
  formatUST,
  formatUSTInput,
  microfy,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
} from '@anchor-protocol/notation';
import { ANC, Denom, terraswap, uANC, UST, uUST } from '@anchor-protocol/types';
import {
  useConnectedWallet,
  ConnectedWallet,
} from '@anchor-protocol/wallet-provider';
import { useApolloClient } from '@apollo/client';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';
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
import big from 'big.js';
import { IconLineSeparator } from 'components/IconLineSeparator';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { MAX_SPREAD } from 'pages/gov/env';
import { sellFromSimulation } from 'pages/gov/logics/sellFromSimulation';
import { sellToSimulation } from 'pages/gov/logics/sellToSimulation';
import { AncPrice } from 'pages/gov/models/ancPrice';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { sellOptions } from 'pages/gov/transactions/sellOptions';
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

const fromCurrencies: Item[] = [{ label: 'ANC', value: 'anc' }];
const toCurrencies: Item[] = [{ label: 'UST', value: 'ust' }];

export function TradeSell() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { fixedGas } = useConstants();

  const client = useApolloClient();

  const address = useContractAddress();

  const bank = useBank();

  const [sell, sellResult] = useOperation(sellOptions, { bank });

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [fromAmount, setFromAmount] = useState<ANC>('' as ANC);
  const [toAmount, setToAmount] = useState<UST>('' as UST);

  const [resolveSimulation, simulation] = useResolveLast<
    TradeSimulation<uUST, uANC, uANC> | undefined | null
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
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidFromAmount = useMemo(() => {
    if (fromAmount.length === 0 || !connectedWallet) return undefined;

    return microfy(fromAmount).gt(bank.userBalances.uANC)
      ? 'Not enough assets'
      : undefined;
  }, [bank.userBalances.uANC, fromAmount, connectedWallet]);

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
      } else if (isZero(nextFromAmount)) {
        setToAmount('' as UST);
        setFromAmount(nextFromAmount as ANC);
        resolveSimulation(null);
      } else {
        const fromAmount: ANC = nextFromAmount as ANC;
        setFromAmount(fromAmount);

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
                  simulation as terraswap.SimulationResponse<uUST, uANC>,
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
        setFromAmount('' as ANC);
        setToAmount('' as UST);

        resolveSimulation(null);
      } else if (isZero(nextToAmount)) {
        setFromAmount('' as ANC);
        setToAmount(nextToAmount as UST);
        resolveSimulation(null);
      } else {
        const toAmount: UST = nextToAmount as UST;
        setToAmount(toAmount);

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
                  simulation as terraswap.SimulationResponse<uUST, uANC>,
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
    setToAmount('' as UST);
    setFromAmount('' as ANC);
  }, []);

  const proceed = useCallback(
    async (
      walletReady: ConnectedWallet,
      burnAmount: ANC,
      ancPrice: AncPrice,
      txFee: uUST,
    ) => {
      const broadcasted = await sell({
        address: walletReady.walletAddress,
        amount: burnAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(ancPrice.ANCPoolSize).div(ancPrice.USTPoolSize),
        ),
        maxSpread: MAX_SPREAD.toString(),
        txFee,
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
        <NumberMuiInput
          placeholder="0.00"
          error={!!invalidFromAmount}
          value={fromAmount}
          maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
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
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateToAmount(target.value)
          }
        />
      </SelectAndTextInputContainer>

      {fromAmount.length > 0 && simulation && (
        <TxFeeList className="receipt">
          <SwapListItem
            label="Price"
            currencyA="ANC"
            currencyB="UST"
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
            {formatUST(demicrofy(simulation.minimumReceived))} UST
          </TxFeeListItem>
          <TxFeeListItem label="Trading Fee">
            {formatUST(demicrofy(simulation.swapFee))} UST
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
          !connectedWallet.availablePost ||
          !ancPrice ||
          fromAmount.length === 0 ||
          big(fromAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidFromAmount ||
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
