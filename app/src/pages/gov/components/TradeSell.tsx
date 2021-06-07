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
} from '@anchor-protocol/notation';
import { ANC, Denom, terraswap, uANC, UST, uUST } from '@anchor-protocol/types';
import {
  terraswapReverseSimulationQuery,
  terraswapSimulationQuery,
  useAnchorWebapp,
  useAncPriceQuery,
  useAncSellTx,
} from '@anchor-protocol/webapp-provider';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { isZero } from '@terra-dev/is-zero';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { NumberMuiInput } from '@terra-dev/neumorphism-ui/components/NumberMuiInput';
import { SelectAndTextInputContainer } from '@terra-dev/neumorphism-ui/components/SelectAndTextInputContainer';
import { useResolveLast } from '@terra-dev/use-resolve-last';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useBank } from 'base/contexts/bank';
import big from 'big.js';
import { IconLineSeparator } from 'components/IconLineSeparator';
import { MessageBox } from 'components/MessageBox';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { validateTxFee } from 'logics/validateTxFee';
import { MAX_SPREAD } from 'pages/gov/env';
import { sellFromSimulation } from 'pages/gov/logics/sellFromSimulation';
import { sellToSimulation } from 'pages/gov/logics/sellToSimulation';
import { TradeSimulation } from 'pages/gov/models/tradeSimulation';
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

  const { mantleEndpoint, mantleFetch } = useTerraWebapp();

  const {
    constants: { fixedGas },
    contractAddress: address,
  } = useAnchorWebapp();

  const bank = useBank();

  const [sell, sellResult] = useAncSellTx();

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
  const { data: { ancPrice } = {} } = useAncPriceQuery();

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
          terraswapSimulationQuery({
            mantleEndpoint,
            mantleFetch,
            variables: {
              tokenPairContract: address.terraswap.ancUstPair,
              simulationQuery: {
                simulation: {
                  offer_asset: {
                    info: {
                      token: {
                        contract_addr: address.cw20.ANC,
                      },
                    },
                    amount,
                  },
                },
              },
            },
          }).then(({ simulation }) => {
            return simulation
              ? sellToSimulation(
                  simulation as terraswap.SimulationResponse<uUST, uANC>,
                  amount,
                  bank.tax,
                  fixedGas,
                )
              : undefined;
          }),
        );

        //resolveSimulation(
        //  querySimulation(
        //    client,
        //    address,
        //    amount,
        //    address.terraswap.ancUstPair,
        //    {
        //      token: {
        //        contract_addr: address.cw20.ANC,
        //      },
        //    },
        //  ).then(({ data: { simulation } }) =>
        //    simulation
        //      ? sellToSimulation(
        //          simulation as terraswap.SimulationResponse<uUST, uANC>,
        //          amount,
        //          bank.tax,
        //          fixedGas,
        //        )
        //      : undefined,
        //  ),
        //);
      }
    },
    [
      address.cw20.ANC,
      address.terraswap.ancUstPair,
      bank.tax,
      fixedGas,
      mantleEndpoint,
      mantleFetch,
      resolveSimulation,
    ],
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
          terraswapReverseSimulationQuery({
            mantleEndpoint,
            mantleFetch,
            variables: {
              tokenPairContract: address.terraswap.ancUstPair,
              simulationQuery: {
                simulation: {
                  offer_asset: {
                    info: {
                      native_token: {
                        denom: 'uusd' as Denom,
                      },
                    },
                    amount,
                  },
                },
              },
            },
          }).then(({ simulation }) => {
            return simulation
              ? sellFromSimulation(
                  simulation as terraswap.SimulationResponse<uUST, uANC>,
                  amount,
                  bank.tax,
                  fixedGas,
                )
              : undefined;
          }),
        );

        //resolveSimulation(
        //  queryReverseSimulation(
        //    client,
        //    address,
        //    amount,
        //    address.terraswap.ancUstPair,
        //    {
        //      native_token: {
        //        denom: 'uusd' as Denom,
        //      },
        //    },
        //  ).then(({ data: { simulation } }) =>
        //    simulation
        //      ? sellFromSimulation(
        //          simulation as terraswap.SimulationResponse<uUST, uANC>,
        //          amount,
        //          bank.tax,
        //          fixedGas,
        //        )
        //      : undefined,
        //  ),
        //);
      }
    },
    [
      address.terraswap.ancUstPair,
      bank.tax,
      fixedGas,
      mantleEndpoint,
      mantleFetch,
      resolveSimulation,
    ],
  );

  const init = useCallback(() => {
    setToAmount('' as UST);
    setFromAmount('' as ANC);
  }, []);

  const proceed = useCallback(
    (burnAmount: ANC) => {
      if (!connectedWallet || !sell) {
        return;
      }

      sell({
        burnAmount,
        maxSpread: MAX_SPREAD,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connectedWallet, sell, init],
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
          !sell ||
          !ancPrice ||
          fromAmount.length === 0 ||
          big(fromAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidFromAmount ||
          big(simulation?.swapFee ?? 0).lte(0)
        }
        onClick={() => proceed(fromAmount)}
      >
        Proceed
      </ActionButton>
    </>
  );
}

function BlankComponent() {
  return <div />;
}
