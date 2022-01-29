import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatLP,
  formatLPInput,
  formatUST,
} from '@anchor-protocol/notation';
import { AncUstLP } from '@anchor-protocol/types';
import {
  useAncAncUstLpStakeTx,
  useRewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy, microfy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { validateTxFee } from '@anchor-protocol/app-fns';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function AncUstLpStake() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const [stake, stakeResult] = useAncAncUstLpStakeTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [lpAmount, setLpAmount] = useState<AncUstLP>('' as AncUstLP);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const { data: { userLPBalance } = {} } = useRewardsAncUstLpRewardsQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => connected && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connected],
  );

  const invalidLpAmount = useMemo(() => {
    if (lpAmount.length === 0 || !userLPBalance) return undefined;

    return big(microfy(lpAmount)).gt(userLPBalance.balance)
      ? 'Not enough assets'
      : undefined;
  }, [lpAmount, userLPBalance]);

  const init = useCallback(() => {
    setLpAmount('' as AncUstLP);
  }, []);

  const proceed = useCallback(
    async (lpAmount: AncUstLP) => {
      if (!connected || !stake) {
        return;
      }

      stake({
        lpAmount,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connected, init, stake],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    stakeResult?.status === StreamStatus.IN_PROGRESS ||
    stakeResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={stakeResult.value}
        onExit={() => {
          init();

          switch (stakeResult.status) {
            case StreamStatus.IN_PROGRESS:
              stakeResult.abort();
              break;
            case StreamStatus.DONE:
              stakeResult.clear();
              break;
          }
        }}
      />
    );
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      <NumberInput
        className="amount"
        value={lpAmount}
        maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        error={!!invalidLpAmount}
        placeholder="0.00"
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setLpAmount(target.value as AncUstLP)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">LP</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidLpAmount}>
        <span>{invalidLpAmount}</span>
        <span>
          Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              userLPBalance &&
              setLpAmount(formatLPInput(demicrofy(userLPBalance.balance)))
            }
          >
            {userLPBalance ? formatLP(demicrofy(userLPBalance.balance)) : 0} LP
          </span>
        </span>
      </div>

      {lpAmount.length > 0 && (
        <TxFeeList className="receipt">
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
            !availablePost ||
            !connected ||
            !stake ||
            lpAmount.length === 0 ||
            big(lpAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidLpAmount
          }
          onClick={() => proceed(lpAmount)}
        >
          Stake
        </ActionButton>
      </ViewAddressWarning>
    </>
  );
}
