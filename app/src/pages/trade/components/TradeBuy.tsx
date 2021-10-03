import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  formatANC,
  formatANCInput,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import {
  ANC,
  NativeDenom,
  terraswap,
  Token,
  u,
  UST,
} from '@anchor-protocol/types';
import {
  useAncBuyTx,
  useAnchorWebapp,
  useAncPriceQuery,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { terraswapSimulationQuery } from '@libs/app-fns';
import { useFixedFee } from '@libs/app-provider';
import { max, min } from '@libs/big-math';
import { demicrofy, formatFluidDecimalPoints, microfy } from '@libs/formatter';
import { isZero } from '@libs/is-zero';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import { useResolveLast } from '@libs/use-resolve-last';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { validateTxFee } from 'logics/validateTxFee';
import { buyFromSimulation } from 'pages/trade/logics/buyFromSimulation';
import { buyToSimulation } from 'pages/trade/logics/buyToSimulation';
import { TradeSimulation } from 'pages/trade/models/tradeSimulation';
import React, {
  ChangeEvent,
  ReactNode,
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

  const [openConfirm, confirmElement] = useConfirm();

  const fixedFee = useFixedFee();

  const { queryClient, contractAddress: address } = useAnchorWebapp();

  const bank = useAnchorBank();

  const [buy, buyResult] = useAncBuyTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [fromAmount, setFromAmount] = useState<UST>('' as UST);
  const [toAmount, setToAmount] = useState<ANC>('' as ANC);

  const [resolveSimulation, simulation] = useResolveLast<
    TradeSimulation<ANC, UST, Token> | undefined | null
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
  const ustBalance = useMemo(() => {
    const txFee = min(
      max(
        big(big(bank.userBalances.uUSD).minus(fixedFee)).div(
          big(big(1).plus(bank.tax.taxRate)).mul(bank.tax.taxRate),
        ),
        0,
      ),
      bank.tax.maxTaxUUSD,
    );

    return max(
      big(bank.userBalances.uUSD).minus(txFee).minus(big(fixedFee).mul(3)),
      0,
    ) as u<UST<Big>>;
  }, [bank.tax.maxTaxUUSD, bank.tax.taxRate, bank.userBalances.uUSD, fixedFee]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedFee),
    [bank, fixedFee, connectedWallet],
  );

  const invalidFromAmount = useMemo(() => {
    if (fromAmount.length === 0 || !connectedWallet || !simulation)
      return undefined;

    return big(microfy(fromAmount))
      .plus(simulation.txFee)
      .plus(fixedFee)
      .gt(bank.userBalances.uUSD)
      ? 'Not enough assets'
      : undefined;
  }, [
    fromAmount,
    connectedWallet,
    simulation,
    fixedFee,
    bank.userBalances.uUSD,
  ]);

  // FIXME anc buy real tx fee is fixed_gas (simulation.txFee is no matter)
  const invalidNextTransaction = useMemo(() => {
    if (fromAmount.length === 0 || !simulation || !!invalidFromAmount) {
      return undefined;
    }

    const remainUUSD = big(bank.userBalances.uUSD)
      .minus(microfy(fromAmount))
      .minus(simulation.txFee)
      .minus(fixedFee);

    if (remainUUSD.lt(fixedFee)) {
      return 'Leaving less UST in your account may lead to insufficient transaction fees for future transactions.';
    }

    return undefined;
  }, [
    bank.userBalances.uUSD,
    fixedFee,
    fromAmount,
    invalidFromAmount,
    simulation,
  ]);

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

        const amount = microfy(fromAmount).toString() as u<UST>;

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
              ? buyToSimulation(
                  simulation as terraswap.pair.SimulationResponse<ANC>,
                  amount,
                  bank.tax,
                  fixedFee,
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

        const amount = microfy(toAmount).toString() as u<ANC>;

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
              ? buyFromSimulation(
                  simulation as terraswap.pair.SimulationResponse<ANC, UST>,
                  amount,
                  bank.tax,
                  fixedFee,
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

  const init = useCallback(() => {
    setToAmount('' as ANC);
    setFromAmount('' as UST);
  }, []);

  const proceed = useCallback(
    async (fromAmount: UST, txFee: u<UST>, confirm: ReactNode) => {
      if (!connectedWallet || !buy) {
        return;
      }

      if (confirm) {
        const userConfirm = await openConfirm({
          description: confirm,
          agree: 'Proceed',
          disagree: 'Cancel',
        });

        if (!userConfirm) {
          return;
        }
      }

      buy({
        fromAmount,
        txFee,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [buy, connectedWallet, init, openConfirm],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    buyResult?.status === StreamStatus.IN_PROGRESS ||
    buyResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={buyResult.value}
        onExit={() => {
          init();

          switch (buyResult.status) {
            case StreamStatus.IN_PROGRESS:
              buyResult.abort();
              break;
            case StreamStatus.DONE:
              buyResult.clear();
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
                    formatUSTInput(
                      demicrofy(ustBalance ?? bank.userBalances.uUSD),
                    ),
                  )
                }
              >
                {formatUST(demicrofy(ustBalance ?? bank.userBalances.uUSD))}{' '}
                {/*/{' '}*/}
                {/*{formatUST(demicrofy(bank.userBalances.uUSD))}{' '}*/}
                {/*={' '}*/}
                {/*{formatUST(demicrofy(big(bank.userBalances.uUSD).minus(simulation?.txFee ?? 0).minus(ustBalance ?? 0) as u<UST<Big>>))}{' '}*/}
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

      {invalidNextTransaction && ustBalance && (
        <MessageBox style={{ marginTop: 30, marginBottom: 30 }}>
          {invalidNextTransaction}
        </MessageBox>
      )}

      {/* Submit */}
      <ViewAddressWarning>
        <ActionButton
          className="submit"
          style={
            invalidNextTransaction
              ? {
                  backgroundColor: '#c12535',
                }
              : undefined
          }
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !buy ||
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
            proceed(fromAmount, simulation.txFee, invalidNextTransaction)
          }
        >
          Proceed
        </ActionButton>
      </ViewAddressWarning>

      {confirmElement}
    </>
  );
}

function BlankComponent() {
  return <div />;
}
