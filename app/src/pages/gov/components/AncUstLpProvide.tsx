import { Plus } from '@anchor-protocol/icons';
import { min } from '@terra-dev/big-math';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { isZero } from '@terra-dev/is-zero';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatANCInput,
  formatLP,
  formatUST,
  formatUSTInput,
  microfy,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { ANC, UST, uUST } from '@anchor-protocol/types';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { InputAdornment } from '@material-ui/core';
import big, { Big } from 'big.js';
import { IconLineSeparator } from 'components/IconLineSeparator';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import { useService } from 'base/contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { formatShareOfPool } from 'pages/gov/components/formatShareOfPool';
import { ancUstLpAncSimulation } from 'pages/gov/logics/ancUstLpAncSimulation';
import { ancUstLpUstSimulation } from 'pages/gov/logics/ancUstLpUstSimulation';
import { AncUstLpSimulation } from 'pages/gov/models/ancUstLpSimulation';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { ancUstLpProvideOptions } from 'pages/gov/transactions/ancUstLpProvideOptions';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncUstLpProvide() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [ancAmount, setAncAmount] = useState<ANC>('' as ANC);
  const [ustAmount, setUstAmount] = useState<UST>('' as UST);

  const [simulation, setSimulation] = useState<AncUstLpSimulation<Big> | null>(
    null,
  );

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: { ancPrice },
  } = useANCPrice();

  // ---------------------------------------------
  // transaction
  // ---------------------------------------------
  const [provide, provideResult] = useOperation(ancUstLpProvideOptions, {
    bank,
    ancPrice,
  });

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
      .minus(fixedGas) as uUST<Big>;
  }, [bank.tax.maxTaxUUSD, bank.tax.taxRate, bank.userBalances.uUSD, fixedGas]);

  const invalidTxFee = useMemo(
    () => serviceAvailable && validateTxFee(bank, fixedGas),
    [bank, fixedGas, serviceAvailable],
  );

  const invalidAncAmount = useMemo(() => {
    if (ancAmount.length === 0 || !serviceAvailable) return undefined;

    return big(microfy(ancAmount)).gt(bank.userBalances.uANC)
      ? 'Not enough assets'
      : undefined;
  }, [ancAmount, bank.userBalances.uANC, serviceAvailable]);

  const invalidUstAmount = useMemo(() => {
    if (ustAmount.length === 0 || !serviceAvailable) return undefined;

    return big(microfy(ustAmount)).gt(bank.userBalances.uUSD)
      ? 'Not enough assets'
      : undefined;
  }, [bank.userBalances.uUSD, serviceAvailable, ustAmount]);

  const updateAncAmount = useCallback(
    (nextAncAmount: string) => {
      if (!ancPrice || nextAncAmount.length === 0) {
        setAncAmount('' as ANC);
        setUstAmount('' as UST);
        setSimulation(null);
        return;
      } else if (isZero(nextAncAmount)) {
        setUstAmount('' as UST);
        setAncAmount(nextAncAmount as ANC);
        setSimulation(null);
        return;
      }

      const { ustAmount, ...nextSimulation } = ancUstLpAncSimulation(
        ancPrice,
        nextAncAmount as ANC,
        fixedGas,
        bank,
      );

      setAncAmount(nextAncAmount as ANC);
      ustAmount && setUstAmount(formatUSTInput(ustAmount));
      setSimulation(nextSimulation);
    },
    [ancPrice, bank, fixedGas],
  );

  const updateUstAmount = useCallback(
    (nextUstAmount: string) => {
      if (!ancPrice || nextUstAmount.length === 0) {
        setAncAmount('' as ANC);
        setUstAmount('' as UST);
        setSimulation(null);
        return;
      } else if (isZero(nextUstAmount)) {
        setAncAmount('' as ANC);
        setUstAmount(nextUstAmount as UST);
        setSimulation(null);
        return;
      }

      const { ancAmount, ...nextSimulation } = ancUstLpUstSimulation(
        ancPrice,
        nextUstAmount as UST,
        fixedGas,
        bank,
      );

      ancAmount && setAncAmount(formatANCInput(ancAmount));
      setUstAmount(nextUstAmount as UST);
      setSimulation(nextSimulation);
    },
    [ancPrice, bank, fixedGas],
  );

  const init = useCallback(() => {
    setAncAmount('' as ANC);
    setUstAmount('' as UST);
    setSimulation(null);
  }, []);

  const proceed = useCallback(
    async (walletReady: WalletReady, ancAmount: ANC, ustAmount: UST) => {
      const broadcasted = await provide({
        address: walletReady.walletAddress,
        tokenAmount: ancAmount,
        nativeAmount: ustAmount,
        quote: 'uusd',
      });

      if (!broadcasted) {
        init();
      }
    },
    [init, provide],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    provideResult?.status === 'in-progress' ||
    provideResult?.status === 'done' ||
    provideResult?.status === 'fault'
  ) {
    return <TransactionRenderer result={provideResult} onExit={init} />;
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      {/* ANC */}
      <div className="description">
        <p>Input</p>
        <p />
      </div>

      <NumberInput
        className="amount"
        value={ancAmount}
        maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        placeholder="0.00"
        error={!!invalidAncAmount}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          updateAncAmount(target.value)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">ANC</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidAncAmount}>
        <span>{invalidAncAmount}</span>
        <span>
          ANC Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              updateAncAmount(formatANCInput(demicrofy(bank.userBalances.uANC)))
            }
          >
            {formatANC(demicrofy(bank.userBalances.uANC))} ANC
          </span>
        </span>
      </div>

      <IconLineSeparator className="separator" Icon={Plus} />

      {/* UST */}
      <div className="description">
        <p>Input UST</p>
        <p />
      </div>

      <NumberInput
        className="amount"
        value={ustAmount}
        maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
        placeholder="0.00"
        error={!!invalidUstAmount}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          updateUstAmount(target.value)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">UST</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidUstAmount}>
        <span>{invalidUstAmount}</span>
        <span>
          UST Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              updateUstAmount(
                formatUSTInput(demicrofy(ustBalance ?? bank.userBalances.uUSD)),
              )
            }
          >
            {formatUST(demicrofy(ustBalance ?? bank.userBalances.uUSD))} UST
          </span>
        </span>
      </div>

      <TxFeeList className="receipt">
        {simulation && (
          <>
            <SwapListItem
              label="Pool Price"
              currencyA="UST"
              currencyB="ANC"
              initialDirection="a/b"
              exchangeRateAB={demicrofy(simulation.poolPrice)}
              formatExchangeRate={(ratio, direction) =>
                direction === 'a/b'
                  ? formatANC(ratio as ANC<Big>)
                  : formatUST(ratio as UST<Big>)
              }
            />
            <TxFeeListItem label="LP from Tx">
              {formatLP(simulation.lpFromTx)} LP
            </TxFeeListItem>
            <TxFeeListItem label="Share of Pool">
              {formatShareOfPool(simulation.shareOfPool)} %
            </TxFeeListItem>
            <TxFeeListItem label="Tx Fee">
              {formatUST(demicrofy(simulation.txFee))} UST
            </TxFeeListItem>
          </>
        )}
      </TxFeeList>

      {/* Submit */}
      <ActionButton
        className="submit"
        disabled={
          !serviceAvailable ||
          ancAmount.length === 0 ||
          ustAmount.length === 0 ||
          big(ancAmount).lte(0) ||
          big(ustAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidAncAmount ||
          !!invalidUstAmount
        }
        onClick={() =>
          walletReady && proceed(walletReady, ancAmount, ustAmount)
        }
      >
        Add Liquidity
      </ActionButton>
    </>
  );
}
