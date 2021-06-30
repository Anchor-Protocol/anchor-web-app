import {
  demicrofy,
  formatExecuteMsgNumber,
  formatFluidDecimalPoints,
  formatLuna,
  formatLunaInput,
  formatUST,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  microfy,
} from '@anchor-protocol/notation';
import type {
  bLuna,
  Denom,
  Luna,
  Rate,
  ubLuna,
  uLuna,
} from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import {
  terraswapSimulationQuery,
  useAnchorWebapp,
  useBondBLunaPriceQuery,
  useBondSwapTx,
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
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { validateTxFee } from 'logics/validateTxFee';
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

const burnCurrencies: Item[] = [{ label: 'bLuna', value: 'bluna' }];
const getCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];

export function Swap() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { mantleEndpoint, mantleFetch } = useTerraWebapp();
  const {
    constants: { fixedGas },
    contractAddress: address,
  } = useAnchorWebapp();

  const [swap, swapResult] = useBondSwapTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [burnAmount, setBurnAmount] = useState<bLuna>('' as bLuna);
  const [getAmount, setGetAmount] = useState<Luna>('' as Luna);

  const [resolveSimulation, simulation] = useResolveLast<
    SwapSimulation<uLuna, ubLuna> | undefined | null
  >(() => null);

  const [burnCurrency, setBurnCurrency] = useState<Item>(
    () => burnCurrencies[0],
  );
  const [getCurrency, setGetCurrency] = useState<Item>(() => getCurrencies[0]);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { data: { bLunaPrice } = {} } = useBondBLunaPriceQuery();

  //const {
  //  data: { terraswapPoolInfo: bLunaPrice },
  //} = useTerraswapBLunaPrice();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
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
    async (nextBurnAmount: string) => {
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

        const amount = microfy(burnAmount).toString() as ubLuna;

        resolveSimulation(
          terraswapSimulationQuery({
            mantleEndpoint,
            mantleFetch,
            wasmQuery: {
              simulation: {
                contractAddress: address.terraswap.blunaLunaPair,
                query: {
                  simulation: {
                    offer_asset: {
                      info: {
                        token: {
                          contract_addr: address.cw20.bLuna,
                        },
                      },
                      amount,
                    },
                  },
                },
              },
            },
          }).then(({ simulation }) => {
            return simulation
              ? swapGetSimulation(
                  simulation as terraswap.SimulationResponse<uLuna>,
                  amount,
                  bank.tax,
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
      mantleEndpoint,
      mantleFetch,
      resolveSimulation,
    ],
  );

  const updateGetAmount = useCallback(
    (nextGetAmount: string) => {
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

        const amount = microfy(getAmount).toString() as uLuna;

        resolveSimulation(
          terraswapSimulationQuery({
            mantleEndpoint,
            mantleFetch,
            wasmQuery: {
              simulation: {
                contractAddress: address.terraswap.blunaLunaPair,
                query: {
                  simulation: {
                    offer_asset: {
                      info: {
                        native_token: {
                          denom: 'uluna' as Denom,
                        },
                      },
                      amount,
                    },
                  },
                },
              },
            },
          }).then(({ simulation }) => {
            return simulation
              ? swapBurnSimulation(
                  simulation as terraswap.SimulationResponse<uLuna>,
                  amount,
                  bank.tax,
                )
              : undefined;
          }),
        );
      }
    },
    [
      address.terraswap.blunaLunaPair,
      bank.tax,
      mantleEndpoint,
      mantleFetch,
      resolveSimulation,
    ],
  );

  const init = useCallback(() => {
    setGetAmount('' as Luna);
    setBurnAmount('' as bLuna);
  }, []);

  const proceed = useCallback(
    (burnAmount: bLuna, beliefPrice: Rate, maxSpread: Rate) => {
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
            updateBurnAmount(target.value)
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
            simulation &&
            proceed(burnAmount, simulation.beliefPrice, simulation.maxSpread)
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
