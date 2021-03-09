import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
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
import { useService } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { swapBurnSimulation } from 'pages/basset/logics/swapBurnSimulation';
import { swapGetSimulation } from 'pages/basset/logics/swapGetSimulation';
import { querySimulation } from 'queries/simulation';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { validateBurnAmount } from '../logics/validateBurnAmount';
import { SwapSimulation } from '../models/swapSimulation';
import { useTerraswapBLunaPrice } from '../queries/terraswapBLunaPrice';
import { swapOptions } from '../transactions/swapOptions';

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
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const client = useApolloClient();

  const address = useContractAddress();

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

  const {
    data: { terraswapPoolInfo: bLunaPrice },
  } = useTerraswapBLunaPrice();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(() => validateTxFee(bank, fixedGas), [
    bank,
    fixedGas,
  ]);

  const invalidBurnAmount = useMemo(
    () => validateBurnAmount(burnAmount, bank),
    [bank, burnAmount],
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
      } else {
        const burnAmount: bLuna = nextBurnAmount as bLuna;
        setBurnAmount(burnAmount);

        if (serviceAvailable) {
          const amount = microfy(burnAmount).toString() as ubLuna;

          resolveSimulation(
            querySimulation(
              client,
              address,
              amount,
              address.terraswap.blunaLunaPair,
              {
                token: {
                  contract_addr: address.cw20.bLuna,
                },
              },
            ).then(({ data: { simulation } }) =>
              simulation
                ? swapGetSimulation(
                    simulation as terraswap.SimulationResponse<uLuna>,
                    amount,
                    bank.tax,
                  )
                : undefined,
            ),
          );
        }
      }
    },
    [address, bank.tax, client, resolveSimulation, serviceAvailable],
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
            querySimulation(
              client,
              address,
              amount,
              address.terraswap.blunaLunaPair,
              {
                native_token: {
                  denom: 'uluna' as Denom,
                },
              },
            ).then(({ data: { simulation } }) =>
              simulation
                ? swapBurnSimulation(
                    simulation as terraswap.SimulationResponse<uLuna>,
                    amount,
                    bank.tax,
                  )
                : undefined,
            ),
          );
        }
      }
    },
    [address, bank.tax, client, resolveSimulation, serviceAvailable],
  );

  const init = useCallback(() => {
    setGetAmount('' as Luna);
    setBurnAmount('' as bLuna);
  }, []);

  const proceed = useCallback(
    async (
      walletReady: WalletReady,
      burnAmount: bLuna,
      beliefPrice: Rate,
      maxSpread: Rate,
    ) => {
      const broadcasted = await swap({
        address: walletReady.walletAddress,
        amount: burnAmount,
        bAsset: burnCurrency.value,
        beliefPrice: formatExecuteMsgNumber(big(1).div(beliefPrice)),
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
