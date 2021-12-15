import { createHookMsg } from '@anchor-protocol/anchor.js/dist/utils/cw20/create-hook-msg';
import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useBondBLunaExchangeRateQuery,
  useBondBurnTx,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import {
  formatLuna,
  formatLunaInput,
  formatUST,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import type { bLuna, Luna } from '@anchor-protocol/types';
import { Gas, u, UST } from '@anchor-protocol/types';
import { useEstimateFee, useFixedFee } from '@libs/app-provider';
import { floor } from '@libs/big-math';
import { demicrofy, MICRO } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { pegRecovery } from 'pages/bond/logics/pegRecovery';
import { validateBurnAmount } from 'pages/bond/logics/validateBurnAmount';
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

const assetCurrencies: Item[] = [{ label: 'LUNA', value: 'luna' }];
const bAssetCurrencies: Item[] = [{ label: 'bLUNA', value: 'bluna' }];

export function Burn() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { contractAddress, gasPrice, constants } = useAnchorWebapp();

  const fixedFee = useFixedFee();

  const estimateFee = useEstimateFee(connectedWallet?.walletAddress);

  const [burn, burnResult] = useBondBurnTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [burnAmount, setBurnAmount] = useState<bLuna>('' as bLuna);
  const [getAmount, setGetAmount] = useState<Luna>('' as Luna);

  const [estimatedGasWanted, setEstimatedGasWanted] = useState<Gas>(
    constants.bondGasWanted,
  );
  const [estimatedFee, setEstimatedFee] = useState<u<UST>>(fixedFee);

  const [burnCurrency, setBurnCurrency] = useState<Item>(
    () => bAssetCurrencies[0],
  );
  const [getCurrency, setGetCurrency] = useState<Item>(
    () => assetCurrencies[0],
  );

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const { data: { state: exchangeRate, parameters } = {} } =
    useBondBLunaExchangeRateQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const pegRecoveryFee = useMemo(
    () => pegRecovery(exchangeRate, parameters),
    [exchangeRate, parameters],
  );

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
    if (!connectedWallet || burnAmount.length === 0) {
      return;
    }

    estimateFee([
      new MsgExecuteContract(
        connectedWallet.terraAddress,
        contractAddress.cw20.bLuna,
        {
          send: {
            contract: contractAddress.bluna.hub,
            amount: floor(big(burnAmount).mul(MICRO)).toFixed(),
            msg: createHookMsg({
              unbond: {},
            }),
          },
        },
      ),
    ]).then((estimated) => {
      if (estimated) {
        setEstimatedGasWanted(estimated.gasWanted);
        setEstimatedFee(
          big(estimated.txFee).mul(gasPrice.uusd).toFixed() as u<UST>,
        );
      } else {
        setEstimatedGasWanted(constants.bondGasWanted);
        setEstimatedFee(fixedFee);
      }
    });
  }, [
    burnAmount,
    connectedWallet,
    constants.bondGasWanted,
    contractAddress.bluna.hub,
    contractAddress.cw20.bLuna,
    estimateFee,
    fixedFee,
    gasPrice.uusd,
  ]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBurnCurrency = useCallback((nextBurnCurrencyValue: string) => {
    setBurnCurrency(
      bAssetCurrencies.find(({ value }) => nextBurnCurrencyValue === value) ??
        bAssetCurrencies[0],
    );
  }, []);

  const updateGetCurrency = useCallback((nextGetCurrencyValue: string) => {
    setGetCurrency(
      assetCurrencies.find(({ value }) => nextGetCurrencyValue === value) ??
        assetCurrencies[0],
    );
  }, []);

  const updateBurnAmount = useCallback(
    (nextBurnAmount: string) => {
      if (nextBurnAmount.trim().length === 0) {
        setGetAmount('' as Luna);
        setBurnAmount('' as bLuna);
      } else {
        const burnAmount: bLuna = nextBurnAmount as bLuna;
        const getAmount: Luna = formatLunaInput(
          big(burnAmount).mul(exchangeRate?.exchange_rate ?? 1) as Luna<Big>,
        );

        setGetAmount(getAmount);
        setBurnAmount(burnAmount);
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const updateGetAmount = useCallback(
    (nextGetAmount: string) => {
      if (nextGetAmount.trim().length === 0) {
        setBurnAmount('' as bLuna);
        setGetAmount('' as Luna);
      } else {
        const getAmount: Luna = nextGetAmount as Luna;
        const burnAmount: bLuna = formatLunaInput(
          big(getAmount).div(exchangeRate?.exchange_rate ?? 1) as bLuna<Big>,
        );

        setBurnAmount(burnAmount);
        setGetAmount(getAmount);
      }
    },
    [exchangeRate?.exchange_rate],
  );

  const init = useCallback(() => {
    setGetAmount('' as Luna);
    setBurnAmount('' as bLuna);
  }, []);

  const proceed = useCallback(
    (burnAmount: bLuna, gasWanted: Gas, txFee: u<UST>) => {
      if (!connectedWallet || !burn) {
        return;
      }

      burn({
        burnAmount,
        gasWanted,
        txFee,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [burn, connectedWallet, init],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    burnResult?.status === StreamStatus.IN_PROGRESS ||
    burnResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={burnResult.value}
        onExit={() => {
          init();
          switch (burnResult.status) {
            case StreamStatus.IN_PROGRESS:
              burnResult.abort();
              break;
            case StreamStatus.DONE:
              burnResult.clear();
              break;
          }
        }}
      />
    );
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      {pegRecoveryFee && (
        <MessageBox
          level="info"
          hide={{ id: 'burn_peg', period: 1000 * 60 * 60 * 24 * 7 }}
        >
          When exchange rate is lower than threshold,
          <br />
          protocol charges peg recovery fee for each Mint/Burn action.
        </MessageBox>
      )}

      <MessageBox
        level="info"
        hide={{ id: 'burn', period: 1000 * 60 * 60 * 24 * 7 }}
      >
        Default bLuna redemptions take at least 21 days to process.
        <br />
        Slashing events during the 21 days may affect the final amount
        withdrawn.
        <br />
        Redemptions are processed in 3-day batches and may take up to 24 days.
      </MessageBox>

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
          IconComponent={
            bAssetCurrencies.length < 2 ? BlankComponent : undefined
          }
          disabled={bAssetCurrencies.length < 2}
        >
          {bAssetCurrencies.map(({ label, value }) => (
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
          IconComponent={
            assetCurrencies.length < 2 ? BlankComponent : undefined
          }
          disabled={assetCurrencies.length < 2}
        >
          {assetCurrencies.map(({ label, value }) => (
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

      <TxFeeList className="receipt">
        {exchangeRate && (
          <SwapListItem
            label="Price"
            currencyA={burnCurrency.label}
            currencyB={getCurrency.label}
            exchangeRateAB={exchangeRate.exchange_rate}
            formatExchangeRate={(ratio) => formatLuna(ratio as Luna<Big>)}
          />
        )}
        {!!pegRecoveryFee && getAmount.length > 0 && (
          <TxFeeListItem label={<IconSpan>Peg Recovery Fee</IconSpan>}>
            {formatLuna(demicrofy(pegRecoveryFee(getAmount)))} LUNA
          </TxFeeListItem>
        )}
        {burnAmount.length > 0 && (
          <TxFeeListItem label={<IconSpan>Estimated Tx Fee</IconSpan>}>
            ≈ {formatUST(demicrofy(estimatedFee))} UST
          </TxFeeListItem>
        )}
      </TxFeeList>

      {/* Submit */}
      <ViewAddressWarning>
        <ActionButton
          className="submit"
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !burn ||
            burnAmount.length === 0 ||
            big(burnAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidBurnAmount
          }
          onClick={() => proceed(burnAmount, estimatedGasWanted, estimatedFee)}
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
