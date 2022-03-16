import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useAncPriceQuery,
  useAncSellTx,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatANC,
  formatANCInput,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
} from '@anchor-protocol/notation';
import { ANC, NativeDenom, terraswap, u, UST } from '@anchor-protocol/types';
import { terraswapSimulationQuery } from '@libs/app-fns';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy, formatFluidDecimalPoints, microfy } from '@libs/formatter';
import { isZero } from '@libs/is-zero';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { useResolveLast } from '@libs/use-resolve-last';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import big from 'big.js';
import { DiscloseSlippageSelector } from 'components/DiscloseSlippageSelector';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { SlippageSelectorNegativeHelpText } from 'components/SlippageSelector';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { sellFromSimulation } from 'pages/trade/logics/sellFromSimulation';
import { sellToSimulation } from 'pages/trade/logics/sellToSimulation';
import { TradeSimulation } from 'pages/trade/models/tradeSimulation';
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

const FROM_CURRENCIES: Item[] = [{ label: 'ANC', value: 'anc' }];
const TO_CURRENCIES: Item[] = [{ label: 'UST', value: 'ust' }];

const SLIPPAGE_VALUES = [0.001, 0.005, 0.01];
const LOW_SLIPPAGE = 0.005;
const FRONTRUN_SLIPPAGE = 0.05;

export function TradeSell() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const { queryClient, contractAddress: address } = useAnchorWebapp();

  const bank = useAnchorBank();

  const [sell, sellResult] = useAncSellTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [fromAmount, setFromAmount] = useState<ANC>('' as ANC);
  const [toAmount, setToAmount] = useState<UST>('' as UST);

  const [slippage, setSlippage] = useState<number>(0.01);

  const [resolveSimulation, simulation] = useResolveLast<
    TradeSimulation<UST, ANC, ANC> | undefined | null
  >(() => null);

  const [fromCurrency, setFromCurrency] = useState<Item>(
    () => FROM_CURRENCIES[0],
  );
  const [toCurrency, setToCurrency] = useState<Item>(() => TO_CURRENCIES[0]);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: { ancPrice } = {} } = useAncPriceQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => connected && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connected],
  );

  const invalidFromAmount = useMemo(() => {
    if (fromAmount.length === 0 || !connected) return undefined;

    return microfy(fromAmount).gt(bank.tokenBalances.uANC)
      ? 'Not enough assets'
      : undefined;
  }, [bank.tokenBalances.uANC, fromAmount, connected]);

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
      FROM_CURRENCIES.find(({ value }) => nextFromCurrencyValue === value) ??
        FROM_CURRENCIES[0],
    );
  }, []);

  const updateToCurrency = useCallback((nextToCurrencyValue: string) => {
    setToCurrency(
      TO_CURRENCIES.find(({ value }) => nextToCurrencyValue === value) ??
        TO_CURRENCIES[0],
    );
  }, []);

  const updateFromAmount = useCallback(
    async (nextFromAmount: string, maxSpread: number) => {
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

        const amount = microfy(fromAmount).toString() as u<ANC>;

        resolveSimulation(
          terraswapSimulationQuery(
            address.terraswap.ancUstPair,
            {
              info: {
                token: {
                  contract_addr: address.cw20.ANC,
                },
              },
              amount,
            },
            queryClient,
          ).then(({ simulation }) => {
            return simulation
              ? sellToSimulation(
                  simulation as terraswap.pair.SimulationResponse<UST, ANC>,
                  amount,
                  bank.tax,
                  fixedFee,
                  maxSpread,
                )
              : undefined;
          }),
        );
      }
    },
    [
      address.cw20.ANC,
      address.terraswap.ancUstPair,
      bank.tax,
      fixedFee,
      queryClient,
      resolveSimulation,
    ],
  );

  const updateToAmount = useCallback(
    (nextToAmount: string, maxSpread: number) => {
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

        const amount = microfy(toAmount).toString() as u<UST>;

        resolveSimulation(
          terraswapSimulationQuery(
            address.terraswap.ancUstPair,
            {
              info: {
                native_token: {
                  denom: 'uusd' as NativeDenom,
                },
              },
              amount,
            },
            queryClient,
          ).then(({ simulation }) => {
            return simulation
              ? sellFromSimulation(
                  simulation as terraswap.pair.SimulationResponse<UST, ANC>,
                  amount,
                  bank.tax,
                  fixedFee,
                  maxSpread,
                )
              : undefined;
          }),
        );
      }
    },
    [
      address.terraswap.ancUstPair,
      bank.tax,
      fixedFee,
      queryClient,
      resolveSimulation,
    ],
  );

  const updateSlippage = useCallback(
    (nextSlippage: number) => {
      setSlippage(nextSlippage);
      updateFromAmount(fromAmount, nextSlippage);
    },
    [fromAmount, updateFromAmount],
  );

  const init = useCallback(() => {
    setToAmount('' as UST);
    setFromAmount('' as ANC);
  }, []);

  const proceed = useCallback(
    (burnAmount: ANC, maxSpread: number) => {
      if (!connected || !sell) {
        return;
      }

      sell({
        burnAmount,
        maxSpread,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connected, sell, init],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    sellResult?.status === StreamStatus.IN_PROGRESS ||
    sellResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={sellResult.value}
        onExit={() => {
          init();

          switch (sellResult.status) {
            case StreamStatus.IN_PROGRESS:
              sellResult.abort();
              break;
            case StreamStatus.DONE:
              sellResult.clear();
              break;
          }
        }}
      />
    );
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
          connected && (
            <span>
              Balance:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  updateFromAmount(
                    formatANCInput(demicrofy(bank.tokenBalances.uANC)),
                    slippage,
                  )
                }
              >
                {formatANC(demicrofy(bank.tokenBalances.uANC))}{' '}
                {fromCurrency.label}
              </span>
            </span>
          )
        }
      >
        <MuiNativeSelect
          value={fromCurrency}
          onChange={({ target }) => updateFromCurrency(target.value)}
          IconComponent={
            FROM_CURRENCIES.length < 2 ? BlankComponent : undefined
          }
          disabled={FROM_CURRENCIES.length < 2}
        >
          {FROM_CURRENCIES.map(({ label, value }) => (
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
            updateFromAmount(target.value, slippage)
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
          IconComponent={TO_CURRENCIES.length < 2 ? BlankComponent : undefined}
          disabled={TO_CURRENCIES.length < 2}
        >
          {TO_CURRENCIES.map(({ label, value }) => (
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
            updateToAmount(target.value, slippage)
          }
        />
      </SelectAndTextInputContainer>

      <DiscloseSlippageSelector
        className="slippage"
        items={SLIPPAGE_VALUES}
        value={slippage}
        onChange={updateSlippage}
        helpText={
          slippage < LOW_SLIPPAGE ? (
            <SlippageSelectorNegativeHelpText>
              The transaction may fail
            </SlippageSelectorNegativeHelpText>
          ) : slippage > FRONTRUN_SLIPPAGE ? (
            <SlippageSelectorNegativeHelpText>
              The transaction may be frontrun
            </SlippageSelectorNegativeHelpText>
          ) : undefined
        }
      />

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
      <ViewAddressWarning>
        <ActionButton
          className="submit"
          disabled={
            !availablePost ||
            !connected ||
            !sell ||
            !ancPrice ||
            fromAmount.length === 0 ||
            big(fromAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidFromAmount ||
            big(simulation?.swapFee ?? 0).lte(0)
          }
          onClick={() => proceed(fromAmount, slippage)}
        >
          Proceed
        </ActionButton>
      </ViewAddressWarning>
    </>
  );
}

function BlankComponent() {
  return <div />;
}
