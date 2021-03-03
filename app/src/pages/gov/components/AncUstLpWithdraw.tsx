import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatLP,
  formatLPInput,
  formatRateToPercentage,
  formatUST,
  microfy,
} from '@anchor-protocol/notation';
import { ANC, AncUstLP, UST } from '@anchor-protocol/types';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { Input, InputAdornment } from '@material-ui/core';
import big, { Big } from 'big.js';
import { ArrowDownLine } from 'components/ArrowDownLine';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { ancUstLpLpSimulation } from 'pages/gov/logics/ancUstLpLpSimulation';
import { AncUstLpSimulation } from 'pages/gov/models/ancUstLpSimulation';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { useRewardsAncUstLp } from 'pages/gov/queries/rewardsAncUstLp';
import { ancUstLpWithdrawOptions } from 'pages/gov/transactions/ancUstLpWithdrawOptions';
import React, { ChangeEvent, useCallback, useState } from 'react';

export function AncUstLpWithdraw() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

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
    data: { userLPBalance, userLPStakingInfo },
  } = useRewardsAncUstLp();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidLpAmount = useServiceConnectedMemo(
    () => {
      if (lpAmount.length === 0) return undefined;

      return big(microfy(lpAmount)).gt(bank.userBalances.uAncUstLP)
        ? 'Not enough assets'
        : undefined;
    },
    [bank.userBalances.uAncUstLP, lpAmount],
    undefined,
  );

  const updateLpAmount = useCallback(
    (nextLpAmount: string) => {
      if (
        !ancPrice ||
        !userLPBalance ||
        !userLPStakingInfo ||
        nextLpAmount.length === 0
      ) {
        setLpAmount('' as AncUstLP);
        setSimulation(null);
        return;
      }

      const nextSimulation = ancUstLpLpSimulation(
        ancPrice,
        userLPBalance,
        userLPStakingInfo,
        nextLpAmount as AncUstLP,
        fixedGas,
        bank,
      );

      setLpAmount(nextLpAmount as AncUstLP);
      setSimulation(nextSimulation);
    },
    [ancPrice, bank, fixedGas, userLPBalance, userLPStakingInfo],
  );

  const init = useCallback(() => {
    setLpAmount('' as AncUstLP);
    setSimulation(null);
  }, []);

  const proceed = useCallback(
    async (walletReady: WalletReady, lpAmount: AncUstLP) => {
      const broadcasted = await withdraw({
        address: walletReady.walletAddress,
        amount: lpAmount,
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

      <ArrowDownLine className="separator" />

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
              {formatRateToPercentage(simulation.shareOfPool)} %
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
          lpAmount.length === 0 ||
          big(lpAmount).lte(0) ||
          !!invalidTxFee ||
          !!invalidLpAmount
        }
        onClick={() => walletReady && proceed(walletReady, lpAmount)}
      >
        Remove Liquidity
      </ActionButton>
    </>
  );
}
