import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatLP,
  formatLPInput,
  formatUST,
  microfy,
} from '@anchor-protocol/notation';
import { ANC, AncUstLP, UST, uUST } from '@anchor-protocol/types';
import {
  useConnectedWallet,
  WalletReady,
} from '@anchor-protocol/wallet-provider';
import { Input, InputAdornment } from '@material-ui/core';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { isZero } from '@terra-dev/is-zero';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import { SelectAndTextInputContainer } from '@terra-dev/neumorphism-ui/components/SelectAndTextInputContainer';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import big, { Big } from 'big.js';
import { IconLineSeparator } from 'components/IconLineSeparator';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { formatShareOfPool } from 'pages/gov/components/formatShareOfPool';
import { ancUstLpLpSimulation } from 'pages/gov/logics/ancUstLpLpSimulation';
import { AncUstLpSimulation } from 'pages/gov/models/ancUstLpSimulation';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { useRewardsAncUstLp } from 'pages/gov/queries/rewardsAncUstLp';
import { ancUstLpWithdrawOptions } from 'pages/gov/transactions/ancUstLpWithdrawOptions';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncUstLpWithdraw() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { fixedGas } = useConstants();

  const [withdraw, withdrawResult] = useOperation(ancUstLpWithdrawOptions, {});

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [lpAmount, setLpAmount] = useState<AncUstLP>('' as AncUstLP);

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

  const {
    data: { userLPBalance },
  } = useRewardsAncUstLp();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidLpAmount = useMemo(() => {
    if (lpAmount.length === 0 || !connectedWallet) return undefined;

    return big(microfy(lpAmount)).gt(bank.userBalances.uAncUstLP)
      ? 'Not enough assets'
      : undefined;
  }, [bank.userBalances.uAncUstLP, lpAmount, connectedWallet]);

  const updateLpAmount = useCallback(
    (nextLpAmount: string) => {
      if (!ancPrice || nextLpAmount.length === 0) {
        setLpAmount('' as AncUstLP);
        setSimulation(null);
        return;
      } else if (isZero(nextLpAmount)) {
        setLpAmount(nextLpAmount as AncUstLP);
        setSimulation(null);
        return;
      }

      const nextSimulation = ancUstLpLpSimulation(
        ancPrice,
        userLPBalance,
        nextLpAmount as AncUstLP,
        fixedGas,
        bank,
      );

      setLpAmount(nextLpAmount as AncUstLP);
      setSimulation(nextSimulation);
    },
    [ancPrice, bank, fixedGas, userLPBalance],
  );

  const init = useCallback(() => {
    setLpAmount('' as AncUstLP);
    setSimulation(null);
  }, []);

  const proceed = useCallback(
    async (walletReady: WalletReady, lpAmount: AncUstLP, txFee: uUST) => {
      const broadcasted = await withdraw({
        address: walletReady.walletAddress,
        amount: lpAmount,
        txFee,
      });

      if (!broadcasted) {
        init();
      }
    },
    [init, withdraw],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    withdrawResult?.status === 'in-progress' ||
    withdrawResult?.status === 'done' ||
    withdrawResult?.status === 'fault'
  ) {
    return <TransactionRenderer result={withdrawResult} onExit={init} />;
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
        value={lpAmount}
        maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        error={!!invalidLpAmount}
        placeholder="0.00"
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          updateLpAmount(target.value)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">LP</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidLpAmount}>
        <span>{invalidLpAmount}</span>
        <span>
          ANC-UST LP Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              updateLpAmount(
                formatLPInput(demicrofy(bank.userBalances.uAncUstLP)),
              )
            }
          >
            {formatLP(demicrofy(bank.userBalances.uAncUstLP))} LP
          </span>
        </span>
      </div>

      <IconLineSeparator className="separator" />

      {/* UST */}
      <div className="description">
        <p>Output</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        gridColumns={[120, '1fr']}
        gridRows={[60, 60]}
        aria-readonly
      >
        <Input readOnly value="ANC" />
        <Input
          readOnly
          value={simulation?.ancAmount ? formatANC(simulation.ancAmount) : ''}
        />
        <Input readOnly value="UST" />
        <Input
          readOnly
          value={simulation?.ustAmount ? formatUST(simulation.ustAmount) : ''}
        />
      </SelectAndTextInputContainer>

      <TxFeeList className="receipt">
        {simulation && (
          <>
            <SwapListItem
              label="Pool Price"
              currencyA="UST"
              currencyB="ANC"
              exchangeRateAB={demicrofy(simulation.poolPrice)}
              formatExchangeRate={(ratio, direction) =>
                direction === 'a/b'
                  ? formatANC(ratio as ANC<Big>)
                  : formatUST(ratio as UST<Big>)
              }
            />
            <TxFeeListItem label="LP after Tx">
              {formatLP(simulation.lpFromTx)} LP
            </TxFeeListItem>
            <TxFeeListItem label="Pool Share after Tx">
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
          !connectedWallet ||
          lpAmount.length === 0 ||
          big(lpAmount).lte(0) ||
          !simulation ||
          !!invalidTxFee ||
          !!invalidLpAmount
        }
        onClick={() =>
          connectedWallet &&
          simulation &&
          proceed(connectedWallet, lpAmount, simulation.txFee.toFixed() as uUST)
        }
      >
        Remove Liquidity
      </ActionButton>
    </>
  );
}
