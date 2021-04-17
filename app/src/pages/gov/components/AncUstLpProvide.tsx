import { Plus } from '@anchor-protocol/icons';
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
import {
  useConnectedWallet,
  WalletReady,
} from '@anchor-protocol/wallet-provider';
import { InputAdornment } from '@material-ui/core';
import { max, min } from '@terra-dev/big-math';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { isZero } from '@terra-dev/is-zero';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@terra-dev/neumorphism-ui/components/useConfirm';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import big, { Big } from 'big.js';
import { IconLineSeparator } from 'components/IconLineSeparator';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { formatShareOfPool } from 'pages/gov/components/formatShareOfPool';
import { ancUstLpAncSimulation } from 'pages/gov/logics/ancUstLpAncSimulation';
import { ancUstLpUstSimulation } from 'pages/gov/logics/ancUstLpUstSimulation';
import { AncUstLpSimulation } from 'pages/gov/models/ancUstLpSimulation';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { ancUstLpProvideOptions } from 'pages/gov/transactions/ancUstLpProvideOptions';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

export function AncUstLpProvide() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const [openConfirm, confirmElement] = useConfirm();

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
      max(
        big(big(bank.userBalances.uUSD).minus(fixedGas)).div(
          big(big(1).plus(bank.tax.taxRate)).mul(bank.tax.taxRate),
        ),
        0,
      ),
      bank.tax.maxTaxUUSD,
    );

    return max(
      big(bank.userBalances.uUSD)
        .minus(txFee)
        .minus(fixedGas * 2),
      0,
    ) as uUST<Big>;
  }, [bank.tax.maxTaxUUSD, bank.tax.taxRate, bank.userBalances.uUSD, fixedGas]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidAncAmount = useMemo(() => {
    if (ancAmount.length === 0 || !connectedWallet) return undefined;

    return big(microfy(ancAmount)).gt(bank.userBalances.uANC)
      ? 'Not enough assets'
      : undefined;
  }, [ancAmount, bank.userBalances.uANC, connectedWallet]);

  const invalidUstAmount = useMemo(() => {
    if (ustAmount.length === 0 || !connectedWallet || !simulation)
      return undefined;

    return big(microfy(ustAmount))
      .plus(simulation.txFee)
      .plus(fixedGas)
      .gt(bank.userBalances.uUSD)
      ? 'Not enough assets'
      : undefined;
  }, [
    bank.userBalances.uUSD,
    connectedWallet,
    fixedGas,
    simulation,
    ustAmount,
  ]);

  const invalidNextTransaction = useMemo(() => {
    if (ustAmount.length === 0 || !simulation || !!invalidUstAmount) {
      return undefined;
    }

    const remainUUSD = big(bank.userBalances.uUSD)
      .minus(microfy(ustAmount))
      .minus(simulation.txFee)
      .minus(fixedGas);

    if (remainUUSD.lt(fixedGas)) {
      return 'You may run out of USD balance needed for future transactions.';
    }

    return undefined;
  }, [
    bank.userBalances.uUSD,
    fixedGas,
    invalidUstAmount,
    simulation,
    ustAmount,
  ]);

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
    async (
      walletReady: WalletReady,
      ancAmount: ANC,
      ustAmount: UST,
      txFee: uUST,
      confirm: ReactNode,
    ) => {
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

      const broadcasted = await provide({
        address: walletReady.walletAddress,
        token_amount: ancAmount,
        native_amount: ustAmount,
        quote: 'uusd',
        txFee,
      });

      if (!broadcasted) {
        init();
      }
    },
    [init, openConfirm, provide],
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

      {invalidNextTransaction && ustBalance && (
        <MessageBox style={{ marginTop: 30, marginBottom: 0 }}>
          {invalidNextTransaction}
        </MessageBox>
      )}

      {/* Submit */}
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
          ancAmount.length === 0 ||
          ustAmount.length === 0 ||
          big(ancAmount).lte(0) ||
          big(ustAmount).lte(0) ||
          !simulation ||
          !!invalidTxFee ||
          !!invalidAncAmount ||
          !!invalidUstAmount
        }
        onClick={() =>
          connectedWallet &&
          simulation &&
          proceed(
            connectedWallet,
            ancAmount,
            ustAmount,
            simulation.txFee.toFixed() as uUST,
            invalidNextTransaction,
          )
        }
      >
        Add Liquidity
      </ActionButton>

      {confirmElement}
    </>
  );
}
