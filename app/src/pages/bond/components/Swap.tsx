import { validateTxFee } from '@anchor-protocol/app-fns';
import { useAnchorWebapp, useBondSwapTx } from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import {
  formatLuna,
  formatLunaInput,
  formatUST,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import type { bLuna, Luna, NativeDenom, Rate, u } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import { terraswapSimulationQuery } from '@libs/app-fns';
import { useFixedFee } from '@libs/app-provider';
import {
  demicrofy,
  formatExecuteMsgNumber,
  formatFluidDecimalPoints,
  microfy,
} from '@libs/formatter';
import { isZero } from '@libs/is-zero';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { useResolveLast } from '@libs/use-resolve-last';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { DiscloseSlippageSelector } from 'components/DiscloseSlippageSelector';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { SlippageSelectorNegativeHelpText } from 'components/SlippageSelector';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { swapBurnSimulation } from '../logics/swapBurnSimulation';
import { swapGetSimulation } from '../logics/swapGetSimulation';
import { validateBurnAmount } from '../logics/validateBurnAmount';
import { SwapSimulation } from '../models/swapSimulation';

//import { useTerraswapBLunaPrice } from '../queries/terraswapBLunaPrice';

interface Item {
  label: string;
  value: string;
}

const burnCurrencies: Item[] = [{ label: 'bLUNA', value: 'bluna' }];
const getCurrencies: Item[] = [{ label: 'LUNA', value: 'luna' }];

const slippageValues = [0.01, 0.03, 0.05];

export function Swap() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { queryClient, contractAddress: address } = useAnchorWebapp();

  const fixedFee = useFixedFee();

  const [swap, swapResult] = useBondSwapTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [burnAmount, setBurnAmount] = useState<bLuna>('' as bLuna);
  const [getAmount, setGetAmount] = useState<Luna>('' as Luna);

  const [slippage, setSlippage] = useState<number>(0.05);

  const [resolveSimulation, simulation] = useResolveLast<
    SwapSimulation<Luna, bLuna> | undefined | null
  >(() => null);

  const [burnCurrency, setBurnCurrency] = useState<Item>(
    () => burnCurrencies[0],
  );
  const [getCurrency, setGetCurrency] = useState<Item>(() => getCurrencies[0]);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connectedWallet],
  );

  const invalidBurnAmount = useMemo(
    () => !!connectedWallet && validateBurnAmount(burnAmount, bank),
    [bank, burnAmount, connectedWallet],
  );

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    if (simulation?.getAmount) {
      setGetAmount(formatLunaInput(demicrofy(simulation.getAmount)));
    }
  }, [simulation?.getAmount]);

  useEffect(() => {
    if (simulation?.burnAmount) {
      setBurnAmount(formatLunaInput(demicrofy(simulation.burnAmount)));
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
    async (nextBurnAmount: string, maxSpread: number) => {
      if (nextBurnAmount.trim().length === 0) {
        setGetAmount('' as Luna);
        setBurnAmount('' as bLuna);

        resolveSimulation(null);
      } else if (isZero(nextBurnAmount)) {
        setGetAmount('' as Luna);
        setBurnAmount(nextBurnAmount as bLuna);

        resolveSimulation(null);
      } else {
        const burnAmount: bLuna = nextBurnAmount as bLuna;
        setBurnAmount(burnAmount);

        const amount = microfy(burnAmount).toString() as u<bLuna>;

        resolveSimulation(
          terraswapSimulationQuery(
            address.terraswap.blunaLunaPair,
            {
              info: {
                token: {
                  contract_addr: address.cw20.bLuna,
                },
              },
              amount,
            },
            queryClient,
          ).then(({ simulation }) => {
            return simulation
              ? swapGetSimulation(
                  simulation as terraswap.pair.SimulationResponse<Luna>,
                  amount,
                  bank.tax,
                  maxSpread,
                )
              : undefined;
          }),
        );
      }
    },
    [
      address.cw20.bLuna,
      address.terraswap.blunaLunaPair,
      bank.tax,
      queryClient,
      resolveSimulation,
    ],
  );

  const updateGetAmount = useCallback(
    (nextGetAmount: string, maxSpread: number) => {
      if (nextGetAmount.trim().length === 0) {
        setBurnAmount('' as bLuna);
        setGetAmount('' as Luna);

        resolveSimulation(null);
      } else if (isZero(nextGetAmount)) {
        setBurnAmount('' as bLuna);
        setGetAmount(nextGetAmount as Luna);

        resolveSimulation(null);
      } else {
        const getAmount: Luna = nextGetAmount as Luna;
        setGetAmount(getAmount);

        const amount = microfy(getAmount).toString() as u<Luna>;

        resolveSimulation(
          terraswapSimulationQuery(
            address.terraswap.blunaLunaPair,
            {
              info: {
                native_token: {
                  denom: 'uluna' as NativeDenom,
                },
              },
              amount,
            },
            queryClient,
          ).then(({ simulation }) => {
            return simulation
              ? swapBurnSimulation(
                  simulation as terraswap.pair.SimulationResponse<Luna>,
                  amount,
                  bank.tax,
                  maxSpread,
                )
              : undefined;
          }),
        );
      }
    },
    [address.terraswap.blunaLunaPair, bank.tax, queryClient, resolveSimulation],
  );

  const updateSlippage = useCallback(
    (nextSlippage: number) => {
      setSlippage(nextSlippage);
      updateBurnAmount(burnAmount, nextSlippage);
    },
    [burnAmount, updateBurnAmount],
  );

  const init = useCallback(() => {
    setGetAmount('' as Luna);
    setBurnAmount('' as bLuna);
  }, []);

  const proceed = useCallback(
    (burnAmount: bLuna, beliefPrice: Rate, maxSpread: number) => {
      if (!connectedWallet || !swap) {
        return;
      }

      swap({
        burnAmount,
        beliefPrice: formatExecuteMsgNumber(big(1).div(beliefPrice)) as Rate,
        maxSpread,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connectedWallet, swap, init],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    swapResult?.status === StreamStatus.IN_PROGRESS ||
    swapResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={swapResult.value}
        onExit={() => {
          init();
          switch (swapResult.status) {
            case StreamStatus.IN_PROGRESS:
              swapResult.abort();
              break;
            case StreamStatus.DONE:
              swapResult.clear();
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
        <p>I want to burn</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="burn"
        gridColumns={[120, '1fr']}
        error={!!invalidBurnAmount}
        leftHelperText={invalidBurnAmount}
        rightHelperText={
          !!connectedWallet && (
            <span>
              Balance:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  updateBurnAmount(
                    formatLunaInput(demicrofy(bank.tokenBalances.ubLuna)),
                    slippage,
                  )
                }
              >
                {formatLuna(demicrofy(bank.tokenBalances.ubLuna))}{' '}
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
        <NumberMuiInput
          placeholder="0.00"
          error={!!invalidBurnAmount}
          value={burnAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateBurnAmount(target.value, slippage)
          }
        />
      </SelectAndTextInputContainer>

      <IconLineSeparator />

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
        <NumberMuiInput
          placeholder="0.00"
          error={!!invalidBurnAmount}
          value={getAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateGetAmount(target.value, slippage)
          }
        />
      </SelectAndTextInputContainer>

      <DiscloseSlippageSelector
        className="slippage"
        items={slippageValues}
        value={slippage}
        onChange={updateSlippage}
        helpText={
          slippage < 0.005 ? (
            <SlippageSelectorNegativeHelpText>
              Your transaction may fail
            </SlippageSelectorNegativeHelpText>
          ) : undefined
        }
      />

      {burnAmount.length > 0 && simulation && (
        <TxFeeList className="receipt">
          <SwapListItem
            label="Price"
            currencyA="LUNA"
            currencyB="bLUNA"
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
            {formatLuna(demicrofy(simulation.minimumReceived))} LUNA
          </TxFeeListItem>
          <TxFeeListItem label="Trading Fee">
            {formatLuna(demicrofy(simulation.swapFee))} LUNA
          </TxFeeListItem>
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedFee))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      {/* Submit */}
      <ViewAddressWarning>
        <ActionButton
          className="submit"
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !swap ||
            !simulation ||
            burnAmount.length === 0 ||
            big(burnAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidBurnAmount ||
            big(simulation?.swapFee ?? 0).lte(0)
          }
          onClick={() =>
            simulation && proceed(burnAmount, simulation.beliefPrice, slippage)
          }
        >
          Burn
        </ActionButton>
      </ViewAddressWarning>
    </>
  );
}

function BlankComponent() {
  return <div />;
}
