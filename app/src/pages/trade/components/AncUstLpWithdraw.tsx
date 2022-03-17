import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatANC,
  formatLP,
  formatLPInput,
  formatUST,
} from '@anchor-protocol/notation';
import { ANC, AncUstLP, UST } from '@anchor-protocol/types';
import {
  useAncAncUstLpWithdrawTx,
  useAncPriceQuery,
  useRewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy, microfy } from '@libs/formatter';
import { isZero } from '@libs/is-zero';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { Input, InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { validateTxFee } from '@anchor-protocol/app-fns';
import { formatShareOfPool } from 'pages/gov/components/formatShareOfPool';
import { ancUstLpLpSimulation } from 'pages/trade/logics/ancUstLpLpSimulation';
import { AncUstLpSimulation } from 'pages/trade/models/ancUstLpSimulation';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncUstLpWithdraw() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const [withdraw, withdrawResult] = useAncAncUstLpWithdrawTx();

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
  const bank = useAnchorBank();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const { data: { userLPBalance } = {} } = useRewardsAncUstLpRewardsQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => connected && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [connected, bank, fixedFee],
  );

  const invalidLpAmount = useMemo(() => {
    if (lpAmount.length === 0 || !connected) return undefined;

    return big(microfy(lpAmount)).gt(bank.tokenBalances.uAncUstLP)
      ? 'Not enough assets'
      : undefined;
  }, [bank.tokenBalances.uAncUstLP, lpAmount, connected]);

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
        fixedFee,
        bank,
      );

      setLpAmount(nextLpAmount as AncUstLP);
      setSimulation(nextSimulation);
    },
    [ancPrice, bank, fixedFee, userLPBalance],
  );

  const init = useCallback(() => {
    setLpAmount('' as AncUstLP);
    setSimulation(null);
  }, []);

  const proceed = useCallback(
    (lpAmount: AncUstLP) => {
      if (!connected || !withdraw) {
        return;
      }

      withdraw({
        lpAmount,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connected, init, withdraw],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    withdrawResult?.status === StreamStatus.IN_PROGRESS ||
    withdrawResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={withdrawResult.value}
        onExit={() => {
          init();

          switch (withdrawResult.status) {
            case StreamStatus.IN_PROGRESS:
              withdrawResult.abort();
              break;
            case StreamStatus.DONE:
              withdrawResult.clear();
              break;
          }
        }}
      />
    );
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
                formatLPInput(demicrofy(bank.tokenBalances.uAncUstLP)),
              )
            }
          >
            {formatLP(demicrofy(bank.tokenBalances.uAncUstLP))} LP
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
      <ViewAddressWarning>
        <ActionButton
          className="submit"
          disabled={
            !availablePost ||
            !connected ||
            !withdraw ||
            lpAmount.length === 0 ||
            big(lpAmount).lte(0) ||
            !simulation ||
            !!invalidTxFee ||
            !!invalidLpAmount
          }
          onClick={() => proceed(lpAmount)}
        >
          Remove Liquidity
        </ActionButton>
      </ViewAddressWarning>
    </>
  );
}
